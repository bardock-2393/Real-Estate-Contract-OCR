// Script to train a custom Tesseract model for real estate documents
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const PROCESSED_DIR = path.join(__dirname, '../training-data/processed');
const BOX_DIR = path.join(__dirname, '../training-data/box-files');
const OUTPUT_DIR = path.join(__dirname, '../training-data/outputs');
const TESSDATA_DIR = path.join(__dirname, '../tessdata');

// Ensure output directories exist
[OUTPUT_DIR, TESSDATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function runCommand(command, description) {
  console.log(`\n${description}...\n$ ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function trainTesseract() {
  console.log("Starting Tesseract training process...");
  
  // Get list of all processed TIFF files
  const tiffFiles = fs.readdirSync(PROCESSED_DIR)
    .filter(file => file.endsWith('.tif'))
    .map(file => path.parse(file).name);
  
  if (tiffFiles.length === 0) {
    console.error("No TIFF files found for training!");
    return;
  }
  
  console.log(`Found ${tiffFiles.length} files for training`);
  
  // Step 1: Generate TR files (Tesseract's training data files)
  for (const baseName of tiffFiles) {
    const tiffPath = path.join(PROCESSED_DIR, `${baseName}.tif`);
    const boxPath = path.join(BOX_DIR, `${baseName}.box`);
    
    if (!fs.existsSync(boxPath)) {
      console.warn(`Box file not found for ${baseName}, skipping...`);
      continue;
    }
    
    console.log(`\nProcessing ${baseName}...`);
    
    // Generate training files
    await runCommand(
      `tesseract "${tiffPath}" "${path.join(OUTPUT_DIR, baseName)}" -l eng --psm 6 box.train`,
      `Generating training data for ${baseName}`
    );
  }
  
  // Step 2: Extract unicharset
  const boxFiles = tiffFiles
    .filter(name => fs.existsSync(path.join(BOX_DIR, `${name}.box`)))
    .map(name => path.join(BOX_DIR, `${name}.box`))
    .join(' ');
  
  if (!boxFiles) {
    console.error("No valid box files found!");
    return;
  }
  
  await runCommand(
    `unicharset_extractor ${boxFiles}`,
    "Extracting unicharset"
  );
  
  // Move unicharset to output directory
  if (fs.existsSync('unicharset')) {
    fs.renameSync('unicharset', path.join(OUTPUT_DIR, 'unicharset'));
  }
  
  // Step 3: Generate font properties file
 is misrecognized as `S`, find the line for that character and change it.

You can use a box file editor like [jTessBoxEditor](http://vietocr.sourceforge.net/training.html) for visual editing.

## Step 5: Training Process

The training uses several Tesseract commands in sequence:

1. Generate `.tr` files (training data):
   ```
   tesseract [image].tif [output] box.train
   ```

2. Extract character set:
   ```
   unicharset_extractor *.box
   ```

3. Create font properties file:
   ```
   echo "real_estate 0 0 0 0 0" > font_properties
   ```

4. Clustering:
   ```
   mftraining -F font_properties -U unicharset -O output.unicharset *.tr
   cntraining *.tr
   ```

5. Combine into traineddata:
   ```
   combine_tessdata real_estate.
   ```

Our script automates this process:
```
node training/train-model.js
```

## Step 6: Testing and Iteration

After training:

1. Test the model on new documents not used in training
2. Analyze accuracy on key fields (buyer, seller, address, price)
3. Identify problem areas and add more training data for those cases
4. Repeat the training process

## Fine-tuning for Real Estate Terms

To improve recognition of real estate terminology:

1. Create a text file with common real estate terms:
   - Property descriptions
   - Legal terms
   - Address formats
   - Price notation styles

2. Add this as a word list during training:
   ```
   wordlist2dawg real_estate_words.txt real_estate.word-dawg real_estate.unicharset
   ```

## Using the Trained Model

The main application will automatically use your custom model if it exists in the `tessdata/` directory.

## Troubleshooting

Common issues and solutions:

1. **Poor recognition results**: Add more diverse training samples
2. **Training errors**: Check that box files are correctly formatted
3. **Missing characters**: Make sure all necessary characters appear in your training data
4. **Performance issues**: Adjust preprocessing to improve image quality

For more help with Tesseract training, consult the [official Tesseract documentation](https://tesseract-ocr.github.io/tessdoc/Training-Tesseract.html).
