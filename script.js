// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const exploreBtn = document.getElementById('exploreBtn');
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');

// Utility Functions
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
};

// Navigation Functions
const handleNavigation = (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update active nav link
        navLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Close mobile menu if open
        navLinksContainer.classList.remove('active');
    }
};

const toggleMobileMenu = () => {
    navLinksContainer.classList.toggle('active');
    menuToggle.classList.toggle('active');
};

// Form Validation Functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
        errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters long';
    }
    
    return errors;
};

const showFieldError = (field, message) => {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('span');
    
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorElement);
    }
    
    field.classList.add('error');
};

const clearFieldError = (field) => {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error');
    field.classList.add('success');
};

const clearAllErrors = () => {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.error, .success').forEach(field => {
        field.classList.remove('error', 'success');
    });
};

// Form Submission Handler
const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate form
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            showFieldError(field, errors[fieldName]);
        });
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        contactForm.style.display = 'none';
        formResponse.style.display = 'block';
        formResponse.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
};

// Real-time Validation
const handleRealTimeValidation = (e) => {
    const field = e.target;
    const fieldName = field.name;
    const value = field.value.trim();
    
    let error = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) error = 'Name is required';
            break;
        case 'email':
            if (!value) {
                error = 'Email is required';
            } else if (!validateEmail(value)) {
                error = 'Please enter a valid email address';
            }
            break;
        case 'message':
            if (!value) {
                error = 'Message is required';
            } else if (value.length < 10) {
                error = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    if (error) {
        showFieldError(field, error);
    } else {
        clearFieldError(field);
    }
};

// Smooth Scrolling for Explore Button
const handleExploreClick = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
};

// Scroll Spy for Navigation
const handleScrollSpy = debounce(() => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, 100);

// Theme Toggle (Bonus Feature)
const createThemeToggle = () => {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: var(--shadow);
        transition: var(--transition);
        z-index: 1000;
    `;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    document.body.appendChild(themeToggle);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
    }
};

// Performance Optimization
const handleImageLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    navLinks.forEach(link => link.addEventListener('click', handleNavigation));
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Form handling
    contactForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('name').addEventListener('blur', handleRealTimeValidation);
    document.getElementById('email').addEventListener('blur', handleRealTimeValidation);
    document.getElementById('message').addEventListener('blur', handleRealTimeValidation);
    
    // Explore button
    exploreBtn.addEventListener('click', handleExploreClick);
    
    // Scroll events
    window.addEventListener('scroll', handleScrollSpy);
    
    // Initialize features
    animateOnScroll();
    createThemeToggle();
    handleImageLazyLoading();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinksContainer.classList.remove('active');
        }
    });
});

// Dark Theme Styles (injected via JavaScript)
const darkThemeStyles = `
    .dark-theme {
        --primary-color: #3b82f6;
        --secondary-color: #94a3b8;
        --text-primary: #f1f5f9;
        --text-secondary: #cbd5e1;
        --background: #0f172a;
        --surface: #1e293b;
        --border: #334155;
    }
    
    .dark-theme .feature-card,
    .dark-theme .feature-item {
        background: var(--surface);
        border-color: var(--border);
    }
    
    .dark-theme .form-group input,
    .dark-theme .form-group textarea {
        background: var(--surface);
        border-color: var(--border);
        color: var(--text-primary);
    }
`;

// Inject dark theme styles
const styleSheet = document.createElement('style');
styleSheet.textContent = darkThemeStyles;
document.head.appendChild(styleSheet);

// Export for testing (if needed)
window.WebApp = {
    validateEmail,
    validateForm,
    debounce,
    handleFormSubmit
};