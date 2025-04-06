// Track the enabled state (default to true)
let extensionEnabled = true;

// Function to toggle stylesheets - removed as we're now using the data attribute approach
// function toggleStylesheet(enabled) {
//   // Get all stylesheets
//   Array.from(document.styleSheets).forEach(styleSheet => {
//     // Only target our extension's stylesheet
//     if (styleSheet.href && styleSheet.href.endsWith('styles.css')) {
//       try {
//         styleSheet.disabled = !enabled;
//       } catch (e) {
//         console.error('Error toggling stylesheet:', e);
//       }
//     }
//   });
// }

// Load saved state from storage
chrome.storage.sync.get('enabled', function(data) {
  extensionEnabled = data.enabled !== undefined ? data.enabled : true;
  
  // Apply initial state
  if (extensionEnabled) {
    enableMinimalMode();
  } else {
    disableMinimalMode();
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggle') {
    extensionEnabled = message.enabled;
    
    if (extensionEnabled) {
      enableMinimalMode();
    } else {
      disableMinimalMode();
    }
  }
});

// Function to apply minimal mode
function enableMinimalMode() {
  // Set the attribute on the body element
  document.body.setAttribute('data-minimal-linkedin', 'enabled');
  
  // Create and start the observer
  if (!window.minimalLinkedInObserver) {
    initializeObserver();
  }
  
  // Apply styles immediately
  applyMinimalStyles();
}

// Function to disable minimal mode
function disableMinimalMode() {
  // Remove the attribute from the body element
  document.body.removeAttribute('data-minimal-linkedin');
  
  // Disconnect observer if it exists
  if (window.minimalLinkedInObserver) {
    window.minimalLinkedInObserver.disconnect();
    window.minimalLinkedInObserver = null;
  }
  
  // Restore original styles
  restoreOriginalStyles();
}

// Apply minimal styles to the page
function applyMinimalStyles() {
  // All cleanup logic including hiding elements
  const additionalSelectors = [
    '.feed-shared-update-v2__description-wrapper', // Extra content in feed
    '.feed-shared-update-v2__social-actions', // Reactions and comments
    '.artdeco-dropdown__trigger', // Various dropdown menus
    '.artdeco-pill-choice-group', // Filter pills
    '.community-panel', // Community panels
    '.scaffold-finite-scroll__content > div:not(:first-child)', // Hide everything except the post creation box
    '[data-test-id*="premium"]', // Premium prompts
    '.feed-shared-premium-upsell', // Premium upsell banners
    '.premium-upsell-card', // Premium upsell cards
    '.feed-shared-update-v2', // Feed updates
    '.update-components-actor', // Author components in feed
    '.feed-shared-control-menu', // "..." menu on posts
    '.feed-identity-module', // Identity module
    '.ad-banner', // Ad banners
    '.feed-shared-text-poll', // Polls in feed
    '.global-nav__nav > ul > li', // Navigation elements
    '.occludable-update', // Feed updates
    '.feed-shared-update', // Feed updates
    '.artdeco-dropdown[class*="artdeco-dropdown--placement-bottom"]', // Sort by dropdown (exact selector)
    '.mb2.artdeco-dropdown', // Sort by dropdown (exact selector)
    'div.mb2.artdeco-dropdown.artdeco-dropdown--placement-bottom', // Sort by dropdown (full class)
    'button[data-control-name="show_more_updates"]', // Show more feed updates button
    '.scaffold-finite-scroll__load-button', // Show more feed updates button
    'button[data-test-id*="feed-load-more"]', // Show more feed updates button
    'div[class*="scaffold-finite-scroll"] > button', // Show more feed updates button
    '.feed-shared-update-v2__show-more-button' // Show more feed updates button
  ];

  // Only hide elements if extension is enabled
  if (extensionEnabled) {
    // Hide elements
    additionalSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (!element.closest('.share-box-feed-entry__closed-share-box')) {
          // Store original display value if not already stored
          if (!element.dataset.originalDisplay) {
            element.dataset.originalDisplay = element.style.display || '';
          }
          element.style.display = 'none';
        }
      });
    });

    // Make sure only the create post element is visible in the feed
    const feedItems = document.querySelectorAll('.scaffold-finite-scroll__content > div');
    if (feedItems.length > 0) {
      const createPostElement = feedItems[0]; // First element is usually the post creation box
      
      // Hide everything after the create post element
      for (let i = 1; i < feedItems.length; i++) {
        if (!feedItems[i].dataset.originalDisplay) {
          feedItems[i].dataset.originalDisplay = feedItems[i].style.display || '';
        }
        feedItems[i].style.display = 'none';
      }
    }

    // Hide premium prompts within the create post box
    document.querySelectorAll('.share-box-feed-entry__closed-share-box [data-test-id*="premium"]').forEach(element => {
      if (!element.dataset.originalDisplay) {
        element.dataset.originalDisplay = element.style.display || '';
      }
      element.style.display = 'none';
    });

    // Make sure only the LinkedIn logo and search bar are visible in the top navigation
    const navItems = document.querySelectorAll('.global-nav__nav > ul > li');
    navItems.forEach((item) => {
      // Store original value
      if (!item.dataset.originalDisplay) {
        item.dataset.originalDisplay = item.style.display || '';
      }
      // Hide all nav items
      item.style.display = 'none';
    });

    // Keep the LinkedIn logo visible
    const logoElement = document.querySelector('.global-nav__branding');
    if (logoElement) {
      logoElement.style.display = 'flex';
    }

    // Keep the search bar visible
    const searchElement = document.querySelector('.search-global-typeahead');
    if (searchElement) {
      searchElement.style.display = 'flex';
    }

    // Specifically target and hide the "Sort by: Top" dropdown based on provided HTML
    document.querySelectorAll('.mb2.artdeco-dropdown, div.artdeco-dropdown[class*="placement-bottom"]').forEach(element => {
      if (!element.dataset.originalDisplay) {
        element.dataset.originalDisplay = element.style.display || '';
      }
      element.style.display = 'none';
    });

    // Look for elements containing the text "Sort by" - Fixed to handle null parent
    try {
      document.querySelectorAll('*').forEach(el => {
        if (el && el.textContent && el.textContent.includes('Sort by:')) {
          // Find the parent dropdown container
          let parent = el;
          for (let i = 0; i < 5 && parent; i++) { // Look up to 5 levels up, and check if parent exists
            if (parent.classList && parent.classList.contains('artdeco-dropdown')) {
              if (!parent.dataset.originalDisplay) {
                parent.dataset.originalDisplay = parent.style.display || '';
              }
              parent.style.display = 'none';
              break;
            }
            // Only proceed if parent has a parentElement
            if (parent.parentElement) {
              parent = parent.parentElement;
            } else {
              // Exit the loop if no parent element exists
              break;
            }
          }
        }
      });
    } catch (error) {
      console.log('Error while processing "Sort by" elements:', error);
    }

    // Hide the "Show more feed updates" button - Fixed approach without :contains
    document.querySelectorAll('.scaffold-finite-scroll__load-button').forEach(element => {
      if (!element.dataset.originalDisplay) {
        element.dataset.originalDisplay = element.style.display || '';
      }
      element.style.display = 'none';
    });
    
    // Find buttons with "Show more feed updates" text
    document.querySelectorAll('button').forEach(button => {
      if (button.textContent && button.textContent.trim().includes('Show more feed updates')) {
        if (!button.dataset.originalDisplay) {
          button.dataset.originalDisplay = button.style.display || '';
        }
        button.style.display = 'none';
      }
    });
  }
}

