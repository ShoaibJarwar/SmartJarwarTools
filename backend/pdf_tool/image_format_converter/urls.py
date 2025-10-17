from django.urls import path
from .views import ImageFormatConverterView

urlpatterns = [
    path('', ImageFormatConverterView.as_view(), name="image-format-converter"),
]
