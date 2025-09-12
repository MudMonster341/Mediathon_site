/**
 * Cinematic Transition Animation
 * Beautiful image montage effect after password entry
 */

class CinematicTransition {
    constructor() {
        this.selectedImages = [];
        this.currentIndex = 0;
        this.container = null;
        this.isAnimating = false;
        
        this.setupSelectedImages();
    }
    
    setupSelectedImages() {
        // Curated list of selected landscape images for smooth transition (original selection minus labs-001)
        this.selectedImages = [
            {
                src: 'assets/images/campus-001.jpg',
                title: 'Campus Walkways',
                isPortrait: false
            },
            {
                src: 'assets/images/campus-002.jpg',
                title: 'Academic Block',
                isPortrait: false
            },
            {
                src: 'assets/images/campus-003.jpg',
                title: 'Desert Sunset',
                isPortrait: false
            },
            {
                src: 'assets/images/class-001.jpg',
                title: 'Interactive Learning',
                isPortrait: false
            },
            {
                src: 'assets/images/labs-002.jpg',
                title: 'Innovation Labs',
                isPortrait: false
            },
            {
                src: 'assets/images/sports-001.jpg',
                title: 'Sports Facilities',
                isPortrait: false
            }
        ];
        
        console.log(`Selected ${this.selectedImages.length} images for cinematic transition`);
    }
    
    async startTransition() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        // Create fullscreen overlay
        this.createOverlay();
        
        // Preload all images
        await this.preloadImages();
        
        // Start the image sequence (2 seconds per image)
        await this.playImageSequence();
        
        // Navigate to rooms page
        this.navigateToRooms();
    }
    
    preloadImages() {
        return Promise.all(
            this.selectedImages.map(imageData => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imageData.src;
                });
            })
        );
    }
    
    createOverlay() {
        this.container = document.createElement('div');
        this.container.className = 'cinematic-overlay';
        
        // Check if we're on the clean transition page (no text overlay)
        const isCleanTransition = window.location.pathname.includes('transition.html');
        
        if (isCleanTransition) {
            // Clean version without text overlay
            this.container.innerHTML = `
                <div class="background-images"></div>
                <div class="color-overlay"></div>
            `;
        } else {
            // Original version with text overlay
            this.container.innerHTML = `
                <div class="background-images"></div>
                <div class="color-overlay"></div>
                <div class="cinematic-content">
                    <div class="text-overlay">
                        <div class="transition-text">
                            <h2>THE 4-YEAR CANVAS</h2>
                            <p>Entering the Museum of Student Life</p>
                            <div class="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        document.body.appendChild(this.container);
        
        // Trigger entrance animation
        setTimeout(() => {
            this.container.classList.add('active');
        }, 50);
    }
    
    async playImageSequence() {
        const backgroundContainer = this.container.querySelector('.background-images');
        const textOverlay = this.container.querySelector('.text-overlay');
        
        for (let i = 0; i < this.selectedImages.length; i++) {
            await this.showImage(backgroundContainer, this.selectedImages[i], i);
            
            // Fade out text overlay after first image (only if it exists)
            if (i === 0 && textOverlay) {
                setTimeout(() => {
                    textOverlay.classList.add('fade-out');
                }, 1000); // Fade out after 1 second of first image
            }
            
            await this.wait(1800); // 1.8 seconds per image - equal timing for all images
        }
        
        // Show cinematic text immediately after last image (no extra wait)
        await this.showFinalCinematicText();
        
        // Hold the text for a moment before transitioning
        await this.wait(2500);
    }
    
    async showFinalCinematicText() {
        // Create the cinematic text overlay
        const cinematicText = document.createElement('div');
        cinematicText.className = 'final-cinematic-text';
        cinematicText.innerHTML = `
            <h1 class="cinematic-title">THE 4-YEAR CANVAS</h1>
            <p class="cinematic-subtitle">EVERY FRAME TELLS A CAMPUS STORY</p>
        `;
        
        this.container.appendChild(cinematicText);
        
        // Trigger fade-in animation
        setTimeout(() => {
            cinematicText.classList.add('fade-in');
        }, 100);
        
        return new Promise(resolve => {
            setTimeout(resolve, 1500); // Wait for fade-in animation
        });
    }
    
    showImage(container, imageData, index) {
        return new Promise((resolve) => {
            const imgElement = document.createElement('div');
            imgElement.className = `background-image ${imageData.isPortrait ? 'portrait' : 'landscape'}`;
            imgElement.style.backgroundImage = `url(${imageData.src})`;
            
            container.appendChild(imgElement);
            
            // Remove previous image for smooth transition
            const prevImages = container.querySelectorAll('.background-image');
            if (prevImages.length > 1) {
                prevImages[0].classList.add('fade-out');
                setTimeout(() => {
                    if (prevImages[0].parentNode) {
                        prevImages[0].remove();
                    }
                }, 800);
            }
            
            // Trigger animation
            setTimeout(() => {
                imgElement.classList.add('active');
            }, 50);
            
            setTimeout(resolve, 400); // Wait for fade-in to complete
        });
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    navigateToRooms() {
        // Add completion class for final animation
        this.container.classList.add('complete');
        
        setTimeout(() => {
            this.cleanup();
            // Navigate to rooms.html with smooth transition
            window.location.href = 'rooms.html';
        }, 800);
    }
    
    cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.isAnimating = false;
    }
}

// Create global instance
window.cinematicTransition = new CinematicTransition();