// Restore original styles
function restoreOriginalStyles() {
  // Get all elements we've modified
  document.querySelectorAll('[data-original-display]').forEach(element => {
    // Restore to the original display value
    element.style.display = element.dataset.originalDisplay;
  });
  
  // Specifically restore navigation items
  document.querySelectorAll('.global-nav__nav > ul > li').forEach(item => {
    item.style.display = '';
  });
  
  // Restore feed items
  document.querySelectorAll('.feed-shared-update-v2, .occludable-update, .feed-shared-update').forEach(item => {
    item.style.display = '';
  });
  
  // Restore all other commonly hidden elements
  const elementsToRestore = [
    '.scaffold-layout__sidebar',
    '.scaffold-layout__aside',
    '.global-nav__nav > ul > li',
    '.msg-overlay-container',
    '.global-footer',
    '.feed-follows-module',
    '.ad-banner-container',
    '.feed-shared-news-module',
    '.feed-shared-news-module__container',
    '.feed-shared-update-v2--minimal',
    '.premium-upsell-link',
    '.feed-shared-premium-upsell-button',
    '.premium-upsell-container',
    '.premium-upsell',
    '.premium-upsell-card',
    '[data-test-id*="premium"]',
    '.feed-new-update-pill',
    '.feed-new-update-pill__new-update-button',
    'div[class*="feed-new-update-pill"]',
    '.artdeco-dropdown[class*="artdeco-dropdown--placement-bottom"]',
    '.scaffold-finite-scroll__load-button',
    '.feed-shared-update-v2__show-more-button'
  ];
  
  elementsToRestore.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.style.display = '';
    });
  });
  
  // Clean up the data attribute to avoid issues with future toggles
  document.querySelectorAll('[data-original-display]').forEach(element => {
    delete element.dataset.originalDisplay;
  });
}

// Initialize the MutationObserver
function initializeObserver() {
  // Observer to handle dynamically loaded elements
  window.minimalLinkedInObserver = new MutationObserver(() => {
    if (extensionEnabled) {
      applyMinimalStyles();
    }
  });

  // Start observing changes to the DOM
  window.minimalLinkedInObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
}

// Run cleanup on initial load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Minimal LinkedIn: Extension initialized');
  
  // Run the cleanup immediately on load if enabled
  setTimeout(() => {
    if (extensionEnabled) {
      applyMinimalStyles();
    }
  }, 500);
  
  // Inject status attribute into body for CSS to detect
  const updateExtensionStatus = () => {
    if (extensionEnabled) {
      document.body.setAttribute('data-minimal-linkedin', 'enabled');
    } else {
      document.body.removeAttribute('data-minimal-linkedin');
    }
  };
  
  // Set initial status
  updateExtensionStatus();
  
  // Listen for changes to enabled state
  chrome.storage.onChanged.addListener(function(changes) {
    if (changes.enabled) {
      extensionEnabled = changes.enabled.newValue;
      updateExtensionStatus();
    }
  });
}); 