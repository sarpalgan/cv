// ==========================================
// INTERACTIVE PARTICLE BACKGROUND
// ==========================================

const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;
let isMouseInHero = false;

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (isMouseInHero) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
        }

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(184, 92, 79, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(184, 92, 79, ${0.15 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

// Initialize
initCanvas();
createParticles();
animateParticles();

// Mouse tracking
const heroSection = document.getElementById('hero');

heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = e.clientX;
    mouseY = e.clientY - rect.top;
    isMouseInHero = true;
});

heroSection.addEventListener('mouseleave', () => {
    isMouseInHero = false;
});

// Resize handler
window.addEventListener('resize', () => {
    initCanvas();
    createParticles();
});

// ==========================================
// SMOOTH SCROLL REVEAL ANIMATIONS
// ==========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all reveal elements
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2');
    revealElements.forEach(el => observer.observe(el));
});

// ==========================================
// PARALLAX SCROLLING EFFECT
// ==========================================

let lastScrollTop = 0;
const parallaxElements = document.querySelectorAll('.project-image');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    parallaxElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Only apply parallax when element is in viewport
        if (elementTop < window.innerHeight && elementTop + elementHeight > 0) {
            const scrollPercent = (window.innerHeight - elementTop) / (window.innerHeight + elementHeight);
            const parallaxValue = scrollPercent * 30; // Adjust for stronger/weaker effect
            
            element.style.transform = `translateY(${parallaxValue}px)`;
        }
    });
    
    lastScrollTop = scrollTop;
}, { passive: true });

// ==========================================
// NAVIGATION BACKGROUND ON SCROLL
// ==========================================

const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(245, 245, 240, 0.95)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    } else {
        nav.style.background = 'rgba(245, 245, 240, 0.8)';
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
}, { passive: true });

// ==========================================
// SMOOTH ANCHOR SCROLLING
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for empty hash or just '#'
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// CURSOR FOLLOW EFFECT (OPTIONAL)
// ==========================================

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 40px;
    height: 40px;
    border: 2px solid var(--color-accent);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
`;

// Only add cursor effect on desktop devices
if (window.innerWidth > 1024) {
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '0.5';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Expand cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-secondary, .project-image');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.opacity = '0.8';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.opacity = '0.5';
        });
    });
}

// ==========================================
// PROJECT HOVER EFFECT
// ==========================================

const projects = document.querySelectorAll('.project');

projects.forEach(project => {
    const image = project.querySelector('.project-image .image-placeholder');
    
    project.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1024) {
            image.style.transform = 'scale(1.05) translateY(-5px)';
        }
    });
    
    project.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1) translateY(0)';
    });
});

// ==========================================
// SKILLS CARD STAGGER ANIMATION
// ==========================================

const skillCards = document.querySelectorAll('.skill-category');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

skillCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    skillObserver.observe(card);
});

// ==========================================
// TEXT GRADIENT EFFECT ON HERO (OPTIONAL)
// ==========================================

const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.style.background = 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent) 100%)';
    heroTitle.style.webkitBackgroundClip = 'text';
    heroTitle.style.webkitTextFillColor = 'transparent';
    heroTitle.style.backgroundClip = 'text';
}

// ==========================================
// SCROLL PROGRESS INDICATOR (OPTIONAL)
// ==========================================

const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: var(--color-accent);
    z-index: 10000;
    transition: width 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    width: 0%;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
}, { passive: true });

// ==========================================
// LAZY LOADING FOR IMAGES (When you add real images)
// ==========================================

// Uncomment this when you have real images
/*
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}
*/

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c👋 Welcome to my portfolio!', 'font-size: 16px; color: #B85C4F; font-weight: bold;');
console.log('%cBuilt with care and attention to detail.', 'font-size: 12px; color: #6B6B6B;');
