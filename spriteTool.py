#!/usr/bin/env python3
import os
from PIL import Image

def list_directory_contents():
    """
    Returns a tuple of (subdirectories, png_files) for the current directory.
    """
    subdirs = []
    png_files = []
    for entry in os.listdir('.'):
        if os.path.isdir(entry):
            subdirs.append(entry)
        elif entry.lower().endswith('.png'):
            png_files.append(entry)
    return subdirs, png_files

def split_png(file_name):
    """
    Splits the specified PNG into 32x32 pieces if possible.
    Pieces are saved in the same directory as file_name, named 0.png, 1.png, etc.
    """
    try:
        with Image.open(file_name) as img:
            width, height = img.size
            if width % 32 != 0 or height % 32 != 0:
                print(f"Image '{file_name}' dimensions {width}x{height} are not divisible by 32. Cannot split.")
                return
            cols = width // 32
            rows = height // 32
            count = 0
            for row in range(rows):
                for col in range(cols):
                    left = col * 32
                    upper = row * 32
                    right = left + 32
                    lower = upper + 32
                    piece = img.crop((left, upper, right, lower))
                    output_path = os.path.join(os.getcwd(), f"{count}.png")
                    piece.save(output_path)
                    count += 1
            print(f"Successfully split '{file_name}' into {count} pieces.")
    except Exception as e:
        print(f"Error splitting '{file_name}': {e}")

def print_options(options):
    """
    Displays a single unified list of options.
    """
    print("\n--------------------------------")
    print("Current Directory:", os.getcwd())
    print("--------------------------------")
    for idx, option in enumerate(options, start=1):
        print(f"{idx}. {option['description']}")
    print()

def main():
    # Navigate to frontEnd/src/sprites relative to the execution directory.
    target_dir = os.path.join(os.getcwd(), "frontEnd", "src", "sprites")
    if os.path.isdir(target_dir):
        os.chdir(target_dir)
        print("Changed directory to:", os.getcwd())
    else:
        print(f"Target directory '{target_dir}' does not exist. Exiting.")
        return

    while True:
        subdirs, png_files = list_directory_contents()
        options = []
        # Add an option for each subdirectory
        for subdir in subdirs:
            options.append({
                "type": "cd",
                "target": subdir,
                "description": f"Change directory to subdirectory /{subdir}"
            })
        # Add an option for each PNG file to split
        for png in png_files:
            options.append({
                "type": "split",
                "target": png,
                "description": f"Split {png}"
            })
        # Add option to go up one directory
        options.append({
            "type": "up",
            "target": "..",
            "description": "Go up one directory (cd ../)"
        })
        # Add option to refresh listing
        options.append({
            "type": "refresh",
            "target": None,
            "description": "Refresh listing"
        })
        # Add option to quit
        options.append({
            "type": "quit",
            "target": None,
            "description": "Quit"
        })

        print_options(options)
        choice = input("Select an option by number: ").strip()
        try:
            idx = int(choice) - 1
            if idx < 0 or idx >= len(options):
                print("Invalid option. Please select a valid number.")
                continue
            selected = options[idx]
            if selected["type"] == "cd":
                os.chdir(selected["target"])
                print("Changed directory to:", os.getcwd())
            elif selected["type"] == "split":
                split_png(selected["target"])
            elif selected["type"] == "up":
                os.chdir("..")
                print("Changed directory to:", os.getcwd())
            elif selected["type"] == "refresh":
                continue
            elif selected["type"] == "quit":
                print("Exiting utility.")
                break
        except ValueError:
            print("Please enter a valid number.")

if __name__ == "__main__":
    main()
