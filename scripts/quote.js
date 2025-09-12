/**
 * Quote Page - Welcome Animation
 * Elegant quote page with red damask background and animated text
 */

class QuotePage {
    constructor() {
        this.container = null;
        this.isAnimating = false;
        this.welcomeText = "Welcome";
        this.currentCharIndex = 0;
    }
    
    async show() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        this.createQuotePage();
        await this.animateWelcomeText();
        await this.wait(2000); // Hold for 2 seconds
        this.navigateToRooms();
    }
    
    createQuotePage() {
        this.container = document.createElement('div');
        this.container.className = 'quote-page';
        this.container.innerHTML = `
            <div class="quote-background"></div>
            <div class="quote-content">
                <div class="welcome-text-container">
                    <h1 class="welcome-text" id="welcome-text"></h1>
                    <div class="welcome-underline"></div>
                </div>
                <p class="quote-subtitle">To the Gallery of Campus Memories</p>
            </div>
            <div class="decorative-frames">
                <div class="frame frame-1"></div>
                <div class="frame frame-2"></div>
                <div class="frame frame-3"></div>
                <div class="frame frame-4"></div>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // Trigger entrance animation
        setTimeout(() => {
            this.container.classList.add('active');
        }, 100);
    }
    
    async animateWelcomeText() {
        const textElement = document.getElementById('welcome-text');
        const underline = this.container.querySelector('.welcome-underline');
        
        // Type each letter with timing
        for (let i = 0; i < this.welcomeText.length; i++) {
            await this.wait(150); // 150ms between letters
            textElement.textContent += this.welcomeText[i];
            
            // Add typing cursor effect
            textElement.classList.add('typing');
        }
        
        // Remove cursor and show underline
        await this.wait(300);
        textElement.classList.remove('typing');
        underline.classList.add('show');
        
        // Show subtitle
        await this.wait(500);
        const subtitle = this.container.querySelector('.quote-subtitle');
        subtitle.classList.add('show');
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    navigateToRooms() {
        // Fade out effect
        this.container.classList.add('fade-out');
        
        setTimeout(() => {
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
window.quotePage = new QuotePage();
