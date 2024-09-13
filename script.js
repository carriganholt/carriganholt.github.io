'use strict';

(function() {
    // Cache DOM elements
    const loadingScreen = document.getElementById('loading-screen');
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.querySelector('.portfolio-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.querySelector('.close-modal');

    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Create stars for retro background
    function createStars() {
        const background = document.getElementById('retro-background');
        const starCount = 100;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            background.appendChild(star);
        }
    }

    // Animate stars
    function animateStars() {
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const speed = Math.random() * 0.5 + 0.5;
            let posY = parseFloat(star.style.top);
            posY += speed;
            if (posY > 100) {
                posY = -5;
            }
            star.style.top = `${posY}%`;
        });
        requestAnimationFrame(animateStars);
    }

    // Handle loading screen
    function handleLoadingScreen() {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

// Smooth scrolling with controlled speed
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScroll(targetElement, 1500); // Scroll duration in milliseconds
            }
        });
    });
}

function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Make sure to call this function in your init() or main script
initSmoothScrolling();

    // Intersection Observer for animated elements
    function initIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.animated-text, .skill-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('skill-bar')) {
                        const skillLevel = entry.target.getAttribute('data-skill');
                        entry.target.style.width = `${skillLevel}%`;
                    }
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Handle scroll events
    const handleScroll = throttle(() => {
        const scrollPos = window.pageYOffset;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop - window.innerHeight / 2 &&
                scrollPos < sectionTop + sectionHeight - window.innerHeight / 2) {
                section.classList.add('visible');
                navDots[index].classList.add('active');
            } else {
                section.classList.remove('visible');
                navDots[index].classList.remove('active');
            }
        });
    }, 100);

    // Lazy loading for images
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy-image');
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    lazyImageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    // Handle portfolio modal
    function initPortfolioModal() {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('.portfolio-title').textContent;
                const category = item.querySelector('.portfolio-category').textContent;
                const imageSrc = item.querySelector('.portfolio-image').src;
                
                modalTitle.textContent = title;
                modalDescription.textContent = `${category}\n\nDetailed description of the ${title} project goes here.`;
                modalImage.src = imageSrc;
                modalImage.alt = `${title} project image`;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        closeModal.addEventListener('click', closePortfolioModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePortfolioModal();
            }
        });
    }

    function closePortfolioModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Initialize all functions
    function init() {
        createStars();
        animateStars();
        window.addEventListener('load', handleLoadingScreen);
        initSmoothScrolling();
        initIntersectionObserver();
        window.addEventListener('scroll', handleScroll);
        initLazyLoading();
        initPortfolioModal();
        handleScroll(); // Call initially to set correct state
    }

    // Run initialization
    init();

})();