import os
import io
import gzip
import tempfile
import zipfile
import ffmpeg
import pikepdf
from PIL import Image
from django.conf import settings
from django.http import JsonResponse, FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileCompressorSerializer


class SmartCompressorView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = FileCompressorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        files = serializer.validated_data["files"]

        image_quality = serializer.validated_data.get("image_quality", 60)
        video_bitrate = serializer.validated_data.get("video_bitrate", "800k")
        audio_bitrate = serializer.validated_data.get("audio_bitrate", "128k")

        results = []

        # ✅ Ensure output directory exists
        output_dir = os.path.join(settings.MEDIA_ROOT, "compressed")
        os.makedirs(output_dir, exist_ok=True)

        for uploaded_file in files:
            ext = os.path.splitext(uploaded_file.name)[1].lower()
            original_size = uploaded_file.size
            output_name = os.path.splitext(uploaded_file.name)[0]
            compressed_data = None
            output_path = None

            try:
                # 🖼️ IMAGE FILES
                if ext in [".jpg", ".jpeg", ".png", ".webp"]:
                    img = Image.open(uploaded_file).convert("RGB")
                    output_buffer = io.BytesIO()
                    img.save(output_buffer, format="JPEG", quality=image_quality, optimize=True)
                    compressed_data = output_buffer.getvalue()
                    output_name += "_compressed.jpg"

                # 📄 PDF FILES
                elif ext == ".pdf":
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_in:
                        temp_in.write(uploaded_file.read())
                        temp_in.flush()

                    fd_out, temp_out_path = tempfile.mkstemp(suffix="_compressed.pdf")
                    os.close(fd_out)

                    try:
                        with pikepdf.open(temp_in.name) as pdf:
                            pdf.remove_unreferenced_resources()
                            pdf.save(temp_out_path, compress_streams=True)

                        with open(temp_out_path, "rb") as f:
                            compressed_data = f.read()

                        output_name += "_compressed.pdf"

                    finally:
                        for path in [temp_in.name, temp_out_path]:
                            if os.path.exists(path):
                                try:
                                    os.remove(path)
                                except PermissionError:
                                    pass

                # 🎥 VIDEO FILES
                elif ext in [".mp4", ".mov", ".avi", ".mkv"]:
                    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_in:
                        temp_in.write(uploaded_file.read())
                        temp_in.flush()

                    temp_out = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
                    try:
                        (
                            ffmpeg
                            .input(temp_in.name)
                            .output(temp_out.name, video_bitrate=video_bitrate, audio_bitrate=audio_bitrate)
                            .run(quiet=True, overwrite_output=True)
                        )
                        with open(temp_out.name, "rb") as f:
                            compressed_data = f.read()
                        output_name += "_compressed" + ext
                    finally:
                        for t in [temp_in.name, temp_out.name]:
                            if os.path.exists(t):
                                os.remove(t)

                # 🧾 TEXT / CODE FILES
                elif ext in [".txt", ".csv", ".json", ".xml", ".py", ".js", ".html", ".css"]:
                    output_buffer = io.BytesIO()
                    with gzip.GzipFile(fileobj=output_buffer, mode="wb") as gz:
                        gz.write(uploaded_file.read())
                    compressed_data = output_buffer.getvalue()
                    output_name += ".gz"

                # 📝 DOCX FILES
                elif ext == ".docx":
                    with tempfile.TemporaryDirectory() as tmpdir:
                        temp_input = os.path.join(tmpdir, "input.docx")
                        with open(temp_input, "wb") as f:
                            f.write(uploaded_file.read())

                        # Extract and recompress content
                        with zipfile.ZipFile(temp_input, 'r') as zin:
                            zin.extractall(tmpdir)

                        optimized_docx = io.BytesIO()
                        with zipfile.ZipFile(optimized_docx, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
                            for root, dirs, files in os.walk(tmpdir):
                                for file in files:
                                    file_path = os.path.join(root, file)
                                    arcname = os.path.relpath(file_path, tmpdir)
                                    zout.write(file_path, arcname)
                        optimized_docx.seek(0)
                        compressed_data = optimized_docx.read()
                        output_name += "_optimized.docx"

                else:
                    results.append({
                        "file": uploaded_file.name,
                        "status": "unsupported"
                    })
                    continue

                # ✅ Save compressed file to disk
                output_path = os.path.join(output_dir, output_name)
                with open(output_path, "wb") as out_file:
                    out_file.write(compressed_data)

                # ✅ Build absolute download URL
                download_url = request.build_absolute_uri(f"/download/{output_name}")

                # ✅ Compute compression stats safely
                compressed_size = len(compressed_data)
                saved_percent = 0 if original_size == 0 else round((1 - compressed_size / original_size) * 100, 2)

                results.append({
                    "file": uploaded_file.name,
                    "compressed_name": output_name,
                    "original_size": original_size,
                    "compressed_size": compressed_size,
                    "saved_percent": saved_percent,
                    "status": "success",
                    "download_url": download_url
                })

            except Exception as e:
                # 🧯 Graceful error handling per file
                if output_path and os.path.exists(output_path):
                    os.remove(output_path)
                results.append({
                    "file": uploaded_file.name,
                    "status": f"error: {str(e)}"
                })

        return JsonResponse({"results": results})


def download_file(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, "compressed", filename)
    if not os.path.exists(file_path):
        raise Http404("File not found")

    return FileResponse(open(file_path, "rb"), as_attachment=True)
