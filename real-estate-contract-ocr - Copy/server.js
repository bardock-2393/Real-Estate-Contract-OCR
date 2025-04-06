// server.js - Express server for Real Estate Contract OCR application

const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { processPdfs } = require('./index');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
  useTempFiles: true,
  tempFileDir: './temp/'
}));
app.use(express.static('public'));
app.use('/output', express.static('output')); // Serve output files

// Enable CORS for debugging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Make sure necessary directories exist
const DIRS = ['input', 'output', 'temp', 'public'];
DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get previously processed results
app.get('/api/results', (req, res) => {
  try {
    const outputFile = path.join(__dirname, 'output', 'extracted_data.json');
    if (fs.existsSync(outputFile)) {
      const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      res.json(data);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading results:', error);
    res.status(500).json({ error: 'Failed to load results' });
  }
});

// Upload and process PDF files
app.post('/api/upload', async (req, res) => {
  console.log('Upload endpoint called');
  try {
    if (!req.files || !req.files.documents) {
      console.log('No files were uploaded');
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    console.log('Files received:', req.files);

    // Handle multiple files or single file
    const uploadedFiles = Array.isArray(req.files.documents) 
      ? req.files.documents 
      : [req.files.documents];

    console.log(`Processing ${uploadedFiles.length} files`);

    // Clear input directory to prevent processing old files
    const inputDir = path.join(__dirname, 'input');
    fs.readdirSync(inputDir).forEach(file => {
      try {
        fs.unlinkSync(path.join(inputDir, file));
      } catch (err) {
        console.error(`Error deleting file ${file}:`, err);
      }
    });

    // Save each uploaded file to input directory
    const fileInfos = [];
    for (const file of uploadedFiles) {
      const filePath = path.join(inputDir, file.name);
      console.log(`Moving ${file.name} to ${filePath}`);
      
      // Use mv method to move the file
      await new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
          if (err) {
            console.error(`Error moving file ${file.name}:`, err);
            reject(err);
          } else {
            console.log(`File ${file.name} moved successfully`);
            resolve();
          }
        });
      });
      
      fileInfos.push({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
      });
    }

    console.log('Files moved to input directory, starting OCR processing');

    // Process the PDFs
    const results = await processPdfs();
    
    console.log('OCR processing complete:', results);
    
    res.json({
      message: `${uploadedFiles.length} files processed successfully`,
      files: fileInfos,
      results
    });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'File processing failed', details: error.message });
  }
});

// Check server status
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Open your browser to view the OCR application`);
});