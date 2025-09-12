/**
 * Image Grid Gallery with Modal Display
 * Click-based image selection with sophisticated modal
 */

class GridGallery {
    constructor() {
        this.photos = [];
        this.modal = null;
        this.modalImage = null;
        this.modalQuote = null;
        this.isModalOpen = false;
        
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
        
        // Setup DOM elements
        this.setupModal();
        
        // Generate image grid
        this.generateImageGrid();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log(`Grid gallery initialized with ${this.photos.length} images`);
    }
    
    loadCampusPhotos() {
        const campusRoom = window.MUSEUM.getRoomById('campus');
        if (campusRoom && campusRoom.photos) {
            this.photos = campusRoom.photos;
        } else {
            console.error('Campus photos not found');
        }
    }
    
    setupModal() {
        this.modal = qs('#imageModal');
        this.modalImage = qs('#modalImage');
        this.modalQuote = qs('#modalQuote');
        
        if (!this.modal || !this.modalImage || !this.modalQuote) {
            console.error('Modal elements not found');
        }
    }
    
    generateImageGrid() {
        const grid = qs('#imageGrid');
        if (!grid) {
            console.error('Image grid container not found');
            return;
        }
        
        // Clear existing content
        grid.innerHTML = '';
        
        // Generate grid items
        this.photos.forEach((photo, index) => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.dataset.index = index;
            
            // Create preview text (first 80 characters of quote)
            const previewText = photo.quote ? 
                (photo.quote.length > 80 ? photo.quote.substring(0, 80) + '...' : photo.quote) :
                'Click to view this image';
            
            card.innerHTML = `
                <img src="${photo.src}" alt="${photo.alt || photo.title}" loading="lazy">
                <div class="image-card-overlay">
                    <h3 class="image-card-title">${photo.title}</h3>
                    <p class="image-card-preview">${previewText}</p>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        console.log(`Generated ${this.photos.length} image cards`);
    }
    
    setupEventListeners() {
        // Image card click events
        on(document, 'click', (e) => {
            const card = e.target.closest('.image-card');
            if (card) {
                const index = parseInt(card.dataset.index);
                this.openModal(index);
            }
        });
        
        // Modal close events
        const closeBtn = qs('.modal-close');
        const overlay = qs('.modal-overlay');
        
        if (closeBtn) {
            on(closeBtn, 'click', () => this.closeModal());
        }
        
        if (overlay) {
            on(overlay, 'click', () => this.closeModal());
        }
        
        // Keyboard events
        on(document, 'keydown', (e) => this.handleKeyDown(e));
    }
    
    openModal(index) {
        const photo = this.photos[index];
        if (!photo || !this.modal || !this.modalImage || !this.modalQuote) return;
        
        // Update modal content
        this.modalImage.src = photo.src;
        this.modalImage.alt = photo.alt || photo.title;
        this.modalQuote.textContent = photo.quote || '';
        
        // Show modal
        this.modal.removeAttribute('hidden');
        this.isModalOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            const closeBtn = qs('.modal-close');
            if (closeBtn) closeBtn.focus();
        }, 100);
        
        console.log(`Opened modal for image: ${photo.title}`);
    }
    
    closeModal() {
        if (!this.modal) return;
        
        this.modal.setAttribute('hidden', '');
        this.isModalOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('Modal closed');
    }
    
    handleKeyDown(e) {
        if (!this.isModalOpen) return;
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                this.closeModal();
                break;
        }
    }
}

// Create global instance
window.gridGallery = new GridGallery();
