(function () {
  'use strict';

  // --- Configuration ---
  const API_ENDPOINT = '/api/lead';
  const AUTO_OPEN_DELAY = 0; // Immediate open

  // --- State ---
  let isModalOpen = false;

  // --- DOM Elements (created dynamically to ensure they exist) ---
  function createLeadCaptureElements() {
    // 1. Create Modal HTML
    const modalHTML = `
            <div class="lc-modal-overlay" id="lcModalOverlay">
                <div class="lc-modal-container">
                    <button class="lc-close-button" id="lcCloseBtn" aria-label="Close modal">&times;</button>
                    
                    <div id="lcFormContent">
                        <div class="lc-modal-header">
                            <h2 class="lc-modal-title">Get Started Today</h2>
                            <p class="lc-modal-description">Join us to unlock exclusive benefits. Fill out the form below.</p>
                        </div>

                        <form id="lcLeadForm">
                            <div class="lc-form-group">
                                <label for="lcEmail" class="lc-label">Email Address <span style="color:red">*</span></label>
                                <input type="email" id="lcEmail" class="lc-input" placeholder="you@example.com" required>
                                <div class="lc-error-message" id="lcEmailError">Please enter a valid email address.</div>
                            </div>

                            <div class="lc-form-group">
                                <label for="lcPhone" class="lc-label">Phone Number <span style="color:red">*</span></label>
                                <div class="lc-phone-wrapper">
                                    <div class="lc-country-select" id="lcCountrySelect">
                                        <div class="lc-selected-country" id="lcSelectedCountry">
                                            <img src="https://flagcdn.com/w20/in.png" alt="India" class="lc-flag">
                                            <span>+91</span>
                                        </div>
                                        <div class="lc-country-dropdown" id="lcCountryDropdown">
                                            <div class="lc-country-option" data-code="+91" data-flag="in" data-name="India">
                                                <img src="https://flagcdn.com/w20/in.png" alt="India" class="lc-flag">
                                                <span>India (+91)</span>
                                            </div>
                                            <div class="lc-country-option" data-code="+1" data-flag="us" data-name="USA">
                                                <img src="https://flagcdn.com/w20/us.png" alt="USA" class="lc-flag">
                                                <span>USA (+1)</span>
                                            </div>
                                            <div class="lc-country-option" data-code="+44" data-flag="gb" data-name="UK">
                                                <img src="https://flagcdn.com/w20/gb.png" alt="UK" class="lc-flag">
                                                <span>UK (+44)</span>
                                            </div>
                                            <div class="lc-country-option" data-code="+61" data-flag="au" data-name="Australia">
                                                <img src="https://flagcdn.com/w20/au.png" alt="Australia" class="lc-flag">
                                                <span>Australia (+61)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="tel" id="lcPhone" class="lc-input lc-phone-input" placeholder="98765 43210" required>
                                </div>
                                <div class="lc-error-message" id="lcPhoneError">Please enter a valid phone number.</div>
                            </div>

                            <div class="lc-checkbox-wrapper">
                                <input type="checkbox" id="lcConsent" class="lc-checkbox" required>
                                <label for="lcConsent" class="lc-checkbox-label">
                                    I agree to the processing of my personal data as described in the Privacy Policy.
                                </label>
                            </div>

                            <button type="submit" class="lc-submit-btn" id="lcSubmitBtn">Submit</button>
                        </form>
                    </div>

                    <div id="lcSuccessMessage" class="lc-success-message">
                        <span class="lc-success-icon">🎉</span>
                        <h2 class="lc-modal-title">Success!</h2>
                        <p>Thank you for your interest. We will be in touch shortly.</p>
                        <button class="lc-submit-btn" id="lcSuccessCloseBtn" style="margin-top: 1rem;">Close</button>
                    </div>
                </div>
            </div>
        `;

    // 2. Create Floating CTA HTML
    const ctaHTML = `
            <button class="lc-floating-cta" id="lcFloatingCta">
                <span>💬</span> Get Started
            </button>
        `;

    // 3. Inject into DOM
    const body = document.body;
    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = modalHTML;
    body.appendChild(modalWrapper.firstElementChild);

    const ctaWrapper = document.createElement('div');
    ctaWrapper.innerHTML = ctaHTML;
    body.appendChild(ctaWrapper.firstElementChild);
  }

  // --- Logic ---

  function init() {
    createLeadCaptureElements();

    const modalOverlay = document.getElementById('lcModalOverlay');
    const closeBtn = document.getElementById('lcCloseBtn');
    const floatingCta = document.getElementById('lcFloatingCta');
    const form = document.getElementById('lcLeadForm');
    const emailInput = document.getElementById('lcEmail');
    const phoneInput = document.getElementById('lcPhone');
    const countrySelect = document.getElementById('lcCountrySelect');
    const selectedCountry = document.getElementById('lcSelectedCountry');
    const countryDropdown = document.getElementById('lcCountryDropdown');
    const consentCheckbox = document.getElementById('lcConsent');
    const successMessage = document.getElementById('lcSuccessMessage');
    const formContent = document.getElementById('lcFormContent');
    const successCloseBtn = document.getElementById('lcSuccessCloseBtn');

    // Country code state
    let currentCountryCode = '+91';

    // DEBUG: Force reset for testing so the modal always shows
    localStorage.removeItem('lcFormSubmitted');

    // Check if form was already submitted
    const formSubmitted = localStorage.getItem('lcFormSubmitted') === 'true';
    console.log('🔍 DEBUG: formSubmitted =', formSubmitted, '| localStorage value =', localStorage.getItem('lcFormSubmitted'));

    // Initialize: Ensure form is visible and success is hidden on page load
    formContent.style.display = 'block';
    successMessage.style.display = 'none';

    // Toggle country dropdown
    selectedCountry.addEventListener('click', (e) => {
      e.stopPropagation();
      countryDropdown.classList.toggle('lc-show');
    });

    // Select country option
    const countryOptions = countryDropdown.querySelectorAll('.lc-country-option');
    countryOptions.forEach(option => {
      option.addEventListener('click', () => {
        const code = option.getAttribute('data-code');
        const flag = option.getAttribute('data-flag');
        currentCountryCode = code;

        // Update selected display
        selectedCountry.innerHTML = `
          <img src="https://flagcdn.com/w20/${flag}.png" alt="${option.getAttribute('data-name')}" class="lc-flag">
          <span>${code}</span>
        `;

        countryDropdown.classList.remove('lc-show');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      countryDropdown.classList.remove('lc-show');
    });

    // If form not submitted, make it mandatory
    if (!formSubmitted) {
      // Hide close button - user cannot close until submission
      closeBtn.style.display = 'none';

      // Hide floating CTA button - not needed since modal is always open
      floatingCta.style.display = 'none';
    }

    // Open Modal
    function openModal() {
      if (isModalOpen) return;
      modalOverlay.classList.add('lc-visible');
      isModalOpen = true;
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close Modal and Reset to Form View
    function closeModal() {
      if (!isModalOpen) return;

      // Only allow closing if form was submitted
      const canClose = localStorage.getItem('lcFormSubmitted') === 'true';
      if (!canClose) {
        return; // Prevent closing if form not submitted
      }

      modalOverlay.classList.remove('lc-visible');
      isModalOpen = false;
      document.body.style.overflow = ''; // Restore scrolling

      // Reset to form view when closing
      formContent.style.display = 'block';
      successMessage.style.display = 'none';
      form.reset();
    }

    // Event Listeners
    floatingCta.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    successCloseBtn.addEventListener('click', closeModal);

    // Close on click outside - only if form was submitted
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        const canClose = localStorage.getItem('lcFormSubmitted') === 'true';
        if (canClose) {
          closeModal();
        }
      }
    });

    // Auto-open on load - immediate if form not submitted
    if (!formSubmitted) {
      console.log('✅ Opening modal automatically (Mandatory Update)!');
      openModal(); // Force open immediately

      // Also ensure scrolling is disabled even before modal animation starts
      document.body.style.overflow = 'hidden';
    } else {
      // If submitted, check if we want to auto-open after delay (optional, e.g. for return visitors?)
      // For now, do nothing.
      console.log('❌ Form already submitted, not opening modal.');
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic Validation
      let isValid = true;

      // Email
      if (!emailInput.value || !emailInput.value.includes('@')) {
        document.getElementById('lcEmailError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('lcEmailError').style.display = 'none';
      }

      // Phone - validate 10 digits for India
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (!phoneDigits || phoneDigits.length < 10) {
        document.getElementById('lcPhoneError').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('lcPhoneError').style.display = 'none';
      }

      // Consent
      if (!consentCheckbox.checked) {
        alert('You must agree to the terms to proceed.');
        isValid = false;
      }

      if (!isValid) return;

      // Prepare Data
      const payload = {
        email: emailInput.value,
        phone: currentCountryCode + ' ' + phoneInput.value,
        pageUrl: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      const submitBtn = document.getElementById('lcSubmitBtn');
      const originalBtnText = submitBtn.innerText;
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending...';

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // Success - save to localStorage and enable closing
          localStorage.setItem('lcFormSubmitted', 'true');

          // ✨ Send confirmation email to visitor using EmailJS
          if (typeof emailjs !== 'undefined') {
            emailjs.send(
              'service_rrly1n5',          // Your Service ID
              'template_i1qhg3h',         // Your Template ID
              {
                user_name: emailInput.value.split('@')[0],  // User's name
                email: emailInput.value,                     // CRITICAL: Template uses {{email}} in To Email field
                message: 'Phone: ' + currentCountryCode + ' ' + phoneInput.value  // Phone info
              }
            ).then(
              function (response) {
                console.log('✅ Confirmation email sent!', response);
              },
              function (error) {
                console.error('❌ Email failed:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                // Form still shows success even if email fails
              }
            );
          }

          // Show close button now that form is submitted
          closeBtn.style.display = 'block';
          successCloseBtn.style.display = 'block';

          // Show success message
          formContent.style.display = 'none';
          successMessage.style.display = 'block';
          form.reset();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Submission failed');
        }
      } catch (error) {
        console.error('Lead capture error:', error);
        alert(error.message || 'There was an error submitting your information. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
