from PIL import Image
import os
import sys

def fix_logo(input_path):
    try:
        print(f"Opening {input_path}...")
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        print("Rotating 180 degrees...")
        img = img.rotate(180, expand=True)
        
        img.save(input_path)
        print(f"Saved corrected logo to {input_path}")
        
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    target_file = r"s:\Pu_Project\frontend\src\assets\images\qprint_logo.png"
    fix_logo(target_file)
