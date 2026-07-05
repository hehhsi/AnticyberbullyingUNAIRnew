document.addEventListener('DOMContentLoaded', () => {
    
    // --- Loader ---
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500); // Fake load time for effect

    // --- Theme Toggle ---
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check local storage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Scroll Observer (Section Active State) ---
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Optional: remove active class to re-trigger animation on scroll back
                // entry.target.classList.remove('active'); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-section').forEach(section => {
        observer.observe(section);
    });

});
