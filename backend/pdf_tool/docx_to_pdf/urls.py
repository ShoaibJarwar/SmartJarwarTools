from django.urls import path
from .views import DocxToPdfView

urlpatterns = [
    path('', DocxToPdfView.as_view(), name="docx-to-pdf"),
]