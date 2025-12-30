#!/bin/bash

# Regenerate extension icons with better sizing (less padding)
# This script uses ImageMagick to convert the SVG to PNG with optimal sizing

cd "$(dirname "$0")"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

# Generate icons with better size (add padding percentage)
# Using -background transparent and -extent to ensure proper sizing
for size in 16 32 48 128; do
    echo "Generating ${size}x${size} icon..."
    convert -background transparent -density 300 icon.svg \
        -resize ${size}x${size} \
        -gravity center \
        -extent ${size}x${size} \
        icon${size}.png
    
    # Create inactive versions (grayscale)
    convert icon${size}.png -colorspace Gray icon${size}-inactive.png
done

echo "✓ All icons regenerated successfully!"
