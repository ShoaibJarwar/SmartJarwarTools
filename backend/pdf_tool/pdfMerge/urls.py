from django.urls import path
from .views import PdfMergeAPIView

urlpatterns = [
    path("", PdfMergeAPIView.as_view(), name="merge-pdf"),
]
