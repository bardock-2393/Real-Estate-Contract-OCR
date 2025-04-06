// app.js - JavaScript for OCR Frontend

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadForm = document.getElementById('upload-form');
    const uploadBtn = document.getElementById('upload-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = progressContainer.querySelector('.progress-bar');
    const statusMessage = document.getElementById('status-message');
    const uploadedFilesCard = document.getElementById('uploaded-files-card');
    const uploadedFilesList = document.getElementById('uploaded-files-list');
    const resultsAccordion = document.getElementById('results-accordion');
    const noResultsMessage = document.getElementById('no-results-message');
    const jsonOutputCard = document.getElementById('json-output-card');
    const jsonOutput = document.getElementById('json-output');
    const downloadJsonBtn = document.getElementById('download-json');
  
    // Load any existing results on page load
    loadExistingResults();
  
    // Event Listeners
    uploadForm.addEventListener('submit', handleFormSubmit);
    downloadJsonBtn.addEventListener('click', downloadJson);
  
    // Functions
    async function loadExistingResults() {
      try {
        const response = await fetch('/api/results');
        if (response.ok) {
          const results = await response.json();
          if (results && results.length > 0) {
            displayResults(results);
          }
        }
      } catch (error) {
        console.error('Error loading existing results:', error);
      }
    }
  
    async function handleFormSubmit(e) {
      e.preventDefault();
      
      // Debug to verify this function is called
      console.log('Form submit handler called');
      
      const formData = new FormData(uploadForm);
      const files = formData.getAll('documents');
      
      console.log('Files selected:', files.length);
      
      if (files.length === 0) {
        showStatus('Please select at least one PDF file', 'danger');
        return;
      }
      
      // Calculate total file size
      const totalSize = files.reduce((total, file) => total + file.size, 0);
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (totalSize > maxSize) {
        showStatus('Total file size exceeds the 50MB limit', 'danger');
        return;
      }
      
      // Start processing
      setLoading(true);
      showStatus('Uploading and processing files...', 'info');
      
      try {
        console.log('Sending fetch request to /api/upload');
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }
        
        const result = await response.json();
        console.log('Response data:', result);
        
        // Display uploaded files
        displayUploadedFiles(result.files);
        
        // Display extracted information
        displayResults(result.results);
        
        showStatus('Files processed successfully!', 'success');
      } catch (error) {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'danger');
      } finally {
        setLoading(false);
      }
    }
  
    function setLoading(isLoading) {
      uploadBtn.disabled = isLoading;
      uploadBtn.innerHTML = isLoading 
        ? '<span class="spinner-border spinner-border-sm me-2"></span>Processing...' 
        : '<i class="bi bi-arrow-right-circle me-2"></i>Process Documents';
      
      progressContainer.classList.toggle('d-none', !isLoading);
      if (isLoading) {
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress > 90) {
            clearInterval(interval);
            progress = 90;
          }
          progressBar.style.width = `${Math.min(progress, 100)}%`;
        }, 500);
        
        // Store interval ID to clear it later
        uploadBtn.dataset.intervalId = interval;
      } else {
        // Clear interval and set progress to 100%
        if (uploadBtn.dataset.intervalId) {
          clearInterval(parseInt(uploadBtn.dataset.intervalId));
        }
        progressBar.style.width = '100%';
        setTimeout(() => {
          progressContainer.classList.add('d-none');
          progressBar.style.width = '0%';
        }, 1000);
      }
    }
  
    function showStatus(message, type = 'info') {
      statusMessage.textContent = message;
      statusMessage.className = `alert mt-3 alert-${type}`;
      statusMessage.classList.remove('d-none');
      
      // Auto-hide success messages after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          statusMessage.classList.add('d-none');
        }, 5000);
      }
    }
  
    function displayUploadedFiles(files) {
      uploadedFilesList.innerHTML = '';
      
      files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          <div>
            <i class="bi bi-file-earmark-pdf text-danger me-2"></i>
            <span>${file.name}</span>
          </div>
          <span class="badge bg-secondary">${file.size}</span>
        `;
        uploadedFilesList.appendChild(li);
      });
      
      uploadedFilesCard.classList.remove('d-none');
    }
  
    function displayResults(results) {
      if (!results || results.length === 0) {
        return;
      }
      
      // Hide no results message
      noResultsMessage.classList.add('d-none');
      
      // Show results accordion
      resultsAccordion.classList.remove('d-none');
      
      // Clear existing results
      resultsAccordion.innerHTML = '';
      
      // Create accordion items for each result
      results.forEach((result, index) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        
        // Skip items with errors
        if (result.error) {
          accordionItem.innerHTML = `
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                data-bs-target="#collapse-${index}">
                <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                ${result.fileName} - Error Processing
              </button>
            </h2>
            <div id="collapse-${index}" class="accordion-collapse collapse" data-bs-parent="#results-accordion">
              <div class="accordion-body">
                <div class="alert alert-warning">
                  Error: ${result.error}
                </div>
              </div>
            </div>
          `;
          resultsAccordion.appendChild(accordionItem);
          return;
        }
        
        // Create the accordion header
        const header = document.createElement('h2');
        header.className = 'accordion-header';
        header.innerHTML = `
          <button class="accordion-button ${index > 0 ? 'collapsed' : ''}" type="button" 
            data-bs-toggle="collapse" data-bs-target="#collapse-${index}">
            <i class="bi bi-file-earmark-text me-2"></i>
            ${result.fileName}
          </button>
        `;
        
        // Create the accordion body
        const body = document.createElement('div');
        body.id = `collapse-${index}`;
        body.className = `accordion-collapse collapse ${index === 0 ? 'show' : ''}`;
        body.setAttribute('data-bs-parent', '#results-accordion');
        
        // Create the content
        let bodyContent = `<div class="accordion-body">`;
        
        // Buyer information
        bodyContent += `
          <div class="info-box">
            <div class="info-label">Buyer Name:</div>
            <p class="info-value">${result.buyerName || 'Not detected'}</p>
          </div>
        `;
        
        // Seller information
        bodyContent += `
          <div class="info-box">
            <div class="info-label">Seller Name:</div>
            <p class="info-value">${result.sellerName || 'Not detected'}</p>
          </div>
        `;
        
        // Property address
        bodyContent += `
          <div class="info-box">
            <div class="info-label">Property Address:</div>
            <p class="info-value">${result.propertyAddress || 'Not detected'}</p>
          </div>
        `;
        
        // Price
        bodyContent += `
          <div class="info-box">
            <div class="info-label">Price:</div>
            <p class="info-value">${result.price || 'Not detected'}</p>
          </div>
        `;
        
        // Key dates
        bodyContent += `
          <div class="info-box">
            <div class="info-label">Key Dates:</div>
            <div class="info-value">
        `;
        
        if (result.keyDates && result.keyDates.length > 0) {
          result.keyDates.forEach(date => {
            bodyContent += `<span class="date-tag">${date}</span>`;
          });
        } else {
          bodyContent += 'No dates detected';
        }
        
        bodyContent += `
            </div>
          </div>
        `;
        
        // Link to raw text if available
        const rawTextFile = `/output/${result.fileName.replace('.pdf', '_raw_text.txt')}`;
        bodyContent += `
          <div class="mt-3">
            <a href="${rawTextFile}" target="_blank" class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-file-text me-1"></i> View Raw Text
            </a>
          </div>
        `;
        
        bodyContent += `</div>`;
        body.innerHTML = bodyContent;
        
        // Add header and body to the accordion item
        accordionItem.appendChild(header);
        accordionItem.appendChild(body);
        
        // Add the accordion item to the accordion
        resultsAccordion.appendChild(accordionItem);
      });
      
      // Show JSON output
      jsonOutput.textContent = JSON.stringify(results, null, 2);
      jsonOutputCard.classList.remove('d-none');
    }
  
    function downloadJson() {
      const jsonData = jsonOutput.textContent;
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted_data.json';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    }
  });