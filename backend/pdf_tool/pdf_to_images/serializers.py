from rest_framework import serializers

class PdfToImagesSerializer(serializers.Serializer):
    file = serializers.FileField()