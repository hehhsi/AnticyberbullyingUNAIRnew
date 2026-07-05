/* =========================================
   THEME TOGGLE LOGIC (GHOST EDITION)
   ========================================= */
const toggleCheckbox = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// 1. Initialize State from LocalStorage
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);

// 2. Sync Checkbox State (Checked = Light Mode, Unchecked = Dark Mode)
// Logic: If savedTheme is 'light', checkbox should be checked.
toggleCheckbox.checked = savedTheme === 'light';

// 3. Event Listener
toggleCheckbox.addEventListener('change', () => {
    const isLightMode = toggleCheckbox.checked;
    const newTheme = isLightMode ? 'light' : 'dark';

    // Set Theme
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});
