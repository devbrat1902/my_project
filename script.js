/* ============================================
   PROFESSIONAL EXCELLENCE INSTITUTE
   Advanced JavaScript - Animations & Interactions
   ============================================ */

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeForm();
    initializeCounters();
    initializeMobileMenu();
    initializeVideoZoomScroll();
});

// ============================================
// Navigation
// ============================================
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-links');
                mobileMenu.classList.remove('active');
                const menuToggle = document.querySelector('.menu-toggle');
                menuToggle.classList.remove('active');
            }
        });
    });
}

// ============================================
// Mobile Menu
// ============================================
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// ============================================
// Scroll Animations with Intersection Observer
// ============================================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll(
        '.solution-card, .testimonial-card, .contact-card, .impact-card, ' +
        '.credential-badge, .about-image, .casestudy-video'
    ).forEach(element => {
        observer.observe(element);
    });

    // Counter animation observer
    observeCounters();
}

// ============================================
// Counter Animation
// ============================================
function observeCounters() {
    const counterOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const numbers = entry.target.querySelectorAll('.impact-number');
                numbers.forEach(number => {
                    animateCounter(number);
                });
                entry.target.classList.add('counted');
            }
        });
    }, counterOptions);

    const impactSection = document.querySelector('.impact-section');
    if (impactSection) {
        counterObserver.observe(impactSection);
    }
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (target - start) * easeOutQuad(progress));
        
        element.textContent = value + (element.textContent.includes('%') ? '%' : 
                                      element.textContent.includes('+') ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// ============================================
// Form Validation and Submission
// ============================================
function initializeForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            validateField(this);
        });

        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const errorElement = field.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    if (errorElement) {
        errorElement.remove();
    }

    if (field.name === 'name') {
        if (field.value.trim().length < 2) {
            isValid = false;
            errorMessage = 'Please enter your full name';
        }
    } else if (field.name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.name === 'phone') {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (field.value && !phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    } else if (field.name === 'company') {
        if (field.value.trim().length < 2) {
            isValid = false;
            errorMessage = 'Please enter your company name';
        }
    } else if (field.name === 'service') {
        if (field.value === '') {
            isValid = false;
            errorMessage = 'Please select a service';
        }
    } else if (field.name === 'message') {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Please enter a message (at least 10 characters)';
        }
    }

    if (!isValid && errorMessage) {
        field.style.borderColor = '#FCA5A5';
        const error = document.createElement('span');
        error.className = 'form-error';
        error.textContent = errorMessage;
        field.parentElement.appendChild(error);
    } else {
        field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }

    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const fields = form.querySelectorAll('input, textarea, select');
    const checkbox = form.querySelector('input[type="checkbox"]');
    let isFormValid = true;

    // Validate all fields
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    // Check checkbox
    if (!checkbox || !checkbox.checked) {
        isFormValid = false;
        showFormError('Please agree to the terms and conditions');
    }

    if (!isFormValid) {
        return;
    }

    // Form is valid - collect data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        service: formData.get('service'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };

    // Log form data (in production, send to server)
    console.log('Form Data:', data);

    // Show success message
    showFormSuccess();

    // Reset form
    form.reset();
    
    // Clear error states
    fields.forEach(field => {
        field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        const errorElement = field.parentElement.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

function showFormSuccess() {
    const formContainer = document.querySelector('.contact-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.5); 
                    color: #DBEAFE; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; 
                    animation: slideInDown 0.5s ease-out;">
            <strong>✓ Success!</strong> Your consultation request has been received. We'll contact you within 24 hours.
        </div>
    `;
    
    const form = formContainer.querySelector('form');
    form.parentElement.insertBefore(successMessage, form);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

function showFormError(message) {
    const formContainer = document.querySelector('.contact-form');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error-message';
    errorMessage.innerHTML = `
        <div style="background: rgba(252, 165, 165, 0.2); border: 1px solid rgba(252, 165, 165, 0.5); 
                    color: #FECACA; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <strong>⚠ Error:</strong> ${message}
        </div>
    `;
    
    const form = formContainer.querySelector('form');
    form.parentElement.insertBefore(errorMessage, form);

    // Remove error message after 5 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// ============================================
// Dropdown Menu Handling
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.visibility = 'visible';
                menu.style.opacity = '1';
            }
        });

        dropdown.addEventListener('mouseleave', function() {
            const menu = this.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.visibility = 'hidden';
                menu.style.opacity = '0';
            }
        });
    });
});

// ============================================
// Text Animation on Page Load
// ============================================
function animateHeroTitle() {
    const words = document.querySelectorAll('.hero-title .word');
    let delay = 0.2;

    words.forEach((word, index) => {
        word.style.animation = `slideInUp 0.8s ease-out ${delay}s backwards`;
        delay += 0.2;
    });
}

// ============================================
// Lazy Loading Images
// ============================================
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Parallax Scroll Effect
// ============================================
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', function() {
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax;
            const yPos = window.scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============================================
// Smooth Scroll Behavior Enhancement
// ============================================
function enhanceSmoothScroll() {
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// Tooltip Functionality
// ============================================
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                pointer-events: none;
                z-index: 1000;
                top: ${this.offsetTop - 40}px;
                left: ${this.offsetLeft}px;
            `;
            document.body.appendChild(tooltip);
            
            this.tooltipElement = tooltip;
        });

        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
                delete this.tooltipElement;
            }
        });
    });
}

