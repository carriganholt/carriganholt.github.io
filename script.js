// Retro Background
function createStars() {
    const background = document.getElementById('retro-background');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5-10 seconds, slower animation
        background.appendChild(star);
    }
}

function animateStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        const speed = Math.random() * 0.25 + 0.25; // 0.25-0.5 pixels per frame, slower movement
        let posY = parseFloat(star.style.top);
        posY += speed;
        if (posY > 100) {
            posY = -5;
        }
        star.style.top = `${posY}%`;
    });
    requestAnimationFrame(animateStars);
}

// Call these functions when the page loads
window.addEventListener('load', () => {
    createStars();
    animateStars();
});

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
});

// Custom Smooth Scrolling
function smoothScroll(target, duration) {
    const targetElement = document.querySelector(target);
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
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

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScroll(target, 1500); // Adjust the duration (in ms) to make it slower or faster
    });
});

// Animated text
const animatedElements = document.querySelectorAll('.animated-text');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(element => {
    observer.observe(element);
});

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-bar');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillLevel = entry.target.getAttribute('data-skill');
            entry.target.style.width = `${skillLevel}%`;
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Portfolio modal
const portfolioItems = document.querySelectorAll('.portfolio-item');
const modal = document.querySelector('.portfolio-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalImage = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');

portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.portfolio-title').textContent;
        const category = item.querySelector('.portfolio-category').textContent;
        const imageSrc = item.querySelector('.portfolio-image').src;
        
        modalTitle.textContent = title;
        modalDescription.textContent = `${category}\n\nDetailed description of the ${title} project goes here.`;
        modalImage.src = imageSrc;
        modal.style.display = 'block';
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Section transitions
const sections = document.querySelectorAll('section');

function handleSectionVisibility() {
    const scrollPos = window.pageYOffset;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop - window.innerHeight / 2 &&
            scrollPos < sectionTop + sectionHeight - window.innerHeight / 2) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

// Initial call to set visibility of sections
handleSectionVisibility();

// Add scroll event listener
window.addEventListener('scroll', handleSectionVisibility);

// Navigation dots
const navDots = document.querySelectorAll('.nav-dot');

function updateNavDots() {
    const scrollPos = window.pageYOffset;
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= sectionTop - window.innerHeight / 2 &&
            scrollPos < sectionTop + sectionHeight - window.innerHeight / 2) {
            navDots[index].classList.add('active');
        } else {
            navDots[index].classList.remove('active');
        }
    });
}

// Initial call to set active nav dot
updateNavDots();

// Add scroll event listener for nav dots
window.addEventListener('scroll', updateNavDots);