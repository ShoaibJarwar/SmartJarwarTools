import io 
import fitz
import base64

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from PIL import Image
from .serializers import PdfToImagesSerializer

class PdfToImagesView(APIView):
    def post(self, request, formate=None):
        serializer =  PdfToImagesSerializer(data=request.data)
        if serializer.is_valid():
            pdf_file = serializer.validated_data["file"]
            
            pdf = fitz.open(stream=pdf_file.read(), filetype="pdf")
            images_list = []
            
            for page_num in range(len(pdf)):
                page = pdf[page_num]
                pix = page.get_pixmap()
                
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                buffer = io.BytesIO()
                img.save(buffer, format="PNG")
                img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
                images_list.append(img_str)
                
            return Response({"images": images_list}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
            
            