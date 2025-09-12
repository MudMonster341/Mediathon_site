/**
 * Gallery JavaScript
 * Main gallery functionality including room navigation, photo display, and interactions
 */

class Gallery {
    constructor() {
        // State
        this.currentRoomIndex = 0;
        this.currentPhotoIndex = 0;
        this.rooms = [];
        this.isTransitioning = false;
        this.isMuted = false;
        this.clapCounts = {}; // Photo clap counts (reset per session)
        this.preloadedImages = new Map();
        
        // DOM elements
        this.elements = {};
        
        // Audio
        this.applauseAudio = null;
        
        this.init();
    }
    
    init() {
        // Check authentication
        if (!this.checkAuth()) return;
        
        // Wait for DOM and data to be ready
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
        
        // Load museum data
        this.rooms = window.MUSEUM.rooms;
        
        // Get DOM elements
        this.getElements();
        
        if (!this.validateElements()) {
            console.error('Required DOM elements not found');
            return;
        }
        
        // Initialize state
        this.initializeState();
        
        // Setup UI
        this.setupRoomSelector();
        this.setupAudio();
        
        // Bind events
        this.bindEvents();
        
        // Load initial room
        this.loadRoom(this.currentRoomIndex, 0);
        
        console.log('Gallery initialized successfully');
    }
    
    getElements() {
        this.elements = {
            roomSelect: qs('#room-select'),
            exhibitTitle: qs('#exhibit-title'),
            muteToggle: qs('#mute-toggle'),
            photoTitle: qs('#photo-title'),
            photoFrame: qs('#photo-frame'),
            photoImage: qs('#photo-image'),
            photoQuote: qs('#photo-quote .quote-text'),
            photoCredit: qs('#photo-credit'),
            clapBtn: qs('#clap-btn'),
            clapCount: qs('#clap-count'),
            prevArrow: qs('.nav-arrow--prev'),
            nextArrow: qs('.nav-arrow--next'),
            currentPhoto: qs('#current-photo'),
            totalPhotos: qs('#total-photos'),
            photoDisplay: qs('.photo-display')
        };
    }
    
    validateElements() {
        const required = [
            'roomSelect', 'exhibitTitle', 'photoTitle', 'photoFrame', 
            'photoImage', 'photoQuote', 'clapBtn', 'prevArrow', 'nextArrow'
        ];
        
        for (const key of required) {
            if (!this.elements[key]) {
                console.error(`Required element not found: ${key}`);
                return false;
            }
        }
        return true;
    }
    
    initializeState() {
        // Get initial room from URL or default
        const urlRoomId = getUrlParam('room') || window.MUSEUM.defaultRoomId;
        const roomIndex = this.rooms.findIndex(room => room.id === urlRoomId);
        
        this.currentRoomIndex = roomIndex >= 0 ? roomIndex : 0;
        
        // Get photo index from URL parameter 'i' (1-based) or default to 0
        const photoParam = getUrlParam('i');
        this.currentPhotoIndex = photoParam ? parseInt(photoParam) - 1 : 0;
        
        // Ensure photo index is valid
        const currentRoom = this.rooms[this.currentRoomIndex];
        if (currentRoom && (this.currentPhotoIndex < 0 || this.currentPhotoIndex >= currentRoom.photos.length)) {
            this.currentPhotoIndex = 0;
        }
        
        // Load mute state
        this.isMuted = storage.get('gallery-muted', false);
        this.updateMuteUI();
    }
    
    setupRoomSelector() {
        if (!this.elements.roomSelect) return;
        
        // Clear existing options
        this.elements.roomSelect.innerHTML = '';
        
        // Add room options
        this.rooms.forEach((room, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = room.name;
            this.elements.roomSelect.appendChild(option);
        });
        
        // Set current selection
        this.elements.roomSelect.value = this.currentRoomIndex;
    }
    
    setupAudio() {
        // Preload applause audio
        try {
            this.applauseAudio = new Audio('assets/audio/clap.mp3');
            this.applauseAudio.loop = true;
            this.applauseAudio.volume = 0.4;
            this.applauseAudio.preload = 'auto';
        } catch (error) {
            console.warn('Failed to setup applause audio:', error);
        }
    }
    
