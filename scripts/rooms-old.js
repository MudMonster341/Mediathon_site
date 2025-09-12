/**
 * Carousel Gallery JavaScript
 * Handles 3D carousel navigation and detail modal view
 */

class CarouselGallery {
    constructor() {
        this.currentIndex = 0;
        this.photos = [];
        this.isAnimating = false;
        this.isMuted = false;
        
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
        
        // Load only campus photos for carousel
        this.loadCampusPhotos();
        
        // Initialize mute state
        this.isMuted = storage.get('gallery-muted', false);
        this.updateMuteUI();
        
        // Bind events
        this.bindEvents();
        
        // Render carousel
        this.renderCarousel();
        
        // Initialize carousel positioning
        this.updateCarouselPositions();
        
        console.log('Carousel gallery initialized successfully');
    }
    
    loadCampusPhotos() {
        // Get only campus room photos for the carousel
        const campusRoom = window.MUSEUM.rooms.find(room => room.id === 'campus');
        if (campusRoom) {
            this.photos = campusRoom.photos;
        } else {
            console.error('Campus room not found');
            this.photos = [];
        }
        
        console.log(`Loaded ${this.photos.length} campus photos for carousel`);
    }
    
    bindEvents() {
        // Navigation buttons
        const prevBtn = qs('#prevBtn');
        const nextBtn = qs('#nextBtn');
        
        if (prevBtn) on(prevBtn, 'click', () => this.previousImage());
        if (nextBtn) on(nextBtn, 'click', () => this.nextImage());
        
        // Mute toggle
        const muteToggle = qs('#mute-toggle');
        if (muteToggle) on(muteToggle, 'click', () => this.toggleMute());
        
        // Detail modal close
        const detailClose = qs('#detailClose');
        if (detailClose) on(detailClose, 'click', () => this.closeDetailModal());
        
        // Keyboard navigation
        on(document, 'keydown', (e) => this.handleKeyboard(e));
        
        // Close modal on background click
        const detailModal = qs('#detail-modal');
        if (detailModal) {
            on(detailModal, 'click', (e) => {
                if (e.target === detailModal) {
                    this.closeDetailModal();
                }
            });
        }
    }
    
    renderCarousel() {
        const track = qs('#carouselTrack');
        
        if (!track) {
            console.error('Carousel track not found');
            return;
        }
        
        // Clear existing content
        track.innerHTML = '';
        
        // Create carousel items
        this.photos.forEach((photo, index) => {
            // Create carousel item
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.dataset.index = index;
            
            // Add aspect ratio class
            if (photo.aspectRatio) {
                item.classList.add(photo.aspectRatio);
            }
            
            // Create ornate frame container
            const frame = document.createElement('div');
            frame.className = 'ornate-frame';
            
            // Create image
            const img = document.createElement('img');
            img.className = 'carousel-image';
            img.src = photo.src;
            img.alt = photo.alt || photo.title;
            img.loading = 'lazy';
            
            frame.appendChild(img);
            item.appendChild(frame);
            track.appendChild(item);
            
            // Add click handler for detail view
            on(item, 'click', () => this.openDetailModal(index));
        });
        
        // Set initial active states
        this.updateActiveStates();
    }
    
