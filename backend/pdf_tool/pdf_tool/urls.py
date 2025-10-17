from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('images-to-pdf/', include('images_to_pdf.urls')),
    path('docx-to-pdf/', include('docx_to_pdf.urls')),
    path('pdf-to-docx/', include('pdf_to_docx.urls')),
    path('merge-pdf/', include('pdfMerge.urls')),
    path('compress-file/', include('compressor.urls')),
    path('download/', include('compressor.urls')),
    path('pdf-to-images/', include('pdf_to_images.urls')),
    path('image-format-converter/', include('image_format_converter.urls')),
    path('watermark/', include('image_watermark.urls')),
    path('contact/', include('contact.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)