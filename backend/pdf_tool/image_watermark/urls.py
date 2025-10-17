from django.urls import path
from .views import ImageWatermarkView

urlpatterns = [
    path('', ImageWatermarkView.as_view(), name="watermark"),
]
