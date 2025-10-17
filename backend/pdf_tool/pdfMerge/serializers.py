from rest_framework import serializers

class PdfMergerSerializer(serializers.Serializer):
    files = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False),
        allow_empty=False,
        write_only=True,
    )
    def validate_files(self, files):
        for f in files:
            if not f.name.lower().endswith(".pdf"):
                raise serializers.ValidationError(f"{f.name} is not a pdf")
        return files