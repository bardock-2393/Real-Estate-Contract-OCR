# Real Estate Contract OCR Extractor

This project extracts key information from real estate purchase contracts using Tesseract OCR.

## Features

- Processes PDF files and extracts text using OCR
- Identifies key information from real estate contracts:
  - Buyer Name
  - Seller Name
  - Property Address
  - Key Dates
  - Purchase Price
- Outputs structured data in JSON format
- Includes custom Tesseract training capabilities

## Installation

1. Install dependencies:
```
npm install
```

2. Make sure you have the necessary system dependencies:
   - For Tesseract.js to work properly, you don't need to install Tesseract on your system as it's bundled with the npm package.
   - For training custom Tesseract models, you'll need Tesseract OCR installed on your system.

## Usage

1. Place your PDF files in the `input` directory.

2. Run the script:
```
npm start
```

3. The extracted data will be saved to `output/extracted_data.json`.

## Custom Tesseract Training

To improve recognition accuracy for real estate documents, you can train a custom Tesseract model:

1. Place training sample images in `training-data/samples/`
2. Generate box files: `node training/generate-box-files.js`
3. Edit box files as needed in `training-data/box-files/`
4. Train the model: `node training/train-model.js`
5. Use the trained model: Edit `index.js` to use your custom trained model

## Project Structure

```
.
├── index.js                # Main script
├── test.js                 # Test script
├── package.json            # Project dependencies
├── input/                  # Place PDF files here
├── output/                 # Results are saved here
├── temp/                   # Temporary directory for processing
├── training/               # Training scripts
├── training-data/          # Training data directory
│   ├── samples/            # Training sample images
│   ├── box-files/          # Box files for training
│   └── outputs/            # Training outputs
└── tessdata/               # Custom trained Tesseract data
```

## License

MIT
