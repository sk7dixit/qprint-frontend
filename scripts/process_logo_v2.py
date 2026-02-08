from PIL import Image
import os
import sys

def process_logo(input_path, output_path):
    try:
        print(f"Opening {input_path}...")
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        # 1. Trim whitespace
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            print(f"Trimmed whitespace. New size: {img.size}")
        else:
            print("No bounding box found (empty image?).")

        # 2. Rotate 90 degrees Clockwise
        # PIL rotate(x) is Counter-Clockwise. So rotate(-90) is Clockwise.
        # expand=True resizing the canvas to fit the rotated image.
        print("Rotating 90 degrees Clockwise...")
        img = img.rotate(-90, expand=True)
        print(f"Rotated size: {img.size}")
        
        # 3. Trim again just in case rotation introduced padding (though expand=True shouldn't add excess transparent if source was tight, but good practice)
        bbox2 = img.getbbox()
        if bbox2:
            img = img.crop(bbox2)
            print(f"Final trimmed size: {img.size}")

        img.save(output_path)
        print(f"Saved processed logo to {output_path}")
        
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    # Source from Downloads to ensure we start fresh
    source_file = r"C:\Users\Shashwat\Downloads\qprint_transparent.png"
    # Target in project
    target_file = r"s:\Pu_Project\frontend\src\assets\images\qprint_logo.png"
    
    process_logo(source_file, target_file)
