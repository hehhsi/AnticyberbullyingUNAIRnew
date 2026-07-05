/* =========================================
   PAGE TRANSITION SYSTEM
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Inject the overlay HTML if it doesn't exist
    if (!document.querySelector('.transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'transition-overlay';
        overlay.innerHTML = `
            <div class="shape-layer layer-1"></div>
            <div class="shape-layer layer-2"></div>
            <div class="shape-layer layer-3"></div>
        `;
        document.body.appendChild(overlay);
    }

    const overlay = document.querySelector('.transition-overlay');

    // Handle all links with specific class or all internal nav links
    // We'll target our navbar links and buttons
    const links = document.querySelectorAll('a[href].nav-transition, .nav-links a, .logo-link');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');

            // Ignore hash links (on-page scroll) or external
            if (target.startsWith('#') || target.startsWith('http')) return;

            e.preventDefault();
            playRandomTransition(target);
        });
    });

    function playRandomTransition(targetUrl) {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';

        // Define animation variants
        const variants = ['circle-wipe', 'grid-slide', 'polygon-shatter'];
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];

        // Apply classes
        overlay.classList.add('is-active');
        overlay.setAttribute('data-effect', randomVariant);
        overlay.setAttribute('data-theme-context', theme);

        // Wait for entrance animation to cover screen
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 800); // 800ms match CSS duration
    }
});
