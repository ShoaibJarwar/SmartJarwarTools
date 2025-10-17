import os
import tempfile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse
from pypdf import PdfWriter
from .serializers import PdfMergerSerializer


# Create your views here.
class PdfMergeAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PdfMergerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        pdf_files = serializer.validated_data["files"]
        writer = PdfWriter()
        try:
            for pdf in pdf_files:
                writer.append(pdf)
            
            temp_file = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
            with open(temp_file.name, "wb") as f:
                writer.write(f)
            writer.close()
            
            merged_file = open(temp_file.name, "rb")
            
            response = FileResponse(merged_file, content_type='application/pdf')
            response["Content-Disposition"] = 'attachment; filename="merged.pdf"'
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        finally:
            writer.close()