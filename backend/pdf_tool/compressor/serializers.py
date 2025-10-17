from rest_framework import serializers

class FileCompressorSerializer(serializers.Serializer):
    files = serializers.ListField(
        child = serializers.FileField(),
        allow_empty = False,
        help_text = "Uplaod one or more files for compression"
    )
    
    image_quality = serializers.IntegerField(default=60, min_value=10, max_value=95)
    video_bitrate = serializers.CharField(default="800k")
    audio_bitrate = serializers.CharField(default="128k")
    