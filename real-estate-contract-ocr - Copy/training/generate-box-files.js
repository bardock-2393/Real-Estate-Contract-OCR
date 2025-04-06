// Script to generate box files for Tesseract training
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const PROCESSED_DIR = path.join(__dirname, '../training-data/processed');
const BOX_DIR = path.join(__dirname, '../training-data/box-files');

// Create box directory if it doesn't exist
if (!fs.existsSync(BOX_DIR)) {
  fs.mkdirSync(BOX_DIR, { recursive: true });
}

async function generateBoxFiles() {
  const files = fs.readdirSync(PROCESSED_DIR)
    .filter(file => file.endsWith('.tif'));
  
  console.log(`Found ${files.length} TIFF images for box file generation`);
  
  for (const file of files) {
    const baseName = path.parse(file).name;
    const inputPath = path.join(PROCESSED_DIR, file);
    const outputPath = path.join(BOX_DIR, `${baseName}.box`);
    
    console.log(`Generating box file for ${file}...`);
    
    try {
      // Use Tesseract to generate box file
      const command = `tesseract "${inputPath}" "${path.join(BOX_DIR, baseName)}" -l eng --psm 6 batch.nochop makebox`;
      await execAsync(command);
      
      console.log(`Box file generated: ${outputPath}`);
    } catch (error) {
      console.error(`Error generating box file for ${file}:`, error);
    }
  }
}

generateBoxFiles().catch(console.error);
