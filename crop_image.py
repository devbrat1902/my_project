from PIL import Image

# Open the image
img = Image.open('A Day in the Life_ Children at School.jpg')
width, height = img.size
print(f'Original size: {width}x{height}')

# Crop to 16:9 ratio (common web ratio)
target_ratio = 16/9
current_ratio = width / height

if current_ratio > target_ratio:
    # Image is too wide, crop width
    new_width = int(height * target_ratio)
    left = (width - new_width) // 2
    img_cropped = img.crop((left, 0, left + new_width, height))
else:
    # Image is too tall, crop height
    new_height = int(width / target_ratio)
    top = (height - new_height) // 2
    img_cropped = img.crop((0, top, width, top + new_height))

# Save the cropped image
img_cropped.save('A Day in the Life_ Children at School.jpg', quality=95)
print(f'Cropped to: {img_cropped.width}x{img_cropped.height}')
print('Image optimized and saved successfully!')
