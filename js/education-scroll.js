/* =========================================
   EDUCATION PAGE - Scroll Animation Controller
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const chapters = document.querySelectorAll('.chapter');
    const dots = document.querySelectorAll('.chapter-dot');
    const container = document.querySelector('.education-container');

    // Intersection Observer for chapter visibility
    const observerOptions = {
        root: container,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Mark chapter as active
                entry.target.classList.add('active');

                // Update progress dots
                const chapterNum = entry.target.dataset.chapter;
                dots.forEach(dot => {
                    dot.classList.toggle('active', dot.dataset.chapter === chapterNum);
                });

                // Trigger stat counting for Chapter 3
                if (chapterNum === '3') {
                    animateStats(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all chapters
    chapters.forEach(chapter => {
        chapterObserver.observe(chapter);
    });

    // Click navigation for dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetChapter = document.querySelector(`.chapter[data-chapter="${dot.dataset.chapter}"]`);
            if (targetChapter) {
                targetChapter.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Stat counter animation
    function animateStats(chapter) {
        const stats = chapter.querySelectorAll('.impact-stat');

        stats.forEach(stat => {
            if (stat.dataset.animated) return;
            stat.dataset.animated = 'true';

            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);

                stat.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target;
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentActive = document.querySelector('.chapter.active');
        if (!currentActive) return;

        const currentNum = parseInt(currentActive.dataset.chapter);
        let targetNum = currentNum;

        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            targetNum = Math.min(currentNum + 1, chapters.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            targetNum = Math.max(currentNum - 1, 1);
        }

        if (targetNum !== currentNum) {
            const targetChapter = document.querySelector(`.chapter[data-chapter="${targetNum}"]`);
            if (targetChapter) {
                targetChapter.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Initialize first chapter as active
    if (chapters.length > 0) {
        chapters[0].classList.add('active');
    }
});
