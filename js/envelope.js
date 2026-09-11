/**
 * ====================================================================
 * 💌 INTERACTIVE SECRET ENVELOPE & LETTER 💌
 * ====================================================================
 */

class SecretEnvelope {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.envelopeWrapper = document.getElementById('envelopeWrapper');
        this.waxSeal = document.getElementById('waxSeal');
        this.openLetterBtn = document.getElementById('openLetterBtn');
        this.closeLetterBtn = document.getElementById('closeLetterBtn');
        this.letterDisplayCard = document.getElementById('letterDisplayCard');

        if (this.envelopeWrapper) {
            this.envelopeWrapper.addEventListener('click', () => {
                this.toggleEnvelope();
            });
        }

        if (this.openLetterBtn) {
            this.openLetterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEnvelope();
            });
        }

        if (this.closeLetterBtn) {
            this.closeLetterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeEnvelope();
            });
        }
    }

    toggleEnvelope() {
        if (this.isOpen) {
            this.closeEnvelope();
        } else {
            this.openEnvelope();
        }
    }

    openEnvelope() {
        this.isOpen = true;
        
        if (this.envelopeWrapper) {
            this.envelopeWrapper.classList.add('is-open');
        }

        if (this.letterDisplayCard) {
            this.letterDisplayCard.classList.add('is-visible');
            setTimeout(() => {
                this.letterDisplayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }

        if (this.openLetterBtn) {
            this.openLetterBtn.style.display = 'none';
        }

        if (window.birthdayConfetti) {
            const rect = this.envelopeWrapper ? this.envelopeWrapper.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
            window.birthdayConfetti.burst(rect.left + (rect.width / 2 || 0), rect.top + (rect.height / 2 || 0), 50);
        }
    }

    closeEnvelope() {
        this.isOpen = false;

        if (this.envelopeWrapper) {
            this.envelopeWrapper.classList.remove('is-open');
        }

        if (this.letterDisplayCard) {
            this.letterDisplayCard.classList.remove('is-visible');
        }

        if (this.openLetterBtn) {
            this.openLetterBtn.style.display = 'inline-flex';
        }

        if (this.envelopeWrapper) {
            this.envelopeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

window.birthdayEnvelope = new SecretEnvelope();
