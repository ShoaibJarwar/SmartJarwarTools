from rest_framework import serializers

class ImageUploadSerializer(serializers.Serializer):
    images = serializers.ListField(
        child = serializers.ImageField(),
        allow_empty = False,
        write_only = True
    )
    