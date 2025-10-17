from django.urls import path
from .views import SmartCompressorView, download_file

urlpatterns = [
    path('', SmartCompressorView.as_view(), name='compress-file'),
    path('<str:filename>/', download_file, name='download-file'),
]