    bindEvents() {
        // Room selector
        if (this.elements.roomSelect) {
            on(this.elements.roomSelect, 'change', (e) => {
                const roomIndex = parseInt(e.target.value);
                this.changeRoom(roomIndex);
            });
        }
        
        // Navigation arrows
        if (this.elements.prevArrow) {
            on(this.elements.prevArrow, 'click', () => this.previousPhoto());
        }
        if (this.elements.nextArrow) {
            on(this.elements.nextArrow, 'click', () => this.nextPhoto());
        }
        
        // Clap button
        if (this.elements.clapBtn) {
            on(this.elements.clapBtn, 'click', () => this.handleClap());
        }
        
        // Mute toggle
        if (this.elements.muteToggle) {
            on(this.elements.muteToggle, 'click', () => this.toggleMute());
        }
        
        // Keyboard navigation
        on(document, 'keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe events (basic)
        this.setupTouchEvents();
        
        // Image load events
        if (this.elements.photoImage) {
            on(this.elements.photoImage, 'load', () => this.handleImageLoad());
        }
    }
    
    setupTouchEvents() {
        if (!device.isTouchDevice()) return;
        
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;
        
        on(this.elements.photoDisplay, 'touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        on(this.elements.photoDisplay, 'touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const distance = Math.abs(endX - startX);
            
            if (distance > minSwipeDistance) {
                if (endX < startX) {
                    this.nextPhoto(); // Swipe left = next
                } else {
                    this.previousPhoto(); // Swipe right = previous
                }
            }
        }, { passive: true });
    }
    
    loadRoom(roomIndex, photoIndex = 0) {
        if (roomIndex < 0 || roomIndex >= this.rooms.length) return;
        
        const room = this.rooms[roomIndex];
        if (!room || !room.photos.length) return;
        
        // Ensure valid photo index
        if (photoIndex >= room.photos.length) {
            photoIndex = 0;
        }
        
        // Update state
        this.currentRoomIndex = roomIndex;
        this.currentPhotoIndex = photoIndex;
        
        // Update UI
        this.updateRoomUI(room);
        this.loadPhoto(room.photos[photoIndex]);
        this.updateNavigation();
        this.updateURL();
        
        // Preload adjacent photos
        this.preloadAdjacent();
        
        console.log(`Loaded room: ${room.name}, photo: ${photoIndex + 1}/${room.photos.length}`);
    }
    
    updateRoomUI(room) {
        // Update title
        if (this.elements.exhibitTitle) {
            this.elements.exhibitTitle.textContent = room.name;
        }
        
        // Update room selector
        if (this.elements.roomSelect) {
            this.elements.roomSelect.value = this.currentRoomIndex;
        }
        
        // Update photo counter
        this.updatePhotoCounter();
    }
    
    loadPhoto(photo) {
        if (!photo || !this.elements.photoImage) return;
        
        // Update text content immediately
        this.updatePhotoText(photo);
        
        // Check if image is already preloaded
        if (this.preloadedImages.has(photo.src)) {
            this.displayImage(photo, this.preloadedImages.get(photo.src));
        } else {
            this.loadImageWithLQIP(photo);
        }
        
        // Update clap count
        this.updateClapCount(photo);
    }
    
    updatePhotoText(photo) {
        if (this.elements.photoTitle) {
            this.elements.photoTitle.textContent = photo.title;
        }
        
        if (this.elements.photoQuote) {
            this.elements.photoQuote.textContent = photo.quote;
            clampLines(this.elements.photoQuote, 3);
        }
        
        if (this.elements.photoCredit) {
            this.elements.photoCredit.textContent = photo.credit;
        }
    }
    
    loadImageWithLQIP(photo) {
        if (!this.elements.photoImage) return;
        
        // Show LQIP first
        this.elements.photoImage.src = photo.lqip;
        this.elements.photoImage.alt = photo.alt;
        this.elements.photoImage.classList.add('lqip');
        this.elements.photoImage.classList.remove('loaded');
        
        // Load full resolution image
        preloadImage(photo.src).then(img => {
            // Cache the loaded image
            this.preloadedImages.set(photo.src, img);
            
            // Display full image
            this.displayImage(photo, img);
        }).catch(error => {
            console.error('Failed to load image:', photo.src, error);
        });
    }
    
