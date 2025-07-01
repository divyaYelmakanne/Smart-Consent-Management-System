// Cookie Consent Management
class CookieConsent {
    constructor() {
        this.consent = {
            essential: true,
            analytics: false,
            marketing: false,
            performance: false,
            targeting: false,
            functional: false
        };
        this.init();
    }

    init() {
        this.loadConsent();
        this.setupEventListeners();
        this.updateUI();
    }

    loadConsent() {
        const savedConsent = localStorage.getItem('cookieConsent');
        if (savedConsent) {
            this.consent = { ...this.consent, ...JSON.parse(savedConsent) };
        }
    }

    saveConsent() {
        localStorage.setItem('cookieConsent', JSON.stringify(this.consent));
        this.sendConsentToBackend();
    }

    sendConsentToBackend() {
        fetch('http://localhost:3000/api/consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                consent: this.consent,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Consent saved:', data);
        })
        .catch(error => {
            console.error('Error saving consent:', error);
        });
    }

    setupEventListeners() {
        // Demo widget toggles
        const analyticsToggle = document.getElementById('analytics-toggle');
        const marketingToggle = document.getElementById('marketing-toggle');
        
        if (analyticsToggle) {
            analyticsToggle.addEventListener('change', (e) => {
                this.consent.analytics = e.target.checked;
                this.updateUI();
            });
        }
        
        if (marketingToggle) {
            marketingToggle.addEventListener('change', (e) => {
                this.consent.marketing = e.target.checked;
                this.updateUI();
            });
        }

        // Modal toggles
        const analyticsModalToggle = document.getElementById('analytics-modal-toggle');
        const marketingModalToggle = document.getElementById('marketing-modal-toggle');
        
        if (analyticsModalToggle) {
            analyticsModalToggle.addEventListener('change', (e) => {
                this.consent.analytics = e.target.checked;
                this.updateUI();
            });
        }
        
        if (marketingModalToggle) {
            marketingModalToggle.addEventListener('change', (e) => {
                this.consent.marketing = e.target.checked;
                this.updateUI();
            });
        }

        // Accept all button
        const acceptAllBtn = document.querySelector('.btn-accept-all');
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', () => {
                this.acceptAll();
            });
        }

        // Save preferences button
        const savePrefsBtn = document.querySelector('.btn-save-preferences');
        if (savePrefsBtn) {
            savePrefsBtn.addEventListener('click', () => {
                this.savePreferences();
            });
        }

        // Create Anonymous ID button
        const createAnonIdBtn = document.getElementById('create-anon-id-btn');
        if (createAnonIdBtn) {
            createAnonIdBtn.addEventListener('click', () => {
                const anonId = 'anon_' + Math.random().toString(36).substring(2, 12);
                document.getElementById('anon-id-display').textContent = anonId;
                this.openAnonIdModal();
            });
        }

        // Cookie toggles for new types
        const perfToggle = document.getElementById('performance-toggle');
        const perfModalToggle = document.getElementById('performance-modal-toggle');
        const targetingToggle = document.getElementById('targeting-toggle');
        const targetingModalToggle = document.getElementById('targeting-modal-toggle');
        const functionalToggle = document.getElementById('functional-toggle');
        const functionalModalToggle = document.getElementById('functional-modal-toggle');
        // Widget toggles
        if (perfToggle) perfToggle.addEventListener('change', e => { this.consent.performance = e.target.checked; this.updateUI(); });
        if (targetingToggle) targetingToggle.addEventListener('change', e => { this.consent.targeting = e.target.checked; this.updateUI(); });
        if (functionalToggle) functionalToggle.addEventListener('change', e => { this.consent.functional = e.target.checked; this.updateUI(); });
        // Modal toggles
        if (perfModalToggle) perfModalToggle.addEventListener('change', e => { this.consent.performance = e.target.checked; this.updateUI(); });
        if (targetingModalToggle) targetingModalToggle.addEventListener('change', e => { this.consent.targeting = e.target.checked; this.updateUI(); });
        if (functionalModalToggle) functionalModalToggle.addEventListener('change', e => { this.consent.functional = e.target.checked; this.updateUI(); });
    }

    updateUI() {
        // Update demo widget
        const analyticsToggle = document.getElementById('analytics-toggle');
        const marketingToggle = document.getElementById('marketing-toggle');
        
        if (analyticsToggle) {
            analyticsToggle.checked = this.consent.analytics;
        }
        
        if (marketingToggle) {
            marketingToggle.checked = this.consent.marketing;
        }

        // Update modal
        const analyticsModalToggle = document.getElementById('analytics-modal-toggle');
        const marketingModalToggle = document.getElementById('marketing-modal-toggle');
        
        if (analyticsModalToggle) {
            analyticsModalToggle.checked = this.consent.analytics;
        }
        
        if (marketingModalToggle) {
            marketingModalToggle.checked = this.consent.marketing;
        }

        // Widget
        const perfToggle = document.getElementById('performance-toggle');
        const targetingToggle = document.getElementById('targeting-toggle');
        const functionalToggle = document.getElementById('functional-toggle');
        if (perfToggle) perfToggle.checked = this.consent.performance;
        if (targetingToggle) targetingToggle.checked = this.consent.targeting;
        if (functionalToggle) functionalToggle.checked = this.consent.functional;
        // Modal
        const perfModalToggle = document.getElementById('performance-modal-toggle');
        const targetingModalToggle = document.getElementById('targeting-modal-toggle');
        const functionalModalToggle = document.getElementById('functional-modal-toggle');
        if (perfModalToggle) perfModalToggle.checked = this.consent.performance;
        if (targetingModalToggle) targetingModalToggle.checked = this.consent.targeting;
        if (functionalModalToggle) functionalModalToggle.checked = this.consent.functional;
    }

    acceptAll() {
        this.consent.analytics = true;
        this.consent.marketing = true;
        this.consent.performance = true;
        this.consent.targeting = true;
        this.consent.functional = true;
        this.updateUI();
        this.saveConsent();
        this.hideBanner();
        this.showSuccessMessage('All cookies accepted!');
    }

    savePreferences() {
        this.saveConsent();
        this.hideBanner();
        this.closePreferencesModal();
        this.showSuccessMessage('Preferences saved successfully!');
    }

    showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('hidden');
            setTimeout(() => {
                banner.classList.add('show');
            }, 100);
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.classList.add('hidden');
            }, 300);
        }
    }

    showPreferencesModal() {
        const modal = document.getElementById('preferences-modal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.add('show');
            }, 100);
        }
    }

    closePreferencesModal() {
        const modal = document.getElementById('preferences-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    }

    resetConsent() {
        localStorage.removeItem('cookieConsent');
        this.consent = {
            essential: true,
            analytics: false,
            marketing: false,
            performance: false,
            targeting: false,
            functional: false
        };
        this.updateUI();
        this.showSuccessMessage('Consent reset successfully!');
    }

    showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    openAnonIdModal() {
        const modal = document.getElementById('anon-id-modal');
        if (modal) {
            // Generate a random thick color background
            const colors = [
                'linear-gradient(135deg, #2563eb 60%, #1e293b 100%)',
                'linear-gradient(135deg, #10b981 60%, #2563eb 100%)',
                'linear-gradient(135deg, #f59e42 60%, #2563eb 100%)',
                'linear-gradient(135deg, #f43f5e 60%, #2563eb 100%)',
                'linear-gradient(135deg, #a21caf 60%, #2563eb 100%)',
                'linear-gradient(135deg, #fbbf24 60%, #2563eb 100%)',
                'linear-gradient(135deg, #0ea5e9 60%, #2563eb 100%)',
                'linear-gradient(135deg, #22d3ee 60%, #2563eb 100%)',
                'linear-gradient(135deg, #f472b6 60%, #2563eb 100%)',
                'linear-gradient(135deg, #facc15 60%, #2563eb 100%)'
            ];
            const bg = colors[Math.floor(Math.random() * colors.length)];
            modal.querySelector('.anon-id-modal-content').style.background = bg;
            modal.classList.remove('hidden');
            setTimeout(() => { modal.classList.add('show'); }, 100);
        }
    }

    closeAnonIdModal() {
        const modal = document.getElementById('anon-id-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => { modal.classList.add('hidden'); }, 300);
        }
    }
}

// Demo Functions
function showConsentBanner() {
    cookieConsent.showBanner();
}

function showPreferencesModal() {
    cookieConsent.showPreferencesModal();
}

function closePreferencesModal() {
    cookieConsent.closePreferencesModal();
}

function acceptAllCookies() {
    cookieConsent.acceptAll();
}

function savePreferences() {
    cookieConsent.savePreferences();
}

function resetConsent() {
    cookieConsent.resetConsent();
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cookie consent
    window.cookieConsent = new CookieConsent();
    
    // Smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('preferences-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePreferencesModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePreferencesModal();
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Show banner after 2 seconds if no consent is saved
    setTimeout(() => {
        if (!localStorage.getItem('cookieConsent')) {
            showConsentBanner();
        }
    }, 2000);

    // Login Modal Functionality
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    // Responsive Get Started button scrolls to demo section
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            const demoSection = document.querySelector('.demo-section');
            if (demoSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = demoSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    // Close login modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLoginModal();
        }
    });
    // Close login modal when clicking outside
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLoginModal();
            }
        });
    }

    // Try Demo button scrolls to demo section
    const tryDemoBtn = document.getElementById('try-demo-btn');
    if (tryDemoBtn) {
        tryDemoBtn.addEventListener('click', function() {
            const demoSection = document.querySelector('.demo-section');
            if (demoSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = demoSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    // View Documentation button scrolls to features section (or replace with docs link)
    const viewDocsBtn = document.getElementById('view-docs-btn');
    if (viewDocsBtn) {
        viewDocsBtn.addEventListener('click', function() {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = featuresSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    // Pricing and Contact nav links scroll to their sections
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = section.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Pricing modal logic
    document.getElementById('pricing-get-started-btn').onclick = function() {
        openPricingModal('get-started');
    };
    document.getElementById('pricing-free-trial-btn').onclick = function() {
        openPricingModal('free-trial');
    };
    document.getElementById('pricing-contact-sales-btn').onclick = function() {
        openPricingModal('contact-sales');
    };
    // Close modal on Escape or outside click
    ['get-started','free-trial','contact-sales'].forEach(function(type) {
        const modal = document.getElementById('pricing-modal-' + type.replace('-', '-'));
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) closePricingModal(type);
            });
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            ['get-started','free-trial','contact-sales'].forEach(closePricingModal);
        }
    });

    // Fix close button for anonymous ID modal
    const anonIdCloseBtn = document.querySelector('#anon-id-modal .modal-close');
    if (anonIdCloseBtn) {
        anonIdCloseBtn.addEventListener('click', closeAnonIdModal);
    }
});

// Analytics simulation
function simulateAnalytics() {
    if (cookieConsent.consent.analytics) {
        console.log('Analytics tracking enabled');
        // Simulate analytics tracking
        const event = {
            type: 'page_view',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Send to backend
        fetch('http://localhost:3000/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Analytics event sent:', data);
        })
        .catch(error => {
            console.error('Error sending analytics:', error);
        });
    }
}

