from PIL import Image
import os

def process_logo(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        
        # Get the bounding box of the non-zero regions
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            print("trimmed whitespace")
        
        # Check orientation
        width, height = img.size
        print(f"Dimensions after trim: {width}x{height}")
        
        if height > width:
            print("rotating -90 degrees to landscape")
            img = img.rotate(-90, expand=True)
            
        img.save(output_path)
        print(f"Saved processed logo to {output_path}")
        
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    input_file = r"s:\Pu_Project\frontend\src\assets\images\logo_raw.png"
    output_file = r"s:\Pu_Project\frontend\src\assets\images\logo.png"
    process_logo(input_file, output_file)
