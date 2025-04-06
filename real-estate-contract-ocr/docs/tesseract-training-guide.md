# Comprehensive Guide to Training Tesseract OCR for Real Estate Documents

This guide explains how to create a custom Tesseract OCR model specifically optimized for real estate contracts.

## Prerequisites

Before starting the training process, you'll need to install Tesseract OCR and its training tools:

### On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
sudo apt-get install tesseract-ocr-eng
sudo apt-get install libtesseract-dev
sudo apt-get install tesseract-ocr-training-tools
```

### On macOS:
```bash
brew install tesseract
brew install tesseract-lang
```

### On Windows:
1. Download and install Tesseract from https://github.com/UB-Mannheim/tesseract/wiki
2. Make sure to add Tesseract to your PATH

## Step 1: Collect Training Data

Good training data is crucial for effective OCR. For real estate documents:

1. Collect at least 5-10 sample pages from different real estate contracts
2. Include pages that contain typical layouts found in real estate documents
3. Focus on sections with buyer/seller info, property descriptions, and price details
4. Save the images as PNG files in the `training-data/samples/` directory

## Step 2: Preprocess Images

Image quality significantly affects OCR accuracy. Our preprocessing script:

1. Converts images to grayscale
2. Enhances contrast
3. Removes noise
4. Normalizes sizing

Run the preprocessing script:
```
node training/preprocess-samples.js
```

## Step 3: Generate Box Files

Box files tell Tesseract where the characters are in your training images:

```
node training/generate-box-files.js
```

This creates `.box` files in the `training-data/box-files/` directory.

## Step 4: Edit Box Files (Critical Step)

Box files require manual verification and correction:

1. Open each box file in a text editor
2. Each line follows this format: `character left bottom right top page`
3. Verify that each character is correctly identified
4. Fix any misidentifications or incorrect boundaries

For example, if `#!/bin/bash
# Real Estate Contract OCR Project Setup Script
# This script sets up the complete project structure, installs dependencies,
# and includes Tesseract training capabilities

set -e # Exit on error

# Display banner
echo "=================================================="
echo "  REAL ESTATE CONTRACT OCR PROJECT SETUP"
echo "=================================================="
echo ""

# Configuration
PROJECT_DIR="real-estate-contract-ocr"
TRAINING_DIR="training-data"
TRAINING_OUTPUT_DIR="tessdata"

# Create project directory structure
create_project_structure() {
  echo "🔧 Creating project directory structure..."
  
  mkdir -p "$PROJECT_DIR"
  cd "$PROJECT_DIR"
  
  # Create necessary directories
  mkdir -p input
  mkdir -p output
  mkdir -p temp
  mkdir -p $TRAINING_DIR/samples
  mkdir -p $TRAINING_DIR/box-files
  mkdir -p $TRAINING_DIR/outputs
  mkdir -p $TRAINING_OUTPUT_DIR
  
  echo "✅ Project directory structure created"
}

# Create package.json file
create_package_json() {
  echo "📄 Creating package.json..."
  
  cat > package.json << 'EOL'
{
  "name": "real-estate-contract-ocr",
  "version": "1.0.0",
  "description": "Extract key information from real estate purchase contracts using OCR",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "node test.js",
    "train": "node training/generate-training-data.js"
  },
  "keywords": [
    "ocr",
    "tesseract",
    "pdf",
    "real-estate"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "tesseract.js": "^4.1.1",
    "pdf-parse": "^1.1.1",
    "pdf-lib": "^1.17.1",
    "pdf-to-png-converter": "^2.7.1",
    "jimp": "^0.22.10",
    "commander": "^11.1.0",
    "csv-parser": "^3.0.0",
    "csv-writer": "^1.6.0"
  }
}
