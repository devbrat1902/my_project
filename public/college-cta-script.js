/**
 * UI ONLY — No Backend
 * College CTA Interactive Features
 * Form Validation & User Interactions
 * No actual data submission or storage
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initFormValidation();
    initSmoothScroll();
    initCharacterCounter();
});

// ============================================
// THEME TOGGLE
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('dark-theme');

        // Save preference
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Announce to screen readers
        const mode = isDark ? 'dark' : 'light';
        announceToScreenReader(`Switched to ${mode} mode`);
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal links
            if (href === '#' || href.startsWith('#')) {
                e.preventDefault();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Set focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            }
        });
    });
}

// ============================================
// CHARACTER COUNTER
// ============================================

function initCharacterCounter() {
    const messageField = document.getElementById('message');
    const charCounter = document.getElementById('messageCounter');
    const maxLength = 800;

    if (messageField && charCounter) {
        messageField.addEventListener('input', function () {
            const currentLength = this.value.length;
            charCounter.textContent = `${currentLength} / ${maxLength}`;

            // Visual feedback for character limit
            charCounter.classList.remove('warning', 'error');
            if (currentLength > maxLength * 0.9) {
                charCounter.classList.add('warning');
            }
            if (currentLength === maxLength) {
                charCounter.classList.add('error');
            }
        });
    }
}

// ============================================
// FORM VALIDATION
// ============================================

function initFormValidation() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    // Form fields
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const department = document.getElementById('department');
    const message = document.getElementById('message');
    const consent = document.getElementById('consent');

    // Validation on blur
    fullName.addEventListener('blur', () => validateFullName(fullName));
    email.addEventListener('blur', () => validateEmail(email));
    phone.addEventListener('blur', () => validatePhone(phone));
    message.addEventListener('blur', () => validateMessage(message));

    // Real-time validation on input (after first blur)
    fullName.addEventListener('input', function () {
        if (this.dataset.touched) validateFullName(this);
        checkFormValidity();
    });

    email.addEventListener('input', function () {
        if (this.dataset.touched) validateEmail(this);
        checkFormValidity();
    });

    phone.addEventListener('input', function () {
        if (this.dataset.touched) validatePhone(this);
        checkFormValidity();
    });

    message.addEventListener('input', function () {
        if (this.dataset.touched) validateMessage(this);
        checkFormValidity();
    });

    consent.addEventListener('change', checkFormValidity);
    department.addEventListener('change', checkFormValidity);

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Mark all fields as touched
        fullName.dataset.touched = 'true';
        email.dataset.touched = 'true';
        phone.dataset.touched = 'true';
        message.dataset.touched = 'true';

        // Validate all fields
        const isNameValid = validateFullName(fullName);
        const isEmailValid = validateEmail(email);
        const isPhoneValid = validatePhone(phone);
        const isMessageValid = validateMessage(message);
        const isConsentChecked = consent.checked;

        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid && isConsentChecked) {
            handleFormSubmit();
        } else {
            // Focus on first invalid field
            const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            announceToScreenReader('Please correct the errors in the form');
        }
    });

    // Check form validity to enable/disable submit button
    function checkFormValidity() {
        const isNameValid = fullName.value.trim().length >= 2;
        const isEmailValid = email.value.trim() === '' || validateEmailFormat(email.value);
        const isPhoneValid = phone.value.trim() === '' || validatePhoneFormat(phone.value);
        const isMessageValid = message.value.trim().length >= 10;
        const isConsentChecked = consent.checked;

        const isFormValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid && isConsentChecked;

        submitBtn.disabled = !isFormValid;
    }
}

// ============================================
// FIELD VALIDATORS
// ============================================

function validateFullName(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorMsg = document.getElementById('fullNameError');

    field.dataset.touched = 'true';

    if (value === '') {
        setFieldError(formGroup, errorMsg, 'Full name is required');
        return false;
    } else if (value.length < 2) {
        setFieldError(formGroup, errorMsg, 'Name must be at least 2 characters');
        return false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        setFieldError(formGroup, errorMsg, 'Name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
    } else {
        setFieldSuccess(formGroup, errorMsg);
        return true;
    }
}

function validateEmail(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorMsg = document.getElementById('emailError');

    field.dataset.touched = 'true';

    // Email is now optional
    if (value === '') {
        clearFieldState(formGroup, errorMsg);
        return true;
    } else if (!validateEmailFormat(value)) {
        setFieldError(formGroup, errorMsg, 'Please enter a valid email address');
        return false;
    } else {
        setFieldSuccess(formGroup, errorMsg);
        return true;
    }
}

function validatePhone(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorMsg = document.getElementById('phoneError');

    field.dataset.touched = 'true';

    // Phone is optional
    if (value === '') {
        clearFieldState(formGroup, errorMsg);
        return true;
    }

    if (!validatePhoneFormat(value)) {
        setFieldError(formGroup, errorMsg, 'Please enter a valid phone number (e.g., (555) 123-4567)');
        return false;
    } else {
        setFieldSuccess(formGroup, errorMsg);
        return true;
    }
}

function validateMessage(field) {
    const value = field.value.trim();
    const formGroup = field.closest('.form-group');
    const errorMsg = document.getElementById('messageError');

    field.dataset.touched = 'true';

    if (value === '') {
        setFieldError(formGroup, errorMsg, 'Message is required');
        return false;
    } else if (value.length < 10) {
        setFieldError(formGroup, errorMsg, 'Message must be at least 10 characters');
        return false;
    } else if (value.length > 800) {
        setFieldError(formGroup, errorMsg, 'Message cannot exceed 800 characters');
        return false;
    } else {
        setFieldSuccess(formGroup, errorMsg);
        return true;
    }
}

// ============================================
// VALIDATION HELPERS
// ============================================

function validateEmailFormat(email) {
    // RFC 5322 simplified regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhoneFormat(phone) {
    // Flexible phone validation - accepts various formats
    const phoneRegex = /^[\d\s\-\(\)\.+]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function setFieldError(formGroup, errorMsg, message) {
    formGroup.classList.remove('has-success');
    formGroup.classList.add('has-error');
    errorMsg.textContent = message;
    announceToScreenReader(message);
}

function setFieldSuccess(formGroup, errorMsg) {
    formGroup.classList.remove('has-error');
    formGroup.classList.add('has-success');
    errorMsg.textContent = '';
}

function clearFieldState(formGroup, errorMsg) {
    formGroup.classList.remove('has-error', 'has-success');
    errorMsg.textContent = '';
}

// ============================================
// FORM SUBMISSION (MOCK)
// ============================================

function handleFormSubmit() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulate processing delay
    setTimeout(() => {
        // Show success message
        successMessage.classList.add('show');
        announceToScreenReader('Thank you! Your message has been received. We will be in touch soon.');

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();

            // Clear all validation states
            const formGroups = form.querySelectorAll('.form-group');
            formGroups.forEach(group => {
                group.classList.remove('has-error', 'has-success');
            });

            // Clear touched states
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                delete input.dataset.touched;
            });

            // Reset character counter
            const charCounter = document.getElementById('messageCounter');
            if (charCounter) {
                charCounter.textContent = '0 / 800';
                charCounter.classList.remove('warning', 'error');
            }

            // Hide success message
            successMessage.classList.remove('show');

            // Reset submit button
            submitBtn.textContent = 'Submit Message';
            submitBtn.disabled = true;

            announceToScreenReader('Form has been reset');
        }, 3000);
    }, 1000);
}

// ============================================
// ACCESSIBILITY HELPERS
// ============================================

function announceToScreenReader(message) {
    // Create or get live region
    let liveRegion = document.getElementById('ariaLiveRegion');

    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'ariaLiveRegion';
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }

    // Clear and set message
    liveRegion.textContent = '';
    setTimeout(() => {
        liveRegion.textContent = message;
    }, 100);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
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

// Log form data to console (for demonstration only)
function logFormData() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        contactMethod: document.querySelector('input[name="contactMethod"]:checked')?.value,
        message: document.getElementById('message').value,
        consent: document.getElementById('consent').checked,
        timestamp: new Date().toISOString()
    };

    console.log('UI ONLY — No Backend');
    console.log('Form data (not submitted anywhere):', formData);
}
