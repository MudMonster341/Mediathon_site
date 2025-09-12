/**
 * Simple Image Gallery JavaScript
 * Single image display with navigation arrows
 */

class SimpleGallery {
    constructor() {
        this.currentIndex = 0;
        this.photos = [];
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Check authentication first
        if (!this.checkAuth()) return;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    checkAuth() {
        // Verify user has valid ticket from entry hall
        const hasTicket = sessionStore.get('ticket') === 'ok';
        if (!hasTicket) {
            console.log('No valid ticket found, redirecting to entry');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
    
    setup() {
        // Verify museum data is loaded
        if (!window.MUSEUM || !window.MUSEUM.rooms) {
            console.error('Museum data not loaded');
            return;
        }
        
        // Load only campus photos for gallery
        this.loadCampusPhotos();
        
        // Setup navigation
        this.setupNavigation();
        
        // Display first image
        this.displayCurrentImage();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        console.log(`Gallery initialized with ${this.photos.length} images`);
    }
    
    loadCampusPhotos() {
        const campusRoom = window.MUSEUM.getRoomById('campus');
        if (campusRoom && campusRoom.photos) {
            this.photos = campusRoom.photos;
        } else {
            console.error('Campus photos not found');
        }
    }
    
    setupNavigation() {
        const prevBtn = qs('#prevBtn');
        const nextBtn = qs('#nextBtn');
        
        if (prevBtn) {
            on(prevBtn, 'click', () => this.previousImage());
        }
        
        if (nextBtn) {
            on(nextBtn, 'click', () => this.nextImage());
        }
    }
    
    setupKeyboardNavigation() {
        on(document, 'keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextImage();
                    break;
                case 'Escape':
                    e.preventDefault();
                    // Could navigate back to entry or do nothing
                    break;
            }
        });
    }
    
    displayCurrentImage() {
        const photo = this.photos[this.currentIndex];
        if (!photo) return;
        
        const mainImage = qs('#mainImage');
        const imageQuote = qs('#imageQuote');
        
        if (!mainImage || !imageQuote) {
            console.error('Gallery elements not found');
            return;
        }
        
        // Add fade out animation
        this.isAnimating = true;
        
        // Fade out current content
        mainImage.style.opacity = '0';
        imageQuote.style.opacity = '0';
        
        setTimeout(() => {
            // Update image
            mainImage.src = photo.src;
            mainImage.alt = photo.alt || photo.title;
            
            // Update quote
            imageQuote.textContent = photo.quote;
            
            // Fade in new content
            setTimeout(() => {
                mainImage.style.opacity = '1';
                imageQuote.style.opacity = '1';
                
                // Reset quote animation
                imageQuote.style.animation = 'none';
                setTimeout(() => {
                    imageQuote.style.animation = 'quoteAppear 0.8s ease 0.3s forwards';
                }, 10);
                
                this.isAnimating = false;
            }, 50);
        }, 300);
        
        console.log(`Displaying image ${this.currentIndex + 1}/${this.photos.length}: ${photo.title}`);
    }
    
    previousImage() {
        if (this.isAnimating) return;
        
        this.currentIndex = this.currentIndex === 0 ? this.photos.length - 1 : this.currentIndex - 1;
        this.displayCurrentImage();
    }
    
    nextImage() {
        if (this.isAnimating) return;
        
        this.currentIndex = this.currentIndex === this.photos.length - 1 ? 0 : this.currentIndex + 1;
        this.displayCurrentImage();
    }
}

// Create global instance
window.simpleGallery = new SimpleGallery();
