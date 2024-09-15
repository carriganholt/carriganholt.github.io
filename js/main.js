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

    // Debounce function for performance
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
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
            // Trigger the visibility of the first section
            const firstSection = document.querySelector('section');
            if (firstSection) {
                firstSection.style.opacity = '1';
                firstSection.style.transform = 'translateY(0)';
            }
        }, 500);
    }

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
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Add this new code to handle section visibility
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Handle navigation dots
    function initNavDots() {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navDots.forEach(dot => {
                        dot.classList.toggle('active', dot.getAttribute('data-section') === id);
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            navObserver.observe(section);
        });

        navDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetId = dot.getAttribute('data-section');
                smoothScroll(`#${targetId}`, 1000);
            });
        });
    }

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

                // Set focus to the modal for accessibility
                modal.focus();
            });
        });

        closeModal.addEventListener('click', closePortfolioModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePortfolioModal();
            }
        });

        // Close modal with Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closePortfolioModal();
            }
        });
    }

    function closePortfolioModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        // Return focus to the clicked portfolio item
        document.querySelector('.portfolio-item:focus').focus();
    }

    // Error handling
    function handleErrors() {
        window.addEventListener('error', (e) => {
            console.error('An error occurred:', e.error);
            // You could add more sophisticated error handling here, such as displaying a user-friendly error message
        });
    }

    // Initialize all functions
    function init() {
        createStars();
        animateStars();
        window.addEventListener('load', handleLoadingScreen);
        initSmoothScrolling();
        initIntersectionObserver();
        initNavDots();
        initLazyLoading();
        initPortfolioModal();
        handleErrors();
    }

    // Run initialization
    init();
})();