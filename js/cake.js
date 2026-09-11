/**
 * ====================================================================
 * 🎂 INTERACTIVE BIRTHDAY CAKE & WISH CEREMONY 🎂
 * ====================================================================
 */

class BirthdayCakeCeremony {
    constructor() {
        this.isBlownOut = false;
        this.init();
    }

    init() {
        this.cakeContainer = document.getElementById('cakeContainer');
        this.makeWishBtn = document.getElementById('makeWishBtn');
        this.wishResultCard = document.getElementById('wishResultCard');
        this.candles = document.querySelectorAll('.cake-candle');
        this.flames = document.querySelectorAll('.flame');

        if (this.makeWishBtn) {
            this.makeWishBtn.addEventListener('click', () => this.blowCandles());
        }

        this.candles.forEach(candle => {
            candle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.blowCandles();
            });
        });
    }

    blowCandles() {
        if (this.isBlownOut) return;
        this.isBlownOut = true;

        // Extinguish flames
        this.flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.classList.add('extinguished');
            }, index * 100);
        });

        // Trigger confetti burst
        if (window.birthdayConfetti) {
            window.birthdayConfetti.cannonBurst();
        }

        // Hide button & Reveal wish card
        if (this.makeWishBtn) {
            this.makeWishBtn.style.display = 'none';
        }

        if (this.wishResultCard) {
            setTimeout(() => {
                this.wishResultCard.classList.add('revealed');
            }, 400);
        }
    }

    relight() {
        this.isBlownOut = false;
        this.flames.forEach(flame => flame.classList.remove('extinguished'));
        if (this.makeWishBtn) this.makeWishBtn.style.display = 'inline-flex';
        if (this.wishResultCard) {
            this.wishResultCard.classList.remove('revealed');
        }
    }
}

window.birthdayCake = new BirthdayCakeCeremony();
