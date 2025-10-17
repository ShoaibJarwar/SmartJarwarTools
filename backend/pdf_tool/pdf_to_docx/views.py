import os
from docx import Document
import tempfile 
from pdf2docx import Converter 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from .serializers import PdfToDocxSerializer
from docx.shared import Pt, RGBColor
from docx import Document

def apply_text_formatting(docx_path):
    doc = Document(docx_path)
    for para in doc.paragraphs:
        for run in para.runs:
            # Check and apply font family
            run.font.name = 'Arial'  # Change to the desired font
            # Set font size, increase the font size conditionally
            run.font.size = Pt(12)  # Can modify this dynamically as per requirement
            # Set font color
            run.font.color.rgb = RGBColor(0, 0, 0)  # Can adjust RGB values as needed
            
            # Check for Bold, Italic, or Underline styles
            if run.bold:
                run.font.bold = True
            else:
                run.font.bold = False
                
            if run.italic:
                run.font.italic = True
            else:
                run.font.italic = False

            if run.underline:
                run.font.underline = True
            else:
                run.font.underline = False

    # Save the document with new formatting
    doc.save(docx_path)


class PdfToDocAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = PdfToDocxSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        pdf_file = serializer.validated_data["pdf_file"]

        temp_pdf_path = None
        temp_docx_path = None
        try:
            # Save uploaded PDF to a temp path
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_pdf:
                for chunk in pdf_file.chunks():
                    tmp_pdf.write(chunk)
                temp_pdf_path = tmp_pdf.name

            # Prepare output DOCX path
            fd, temp_docx_path = tempfile.mkstemp(suffix=".docx")
            os.close(fd)
 
            # Convert while preserving layout
            cv = Converter(temp_pdf_path)
            cv.convert(temp_docx_path)
            cv.close()

            # Post-process to apply custom formatting
            apply_text_formatting(temp_docx_path)

            # Stream the docx to the client
            filename_base = pdf_file.name.rsplit(".", 1)[0]
            return FileResponse(
                open(temp_docx_path, "rb"),
                as_attachment=True,
                filename=f"{filename_base}.docx",
                content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )

        except Exception:
            return Response({"error": "Failed to convert PDF to DOCX."}, status=500)

        finally:
            # Clean up temps
            if temp_pdf_path and os.path.exists(temp_pdf_path):
                try:
                    os.remove(temp_pdf_path)
                except Exception:
                    pass
            if temp_docx_path and os.path.exists(temp_docx_path):
                try:
                    os.remove(temp_docx_path)
                except Exception:
                    pass
