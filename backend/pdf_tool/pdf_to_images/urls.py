from django.urls import path
from .views import PdfToImagesView


urlpatterns = [
    path('', PdfToImagesView.as_view(), name="pdf-to-images"),
]