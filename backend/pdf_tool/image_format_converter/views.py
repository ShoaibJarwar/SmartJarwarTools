# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image
from io import BytesIO
from django.http import HttpResponse
from .serializers import ImageFormatConverterSerializer

# Register extra image format plugins
from pillow_heif import register_heif_opener
import pillow_avif

register_heif_opener()  # enables HEIF/HEIC support
# pillow_avif auto-registers AVIF support on import


class ImageFormatConverterView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = ImageFormatConverterSerializer(data=request.data)
        if serializer.is_valid():
            image_file = serializer.validated_data["image"]
            targeted_format = serializer.validated_data["format"].upper()

            # ✅ Safe allowed formats
            allowed_formats = ["JPEG", "PNG", "WEBP", "BMP", "GIF", "TIFF", "HEIF", "AVIF"]

            if targeted_format not in allowed_formats:
                return Response(
                    {"error": f"Unsupported format '{targeted_format}'"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                img = Image.open(image_file)
                img_io = BytesIO()

                # Pillow auto-detects encoder from format
                img.save(img_io, format=targeted_format)
                img_io.seek(0)

                # correct content type
                content_type = f"image/{targeted_format.lower()}"
                response = HttpResponse(img_io, content_type=content_type)
                response["Content-Disposition"] = (
                    f'attachment; filename="converted.{targeted_format.lower()}"'
                )
                return response

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
