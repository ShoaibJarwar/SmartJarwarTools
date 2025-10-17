from django.urls import path
from .views import ImagesToPdfView

urlpatterns = [
    path('', ImagesToPdfView.as_view(), name="images-to-pdf"),
]