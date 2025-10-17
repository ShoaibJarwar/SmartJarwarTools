from rest_framework import serializers


class ImageWatermarkSerializer(serializers.Serializer):
    image = serializers.ImageField()
    watermark_text = serializers.CharField(required=False, allow_blank=True)
    position = serializers.ChoiceField(
        choices=['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', 'diagonal'],
        default = "bottom-right"
    )
    