// Speechify Dark PDF Viewer - Popup Script
console.log('[Speechify Dark] Popup script loaded');

const toggleSwitch = document.getElementById('toggleSwitch');
const statusDiv = document.getElementById('status');

// Update UI based on current state
async function updateUI(enabled) {
    if (enabled) {
        toggleSwitch.classList.add('active');
        statusDiv.textContent = '✓ Dark mode is ON';
        statusDiv.className = 'status enabled';
    } else {
        toggleSwitch.classList.remove('active');
        statusDiv.textContent = '✗ Dark mode is OFF';
        statusDiv.className = 'status disabled';
    }
}

// Get current dark mode state
async function getCurrentState() {
    try {
        const result = await chrome.storage.sync.get(['darkModeEnabled']);
        const enabled = result.darkModeEnabled !== false; // Default to true
        await updateUI(enabled);
        return enabled;
    } catch (error) {
        console.error('[Speechify Dark] Error getting state:', error);
        statusDiv.textContent = 'Error loading state';
        statusDiv.className = 'status disabled';
        return false;
    }
}

// Toggle dark mode
async function toggleDarkMode() {
    try {
        const currentState = await getCurrentState();
        const newState = !currentState;
        
        // Save to storage (this will trigger icon update in background.js)
        await chrome.storage.sync.set({ darkModeEnabled: newState });
        
        // Update UI
        await updateUI(newState);
        
        // Send message to content script in active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id && tab.url && tab.url.includes('speechify.com')) {
            try {
                await chrome.tabs.sendMessage(tab.id, {
                    action: 'toggleDarkMode',
                    enabled: newState
                });
                console.log('[Speechify Dark] Toggle successful');
            } catch (error) {
                // Content script not ready or tab doesn't match - that's okay
                console.log('[Speechify Dark] Content script not active in this tab');
            }
        }
    } catch (error) {
        console.error('[Speechify Dark] Error toggling:', error);
        statusDiv.textContent = 'Error toggling mode';
        statusDiv.className = 'status disabled';
    }
}

// Event listener for toggle switch
toggleSwitch.addEventListener('click', toggleDarkMode);

// Initialize popup
getCurrentState();

console.log('[Speechify Dark] Popup ready');
