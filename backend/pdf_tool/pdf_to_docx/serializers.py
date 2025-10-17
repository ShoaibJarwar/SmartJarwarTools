from rest_framework import serializers

class PdfToDocxSerializer(serializers.Serializer):
    pdf_file = serializers.FileField()
    
    