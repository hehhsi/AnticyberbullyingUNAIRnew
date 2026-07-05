/* =========================================
   SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% is visible
    };

    const nav = document.querySelector('.navbar');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If the element is a stats-grid, trigger counting animations
                if (entry.target.classList.contains('stats-grid')) {
                    animateNumbers();
                }

                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            } else {
                // Optional: Remove class to re-animate on scroll up (toggle this if desired)
                // entry.target.classList.remove('visible'); 
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-reveal');
    animatedElements.forEach(el => observer.observe(el));
});

/* =========================================
   NUMBER COUNTING ANIMATION
   ========================================= */
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(num => {
        const target = +num.getAttribute('data-target');
        const count = +num.innerText.replace(/\D/g, ''); // Remove non-digits
        const increment = target / 50; // Speed control
        const suffix = num.innerText.replace(/\d/g, ''); // Keep % or text

        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                num.innerText = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCount);
            } else {
                num.innerText = target + suffix;
            }
        };

        updateCount();
    });
}
