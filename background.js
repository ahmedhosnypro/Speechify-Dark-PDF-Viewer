// Speechify Dark PDF Viewer - Background Service Worker
console.log('[Speechify Dark] Background service worker initialized');

// Update icon based on dark mode state
async function updateIcon(enabled) {
    const iconPath = enabled ? {
        "16": "icons/icon16.png",
        "32": "icons/icon32.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
    } : {
        "16": "icons/icon16-inactive.png",
        "32": "icons/icon32-inactive.png",
        "48": "icons/icon48-inactive.png",
        "128": "icons/icon128-inactive.png"
    };
    
    console.log('[Speechify Dark] Updating icon, enabled:', enabled);
    
    try {
        await chrome.action.setIcon({ path: iconPath });
        console.log('[Speechify Dark] Icon updated successfully');
    } catch (error) {
        console.error('[Speechify Dark] Could not update icon:', error);
    }
}

// Set default settings on install
chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('[Speechify Dark] Extension installed/updated:', details.reason);
    
    // Set default dark mode to enabled
    let result = await chrome.storage.sync.get(['darkModeEnabled']);
    if (result.darkModeEnabled === undefined) {
        await chrome.storage.sync.set({ darkModeEnabled: true });
        result.darkModeEnabled = true;
        console.log('[Speechify Dark] Default settings initialized');
    }
    
    // Update icon to match state
    await updateIcon(result.darkModeEnabled !== false);
});

// Initialize icon on startup
chrome.runtime.onStartup.addListener(async () => {
    const result = await chrome.storage.sync.get(['darkModeEnabled']);
    await updateIcon(result.darkModeEnabled !== false);
    console.log('[Speechify Dark] Icon initialized on startup');
});

// Listen for storage changes and update icon
chrome.storage.onChanged.addListener(async (changes, namespace) => {
    console.log('[Speechify Dark] Storage changed:', changes, 'namespace:', namespace);
    if (namespace === 'sync' && changes.darkModeEnabled) {
        const enabled = changes.darkModeEnabled.newValue;
        console.log('[Speechify Dark] Dark mode setting changed to:', enabled);
        await updateIcon(enabled);
    }
});

// Update icon when user navigates to Speechify
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('speechify.com')) {
        const result = await chrome.storage.sync.get(['darkModeEnabled']);
        await updateIcon(result.darkModeEnabled !== false);
    }
});

// Optional: Add context menu for quick toggle
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'toggleDarkMode',
        title: 'Toggle Speechify Dark Mode',
        contexts: ['page'],
        documentUrlPatterns: ['*://app.speechify.com/*', '*://*.speechify.com/*']
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'toggleDarkMode') {
        // Get current state
        const result = await chrome.storage.sync.get(['darkModeEnabled']);
        const currentState = result.darkModeEnabled !== false;
        const newState = !currentState;
        
        // Save new state
        await chrome.storage.sync.set({ darkModeEnabled: newState });
        
        // Update icon
        await updateIcon(newState);
        
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
            action: 'toggleDarkMode',
            enabled: newState
        });
    }
});

console.log('[Speechify Dark] Background service worker ready');

