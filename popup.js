document.addEventListener('DOMContentLoaded', function() {
  // Get the toggle element
  const toggleElement = document.getElementById('enableToggle');
  
  // Check if extension is enabled from storage
  chrome.storage.sync.get('enabled', function(data) {
    // Default to enabled if not set
    const isEnabled = data.enabled !== undefined ? data.enabled : true;
    toggleElement.checked = isEnabled;
  });
  
  // Add listener for toggle changes
  toggleElement.addEventListener('change', function() {
    const isEnabled = this.checked;
    
    // Save to storage
    chrome.storage.sync.set({enabled: isEnabled}, function() {
      // Send message to content script
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url.includes('linkedin.com')) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'toggle', enabled: isEnabled});
        }
      });
    });
  });
}); 