// Marketing simulation
function simulateMarketing() {
    if (cookieConsent.consent.marketing) {
        console.log('Marketing tracking enabled');
        // Simulate marketing tracking
        const event = {
            type: 'marketing_event',
            timestamp: new Date().toISOString(),
            action: 'demo_interaction',
            userAgent: navigator.userAgent
        };
        
        // Send to backend
        fetch('http://localhost:3000/api/marketing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Marketing event sent:', data);
        })
        .catch(error => {
            console.error('Error sending marketing event:', error);
        });
    }
}

// Track page interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-demo, .btn-primary, .btn-secondary')) {
        simulateAnalytics();
        simulateMarketing();
    }
});

// Login Modal Functionality
function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

function submitLogin(event) {
    event.preventDefault();
    const anonymous = document.getElementById('anonymous-login-checkbox').checked;
    let email = document.getElementById('login-email').value;
    if (anonymous) {
        // Generate a random anonymous ID
        email = 'anon_' + Math.random().toString(36).substring(2, 10) + '@anon.com';
    }
    closeLoginModal();
    window.cookieConsent.showSuccessMessage('Logged in as ' + email);
}

function openPricingModal(type) {
    const modal = document.getElementById('pricing-modal-' + type.replace('-', '-'));
    if (modal) {
        modal.classList.add('show');
    }
}

function closePricingModal(type) {
    const modal = document.getElementById('pricing-modal-' + type.replace('-', '-'));
    if (modal) {
        modal.classList.remove('show');
    }
} 