    displayImage(photo, img) {
        if (!this.elements.photoImage || !this.elements.photoFrame) return;
        
        // Update image source
        this.elements.photoImage.src = img.src;
        this.elements.photoImage.classList.remove('lqip');
        this.elements.photoImage.classList.add('loaded');
        
        // Detect orientation and update frame
        this.updateFrameOrientation(img);
    }
    
    handleImageLoad() {
        // Image has loaded successfully
        if (this.elements.photoImage) {
            this.updateFrameOrientation(this.elements.photoImage);
        }
    }
    
    updateFrameOrientation(img) {
        if (!this.elements.photoFrame) return;
        
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        // Remove existing orientation classes
        this.elements.photoFrame.classList.remove('is-landscape', 'is-portrait');
        
        // Add appropriate class based on aspect ratio
        if (aspectRatio > 1) {
            this.elements.photoFrame.classList.add('is-landscape');
        } else {
            this.elements.photoFrame.classList.add('is-portrait');
        }
    }
    
    updateNavigation() {
        const room = this.rooms[this.currentRoomIndex];
        if (!room) return;
        
        // Update arrow visibility/state
        const hasPrev = this.currentPhotoIndex > 0 || this.currentRoomIndex > 0;
        const hasNext = this.currentPhotoIndex < room.photos.length - 1 || this.currentRoomIndex < this.rooms.length - 1;
        
        if (this.elements.prevArrow) {
            this.elements.prevArrow.style.opacity = hasPrev ? '1' : '0.3';
            this.elements.prevArrow.disabled = !hasPrev;
        }
        
        if (this.elements.nextArrow) {
            this.elements.nextArrow.style.opacity = hasNext ? '1' : '0.3';
            this.elements.nextArrow.disabled = !hasNext;
        }
    }
    
    updatePhotoCounter() {
        const room = this.rooms[this.currentRoomIndex];
        if (!room) return;
        
        if (this.elements.currentPhoto) {
            this.elements.currentPhoto.textContent = this.currentPhotoIndex + 1;
        }
        
        if (this.elements.totalPhotos) {
            this.elements.totalPhotos.textContent = room.photos.length;
        }
    }
    
    updateClapCount(photo) {
        const photoKey = this.getPhotoKey(photo);
        const count = this.clapCounts[photoKey] || 0;
        
        if (this.elements.clapCount) {
            this.elements.clapCount.textContent = count;
        }
    }
    
    getPhotoKey(photo) {
        return `${this.currentRoomIndex}-${this.currentPhotoIndex}`;
    }
    
    updateURL() {
        const room = this.rooms[this.currentRoomIndex];
        if (!room) return;
        
        setUrlParam('room', room.id);
        setUrlParam('i', this.currentPhotoIndex + 1);
    }
    
    changeRoom(roomIndex) {
        if (roomIndex === this.currentRoomIndex || this.isTransitioning) return;
        
        this.slideTransition(() => {
            this.loadRoom(roomIndex, 0);
        });
    }
    
    nextPhoto() {
        if (this.isTransitioning) return;
        
        const room = this.rooms[this.currentRoomIndex];
        
        if (this.currentPhotoIndex < room.photos.length - 1) {
            // Next photo in same room
            this.slideTransition(() => {
                this.loadRoom(this.currentRoomIndex, this.currentPhotoIndex + 1);
            }, 'left');
        } else if (this.currentRoomIndex < this.rooms.length - 1) {
            // First photo of next room
            this.slideTransition(() => {
                this.loadRoom(this.currentRoomIndex + 1, 0);
            }, 'left');
        }
    }
    
    previousPhoto() {
        if (this.isTransitioning) return;
        
        if (this.currentPhotoIndex > 0) {
            // Previous photo in same room
            this.slideTransition(() => {
                this.loadRoom(this.currentRoomIndex, this.currentPhotoIndex - 1);
            }, 'right');
        } else if (this.currentRoomIndex > 0) {
            // Last photo of previous room
            const prevRoom = this.rooms[this.currentRoomIndex - 1];
            this.slideTransition(() => {
                this.loadRoom(this.currentRoomIndex - 1, prevRoom.photos.length - 1);
            }, 'right');
        }
    }
    
