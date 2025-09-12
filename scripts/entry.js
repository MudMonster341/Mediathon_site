/**
 * Entry Hall JavaScript
 * Handles password modal, validation, and navigation to gallery
 */

class EntryHall {
    constructor() {
        this.modal = null;
        this.passwordInput = null;
        this.errorMessage = null;
        this.form = null;
        this.isModalOpen = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Get DOM elements
        this.modal = qs('#ticket-modal');
        this.passwordInput = qs('#password-input');
        this.errorMessage = qs('#password-error');
        this.form = qs('.ticket-form');
        
        if (!this.modal || !this.passwordInput || !this.form) {
            console.error('Required DOM elements not found');
            return;
        }
        
        // Bind event listeners
        this.bindEvents();
        
        // Check if user should be redirected to gallery
        this.checkRedirect();
        
        console.log('Entry hall initialized');
    }
    
    bindEvents() {
        // Get ticket button
        const getTicketBtn = qs('.get-ticket-btn');
        if (getTicketBtn) {
            on(getTicketBtn, 'click', () => this.openModal());
        }
        
        // Modal close buttons
        const closeBtn = qs('.modal-close');
        const cancelBtn = qs('.cancel-btn');
        const overlay = qs('.modal-overlay');
        
        if (closeBtn) on(closeBtn, 'click', () => this.closeModal());
        if (cancelBtn) on(cancelBtn, 'click', () => this.closeModal());
        if (overlay) on(overlay, 'click', () => this.closeModal());
        
        // Form submission
        if (this.form) {
            on(this.form, 'submit', (e) => this.handleSubmit(e));
        }
        
        // Clear error on input
        if (this.passwordInput) {
            on(this.passwordInput, 'input', () => this.clearError());
        }
        
        // Keyboard events
        on(document, 'keydown', (e) => this.handleKeyDown(e));
    }
    
    checkRedirect() {
        // If user already has a valid ticket, redirect to rooms
        const hasTicket = sessionStore.get('ticket') === 'ok';
        if (hasTicket) {
            this.redirectToGallery();
        }
    }
    
    // Method to reset authentication (clears the ticket)
    resetAuthentication() {
        sessionStore.remove('ticket');
        console.log('Authentication reset - users will need to enter password again');
        
        // If currently on a protected page, redirect to index
        if (window.location.pathname !== '/index.html' && 
            window.location.pathname !== '/' && 
            !window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
    
    openModal() {
        if (!this.modal) return;
        
        this.modal.removeAttribute('hidden');
        this.isModalOpen = true;
        
        // Focus management
        setTimeout(() => {
            if (this.passwordInput) {
                this.passwordInput.focus();
            }
        }, 100);
        
        // Trap focus within modal
        this.trapFocus();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        console.log('Modal opened');
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.setAttribute('hidden', '');
        this.isModalOpen = false;
        
        // Clear form
        if (this.form) {
            this.form.reset();
        }
        this.clearError();
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Focus back to trigger button
        const getTicketBtn = qs('.get-ticket-btn');
        if (getTicketBtn) {
            getTicketBtn.focus();
        }
        
        console.log('Modal closed');
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.passwordInput) return;
        
        const password = this.passwordInput.value.trim();
        
        // Validate password (case-insensitive)
        if (password.toLowerCase() === 'mediathon') {
            this.handleSuccess();
        } else {
            this.handleError();
        }
    }
    
    handleSuccess() {
        console.log('Password correct');
        
        // Clear any errors
        this.clearError();
        
        // Store ticket in session
        sessionStore.set('ticket', 'ok');
        
        // Play door click sound
        const doorSound = playSound('assets/audio/door-click.mp3', 0.6);
        
        // Show success feedback
        this.showSuccess();
        
        // Navigate to rooms after sound
        setTimeout(() => {
            this.redirectToGallery();
        }, 350);
    }
    
    handleError() {
        console.log('Password incorrect');
        
        // Show error message
        this.showError('Invalid access code. Please try again.');
        
        // Add shake animation
        if (this.passwordInput) {
            this.passwordInput.classList.add('error');
            
            // Remove error class after animation
            setTimeout(() => {
                this.passwordInput.classList.remove('error');
            }, 500);
        }
        
        // Focus back to input
        setTimeout(() => {
            if (this.passwordInput) {
                this.passwordInput.select();
            }
        }, 100);
    }
    
    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.setAttribute('aria-live', 'polite');
        }
    }
    
    clearError() {
        if (this.errorMessage) {
            this.errorMessage.textContent = '';
        }
        
        if (this.passwordInput) {
            this.passwordInput.classList.remove('error');
        }
    }
    
    showSuccess() {
        if (this.passwordInput) {
            this.passwordInput.style.borderColor = '#10b981';
        }
        
        // Disable form
        const submitBtn = qs('.submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Opening...';
            submitBtn.disabled = true;
        }
    }
    
    redirectToGallery() {
        // Redirect to clean transition page instead of starting transition here
        this.closeModal(); // Close the modal first
        setTimeout(() => {
            window.location.href = 'transition.html';
        }, 300); // Small delay for modal close animation
    }
    
    handleKeyDown(e) {
        // Handle Escape key
        if (e.key === 'Escape' && this.isModalOpen) {
            this.closeModal();
        }
        
        // Handle Enter key on get ticket button
        if (e.key === 'Enter' && document.activeElement === qs('.get-ticket-btn')) {
            this.openModal();
        }
    }
    
    trapFocus() {
        if (!this.modal || !this.isModalOpen) return;
        
        // Get all focusable elements within modal
        const focusableElements = qsa(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            this.modal
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Handle tab key
        const handleTab = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };
        
        // Add event listener
        on(this.modal, 'keydown', handleTab);
        
        // Store reference to remove later
        this.modal._tabHandler = handleTab;
    }
}

// Initialize entry hall when script loads
const entryHall = new EntryHall();

// Export for potential testing/debugging
window.entryHall = entryHall;

// Global function to reset authentication
window.resetAuth = function() {
    sessionStore.remove('ticket');
    console.log('🔒 Authentication reset! Users will need to enter password again.');
    
    // If currently on a protected page, redirect to index
    if (window.location.pathname !== '/index.html' && 
        window.location.pathname !== '/' && 
        !window.location.pathname.endsWith('index.html')) {
        console.log('🔄 Redirecting to login page...');
        window.location.href = 'index.html';
    }
    
    return 'Authentication successfully reset!';
};
