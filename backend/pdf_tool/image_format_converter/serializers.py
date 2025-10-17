from rest_framework import serializers

class ImageFormatConverterSerializer(serializers.Serializer):
    image = serializers.ImageField()
    format = serializers.ChoiceField(choices=[
        ("JPEG", "JPEG"),
        ("PNG", "PNG"),
        ("WEBP", "WEBP"),
        ("BMP", "BMP"),
        ("GIF", "GIF"),
        ("TIFF", "TIFF"),
        ("AVIF", "AVIF"),
        ("HEIF", "HEIF"),
    ])
    