// ============================================
// Page Performance Optimization
// ============================================
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        initializeLazyLoading();
        initializeParallax();
        enhanceSmoothScroll();
        initializeTooltips();
    });
} else {
    setTimeout(() => {
        initializeLazyLoading();
        initializeParallax();
        enhanceSmoothScroll();
        initializeTooltips();
    }, 500);
}

// ============================================
// Utility Functions
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detect if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add CSS class on scroll
const addClassOnScroll = throttle(function() {
    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        }
    });
}, 200);

window.addEventListener('scroll', addClassOnScroll);

// ============================================
// Keyboard Navigation
// ============================================
document.addEventListener('keydown', function(e) {
    // ESC key closes dropdowns
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active');
        const menuToggle = document.querySelector('.menu-toggle');
        menuToggle.classList.remove('active');
    }

    // Tab key navigation
    if (e.key === 'Tab') {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active');
    }
});

// ============================================
// Print Styles Handler
// ============================================
window.addEventListener('beforeprint', function() {
    // Hide elements that shouldn't print
    document.querySelectorAll('.no-print').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', function() {
    // Restore elements after print
    document.querySelectorAll('.no-print').forEach(el => {
        el.style.display = '';
    });
});

// ============================================
// PWA Support (Progressive Web App)
// ============================================
if ('serviceWorker' in navigator) {
    // Uncomment when service worker is ready
    // navigator.serviceWorker.register('/sw.js');
}

// ============================================
// Accessibility Enhancements
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // First and last focusable elements
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Trap focus in modal (when needed)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.active');
            if (modal) {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });
});

// ============================================
// Analytics Event Tracking (Optional)
// ============================================
function trackEvent(eventName, eventData = {}) {
    // Log events for analytics
    console.log(`Event: ${eventName}`, eventData);
    
    // Uncomment when ready to send to analytics service
    // if (window.gtag) {
    //     gtag('event', eventName, eventData);
    // }
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_class: e.target.className
        });
    }
});

// ============================================
// Dark Mode Support (Optional)
// ============================================
const darkModeToggle = document.querySelector('[data-dark-mode-toggle]');
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Check for saved preference
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
}

// ============================================
// Video Zoom on Scroll
// ============================================
function initializeVideoZoomScroll() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;

    window.addEventListener('scroll', throttle(function() {
        const scrollPercent = (window.scrollY / window.innerHeight) * 100;
        const zoomAmount = 1 + (scrollPercent / 500); // Progressive zoom
        heroVideo.style.transform = `scale(${Math.min(zoomAmount, 1.5)})`;
    }, 50));
}

// ============================================
// Scroll Progress Bar
// ============================================
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', throttle(function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, 100));
}

// ============================================
// Page Visibility API
// ============================================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});

// ============================================
// Export functions for external use
// ============================================
window.PEI = {
    trackEvent: trackEvent,
    debounce: debounce,
    throttle: throttle,
    isInViewport: isInViewport,
    validateField: validateField,
    animateCounter: animateCounter
};
