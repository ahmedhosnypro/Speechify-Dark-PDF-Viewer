// Speechify Dark PDF Viewer - Content Script
console.log('[Speechify Dark] Content script loaded');

// Check if dark mode is enabled
async function checkDarkModeEnabled() {
    try {
        const result = await chrome.storage.sync.get(['darkModeEnabled']);
        return result.darkModeEnabled !== false; // Default to true
    } catch (error) {
        console.error('[Speechify Dark] Error checking dark mode:', error);
        return true;
    }
}

// Apply dark mode to body
function applyDarkMode() {
    document.body.classList.add('speechify-dark-mode');
    console.log('[Speechify Dark] Dark mode applied');
}

// Remove dark mode from body
function removeDarkMode() {
    document.body.classList.remove('speechify-dark-mode');
    console.log('[Speechify Dark] Dark mode removed');
}

// Initialize dark mode
async function init() {
    const isEnabled = await checkDarkModeEnabled();
    if (isEnabled) {
        applyDarkMode();
    }
}

// Observer to reapply dark mode if body class is removed
const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const isEnabled = await checkDarkModeEnabled();
            if (isEnabled && !document.body.classList.contains('speechify-dark-mode')) {
                console.log('[Speechify Dark] Reapplying dark mode...');
                applyDarkMode();
            }
        }
    }
});

// Start observing body class changes
if (document.body) {
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Listen for storage changes to update instantly
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.darkModeEnabled) {
        const enabled = changes.darkModeEnabled.newValue;
        console.log('[Speechify Dark] Storage changed, dark mode:', enabled);
        if (enabled) {
            applyDarkMode();
        } else {
            removeDarkMode();
        }
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Speechify Dark] Received message:', request);
    
    if (request.action === 'toggleDarkMode') {
        if (request.enabled) {
            applyDarkMode();
        } else {
            removeDarkMode();
        }
        sendResponse({ success: true });
    } else if (request.action === 'getDarkModeStatus') {
        const isEnabled = document.body.classList.contains('speechify-dark-mode');
        sendResponse({ enabled: isEnabled });
    }
    
    return true;
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('[Speechify Dark] Content script ready');
