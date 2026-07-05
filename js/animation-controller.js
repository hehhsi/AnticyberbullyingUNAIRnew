/* =========================================
   NAVBAR SCROLL ANIMATION
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Add scrolled class when scrolled down
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }
});

/* =========================================
   ENHANCED SCROLL REVEAL
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-reveal elements
    document.querySelectorAll('.fade-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Observe question cards
    document.querySelectorAll('.question-card').forEach(el => {
        revealObserver.observe(el);
    });
});

/* =========================================
   HERO TITLE WORD WRAPPER
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');

    if (heroTitle) {
        // Get text content and normalize whitespace
        const text = heroTitle.textContent.trim().replace(/\s+/g, ' ');
        const words = text.split(' ').filter(word => word.length > 0);

        heroTitle.innerHTML = words.map(word =>
            `<span class="word">${word}</span>`
        ).join(' ');
    }
});

/* =========================================
   PARALLAX SCROLL EFFECTS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.section-hero');
    const heroBgLayers = document.querySelectorAll('.hero-bg-layer');
    const gradientOrbs = document.querySelectorAll('.gradient-orb');

    // Scroll-based parallax
    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Hero background parallax (moves slower than scroll)
        heroBgLayers.forEach((layer, index) => {
            const speed = 0.3 + (index * 0.1);
            layer.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Gradient orbs parallax
        gradientOrbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            const yOffset = scrollY * speed;
            orb.style.transform = `translateY(${yOffset}px)`;
        });

        // Fade hero content as user scrolls down
        if (heroSection) {
            const heroContent = heroSection.querySelector('.gate-content');
            if (heroContent) {
                const fadeStart = 100;
                const fadeEnd = windowHeight * 0.5;
                const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
                const scale = 1 - (scrollY / windowHeight) * 0.1;

                heroContent.style.opacity = Math.max(0.3, opacity);
                heroContent.style.transform = `translateY(${scrollY * 0.2}px) scale(${Math.max(0.9, scale)})`;
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Initial call
    updateParallax();
});

/* =========================================
   MOUSE PARALLAX EFFECT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const parallaxElements = document.querySelectorAll('[data-mouse-parallax]');

    if (parallaxElements.length === 0) return;

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.mouseParallax) || 20;
            const x = mouseX * speed;
            const y = mouseY * speed;

            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});
