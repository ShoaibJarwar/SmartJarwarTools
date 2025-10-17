from django.urls import path
from .views import PdfToDocAPIView

urlpatterns = [
    path('', PdfToDocAPIView.as_view(), name="pdf-to-docx")
]