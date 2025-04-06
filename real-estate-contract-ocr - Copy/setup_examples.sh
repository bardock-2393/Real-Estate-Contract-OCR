#!/bin/bash
# Script to set up example PDFs for testing

echo "Setting up example PDFs for testing..."

# Create input directory if it doesn't exist
mkdir -p input

# Check if PDFs were provided as arguments
if [ $# -eq 0 ]; then
  echo "No PDFs provided. Please run this script with PDF paths:"
  echo "  ./setup_examples.sh path/to/pdf1.pdf path/to/pdf2.pdf"
  exit 1
fi

# Copy PDFs to input directory
for pdf in "$@"; do
  if [ -f "$pdf" ]; then
    cp "$pdf" input/
    echo "✅ Copied $pdf to input directory"
  else
    echo "❌ File not found: $pdf"
  fi
done

echo "Done! You can now run 'npm start' to process the example PDFs."
