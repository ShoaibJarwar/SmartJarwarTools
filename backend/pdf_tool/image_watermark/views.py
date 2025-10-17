from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from django.http import HttpResponse


class ImageWatermarkView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        image_file = request.FILES.get("image")
        text = request.data.get("watermark_text", "SmartJarwarTools")
        position = request.data.get("position", "bottom-right")
        font_size = int(request.data.get("font_size", 36))
        color = request.data.get("color", "#FFFFFF")
        opacity = float(request.data.get("opacity", 0.3))

        if not image_file:
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # --- Open image ---
        image = Image.open(image_file).convert("RGBA")
        width, height = image.size
        txt_layer = Image.new("RGBA", image.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(txt_layer)

        # --- Load font ---
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()

        # --- Text size ---
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # --- Convert HEX → RGBA ---
        rgba_color = tuple(int(color[i:i+2], 16) for i in (1, 3, 5)) + (int(255 * opacity),)

        # --- Position map ---
        positions = {
            "top-left": (10, 10),
            "top-right": (width - text_width - 10, 10),
            "center": ((width - text_width) / 2, (height - text_height) / 2),
            "bottom-left": (10, height - text_height - 10),
            "bottom-right": (width - text_width - 10, height - text_height - 10),
        }

        # --- Diagonal Watermark (Tiled) ---
        if position == "diagonal":
            # Create one watermark text image
            text_img = Image.new("RGBA", (text_width + 10, text_height + 10), (255, 255, 255, 0))
            text_draw = ImageDraw.Draw(text_img)

            # Draw shadow
            shadow_offset = 2
            text_draw.text((shadow_offset, shadow_offset), text, font=font,
                           fill=(0, 0, 0, int(255 * opacity * 0.6)))
            # Draw main text
            text_draw.text((0, 0), text, font=font, fill=rgba_color)

            # Rotate the text image
            rotated = text_img.rotate(45, expand=True)

            # Tile diagonally across image
            step_x = rotated.width + 100
            step_y = rotated.height + 80
            for y in range(-height // 2, height * 2, step_y):
                for x in range(-width // 2, width * 2, step_x):
                    txt_layer.alpha_composite(rotated, (x, y))

        else:
            # --- Standard Positions ---
            x, y = positions.get(position, positions["bottom-right"])
            shadow_offset = 2
            draw.text((x + shadow_offset, y + shadow_offset), text, font=font,
                      fill=(0, 0, 0, int(255 * opacity * 0.8)))
            draw.text((x, y), text, font=font, fill=rgba_color)

        # --- Merge layers ---
        combined = Image.alpha_composite(image, txt_layer)

        # --- Return final image ---
        buffer = BytesIO()
        combined.convert("RGB").save(buffer, format="JPEG", quality=95)
        buffer.seek(0)
        return HttpResponse(buffer, content_type="image/jpeg")
