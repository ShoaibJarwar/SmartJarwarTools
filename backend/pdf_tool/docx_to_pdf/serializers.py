from rest_framework.serializers import serializers

class FileUploadSerializer(serializers.Serializer):
    file = serializers.fileFild()