    slideTransition(callback, direction = 'left') {
        if (!this.elements.photoDisplay) return;
        
        this.isTransitioning = true;
        
        // Add transition class
        this.elements.photoDisplay.classList.add('sliding', `slide-${direction}`);
        
        setTimeout(() => {
            callback();
            
            // Remove transition class
            this.elements.photoDisplay.classList.remove('sliding', `slide-${direction}`);
            this.isTransitioning = false;
        }, 300);
    }
    
    handleClap() {
        const room = this.rooms[this.currentRoomIndex];
        if (!room) return;
        
        const photo = room.photos[this.currentPhotoIndex];
        const photoKey = this.getPhotoKey(photo);
        
        // Increment clap count
        this.clapCounts[photoKey] = (this.clapCounts[photoKey] || 0) + 1;
        this.updateClapCount(photo);
        
        // Visual feedback
        this.elements.clapBtn.classList.add('clapping');
        setTimeout(() => {
            this.elements.clapBtn.classList.remove('clapping');
        }, 300);
        
        // Audio feedback
        if (!this.isMuted) {
            this.playApplause();
        }
        
        // Confetti burst
        if (window.confetti) {
            confetti.burst({
                count: 60,
                duration: 3000,
                origin: { x: 0.5, y: 0.6 }
            });
        }
        
        console.log(`Clapped for photo: ${photo.title}, total: ${this.clapCounts[photoKey]}`);
    }
    
    playApplause() {
        // Play single clap sound
        playSound('assets/audio/clap.mp3', 0.4);
        
        // Play applause loop for 3 seconds
        if (this.applauseAudio) {
            try {
                this.applauseAudio.currentTime = 0;
                this.applauseAudio.volume = 0.4;
                
                const playPromise = this.applauseAudio.play();
                if (playPromise) {
                    playPromise.catch(error => {
                        console.warn('Applause audio play failed:', error);
                    });
                }
                
                // Stop after 3 seconds
                setTimeout(() => {
                    this.applauseAudio.pause();
                }, 3000);
            } catch (error) {
                console.warn('Applause audio error:', error);
            }
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        storage.set('gallery-muted', this.isMuted);
        this.updateMuteUI();
        
        // Stop any currently playing applause
        if (this.isMuted && this.applauseAudio) {
            this.applauseAudio.pause();
        }
        
        console.log(`Audio ${this.isMuted ? 'muted' : 'unmuted'}`);
    }
    
    updateMuteUI() {
        if (this.elements.muteToggle) {
            this.elements.muteToggle.classList.toggle('muted', this.isMuted);
            this.elements.muteToggle.setAttribute('aria-label', 
                this.isMuted ? 'Unmute audio' : 'Mute audio'
            );
        }
    }
    
    preloadAdjacent() {
        const room = this.rooms[this.currentRoomIndex];
        if (!room) return;
        
        // Preload next photo
        if (this.currentPhotoIndex + 1 < room.photos.length) {
            const nextPhoto = room.photos[this.currentPhotoIndex + 1];
            if (!this.preloadedImages.has(nextPhoto.src)) {
                preloadImage(nextPhoto.src).then(img => {
                    this.preloadedImages.set(nextPhoto.src, img);
                }).catch(() => {}); // Silent fail for preloading
            }
        }
        
        // Preload previous photo
        if (this.currentPhotoIndex > 0) {
            const prevPhoto = room.photos[this.currentPhotoIndex - 1];
            if (!this.preloadedImages.has(prevPhoto.src)) {
                preloadImage(prevPhoto.src).then(img => {
                    this.preloadedImages.set(prevPhoto.src, img);
                }).catch(() => {}); // Silent fail for preloading
            }
        }
    }
    
    handleKeyboard(e) {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.previousPhoto();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                this.nextPhoto();
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                this.handleClap();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleMute();
                break;
        }
    }
}

// Initialize gallery when script loads
const gallery = new Gallery();

// Export for debugging/testing
window.gallery = gallery;