    updateCarouselPositions() {
        const items = qsa('.carousel-item');
        const totalItems = items.length;
        
        items.forEach((item, index) => {
            item.classList.remove('active', 'prev', 'next');
            
            // Calculate relative position from current index
            let relativePos = index - this.currentIndex;
            if (relativePos < -Math.floor(totalItems / 2)) {
                relativePos += totalItems;
            } else if (relativePos > Math.floor(totalItems / 2)) {
                relativePos -= totalItems;
            }
            
            if (relativePos === 0) {
                // Active/center item
                item.classList.add('active');
                item.style.transform = 'translate(-50%, -50%) scale(1) rotateY(0deg)';
                item.style.zIndex = '10';
            } else if (relativePos === -1) {
                // Previous item (left)
                item.classList.add('prev');
                item.style.transform = 'translate(-200%, -50%) scale(0.75) rotateY(30deg)';
                item.style.zIndex = '5';
            } else if (relativePos === 1) {
                // Next item (right)
                item.classList.add('next');
                item.style.transform = 'translate(100%, -50%) scale(0.75) rotateY(-30deg)';
                item.style.zIndex = '5';
            } else {
                // Hidden items
                const angle = relativePos > 0 ? 60 : -60;
                const xOffset = relativePos > 0 ? 300 : -300;
                item.style.transform = `translate(${xOffset}%, -50%) scale(0.5) rotateY(${angle}deg)`;
                item.style.zIndex = '1';
            }
        });
    }
    
    updateActiveStates() {
        this.updateCarouselPositions();
    }
    
    getPrevIndex() {
        return this.currentIndex === 0 ? this.photos.length - 1 : this.currentIndex - 1;
    }
    
    getNextIndex() {
        return this.currentIndex === this.photos.length - 1 ? 0 : this.currentIndex + 1;
    }
    
    previousImage() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = this.getPrevIndex();
        this.updateCarouselPositions();
        
        // Play navigation sound
        if (!this.isMuted) {
            playSound('assets/audio/navigation.mp3', 0.3).catch(() => {});
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    nextImage() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = this.getNextIndex();
        this.updateCarouselPositions();
        
        // Play navigation sound
        if (!this.isMuted) {
            playSound('assets/audio/navigation.mp3', 0.3).catch(() => {});
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    goToImage(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        this.updateCarouselPositions();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    openDetailModal(index) {
        const photo = this.photos[index];
        if (!photo) return;
        
        const modal = qs('#detail-modal');
        const detailImage = qs('#detailImage');
        const detailQuote = qs('#detailQuote');
        
        if (!modal || !detailImage) {
            console.error('Detail modal elements not found');
            return;
        }
        
        // Populate modal content
        detailImage.src = photo.src;
        detailImage.alt = photo.alt || photo.title;
        
        if (detailQuote) detailQuote.textContent = photo.quote;
        
        // Show modal
        modal.removeAttribute('hidden');
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Play selection sound
        if (!this.isMuted) {
            playSound('assets/audio/selection.mp3', 0.4).catch(() => {});
        }
    }
    
    closeDetailModal() {
        const modal = qs('#detail-modal');
        if (!modal) return;
        
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }, 400);
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        storage.set('gallery-muted', this.isMuted);
        this.updateMuteUI();
        
        console.log(`Audio ${this.isMuted ? 'muted' : 'unmuted'}`);
    }
    
    updateMuteUI() {
        const muteToggle = qs('#mute-toggle');
        if (muteToggle) {
            muteToggle.classList.toggle('muted', this.isMuted);
            muteToggle.setAttribute('aria-label', 
                this.isMuted ? 'Unmute audio' : 'Mute audio'
            );
        }
    }
    
    handleKeyboard(e) {
        // Ignore if user is interacting with form elements
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Check if detail modal is open
        const modalOpen = qs('#detail-modal')?.classList.contains('active');
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (!modalOpen) this.previousImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (!modalOpen) this.nextImage();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!modalOpen) {
                    this.openDetailModal(this.currentIndex);
                }
                break;
            case 'Escape':
                e.preventDefault();
                if (modalOpen) {
                    this.closeDetailModal();
                }
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleMute();
                break;
        }
    }
    
    // Auto-play functionality (optional)
    startAutoPlay(interval = 5000) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            if (!this.isAnimating && !qs('#detail-modal')?.classList.contains('active')) {
                this.nextImage();
            }
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize carousel gallery when script loads
const carouselGallery = new CarouselGallery();

// Export for debugging/testing
window.carouselGallery = carouselGallery;
