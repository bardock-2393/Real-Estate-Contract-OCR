// Script to preprocess sample images for Tesseract training
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const SAMPLES_DIR = path.join(__dirname, '../training-data/samples');
const OUTPUT_DIR = path.join(__dirname, '../training-data/processed');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process all images in the samples directory
async function processImages() {
  const files = fs.readdirSync(SAMPLES_DIR)
    .filter(file => /\.(png|jpg|jpeg|tif|tiff)$/i.test(file));
  
  console.log(`Found ${files.length} images to process`);
  
  for (const file of files) {
    console.log(`Processing ${file}...`);
    const inputPath = path.join(SAMPLES_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, `${path.parse(file).name}.tif`);
    
    try {
      // Read the image
      const image = await Jimp.read(inputPath);
      
      // Preprocess for optimal OCR training
      image
        .grayscale() // Convert to grayscale
        .contrast(0.1) // Slightly increase contrast
        .normalize() // Normalize colors
        .resize(3000, Jimp.AUTO) // Resize to consistent width
        .quality(100); // Set max quality
      
      // Save as TIFF
      await image.writeAsync(outputPath);
      console.log(`Saved processed image to ${outputPath}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

// Run the processing
processImages().catch(console.error);
