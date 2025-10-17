from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import A4
from .serializers import ImageUploadSerializer
from PIL import Image
import io

 
class ImagesToPdfView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data = request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        images = request.FILES.getlist("images")
        
        if not images:
            return Response({'error': 'No images Uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        pdf_buffer = io.BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=A4)
        page_width, page_height = A4
        
        try:
            image_objs = []
            for img_file in images:
                img = Image.open(img_file)
                
                if img.mode != "RGB":
                    img = img.convert('RGB')
                image_objs.append(img)
                
                img_width, img_height = img.size
                
                # scale proportionally to fit A4
                ratio = min(page_width/img_width, page_height/img_height)
                new_width = img_width * ratio
                new_height = img_height * ratio
                
                # Center the images
                x = (page_width - new_width) / 2
                y = (page_height - new_height) / 2
                
                c.drawImage(ImageReader(img), x, y, width=new_width, height=new_height)
                c.showPage()
                
            c.save()
            pdf_buffer.seek(0)
            
            return FileResponse(pdf_buffer, as_attachment=True, filename="pdfFile.pdf")
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)