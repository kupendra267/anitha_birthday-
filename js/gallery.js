/**
 * ====================================================================
 * 📸 POLAROID MEMORY GALLERY & LIGHTBOX MODAL 📸
 * ====================================================================
 */

class PolaroidMemoryGallery {
    constructor() {
        this.currentIndex = 0;
        this.photos = (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.gallery) || [];
        this.init();
    }

    init() {
        this.galleryGrid = document.getElementById('galleryGrid');
        this.lightbox = document.getElementById('lightboxModal');
        this.lightboxImg = document.getElementById('lightboxImg');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.lightboxCounter = document.getElementById('lightboxCounter');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.lightboxPrev = document.getElementById('lightboxPrev');
        this.lightboxNext = document.getElementById('lightboxNext');

        this.renderGallery();
        this.bindEvents();
    }

    renderGallery() {
        if (!this.galleryGrid) return;
        this.galleryGrid.innerHTML = '';

        this.photos.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.setAttribute('data-index', index);

            card.innerHTML = `
                <div class="washi-tape ${item.tapeColor || 'tape-pink'}"></div>
                <div class="polaroid-img-wrap">
                    <img src="${item.image}" alt="${item.caption}" loading="lazy" class="polaroid-img" />
                    <span class="polaroid-tag">${item.tag || '✨ Special'}</span>
                </div>
                <div class="polaroid-caption">${item.caption}</div>
            `;

            card.addEventListener('click', () => {
                if (window.birthdayAudio) window.birthdayAudio.playPop();
                this.openLightbox(index);
            });

            this.galleryGrid.appendChild(card);
        });
    }

    bindEvents() {
        if (this.lightboxClose) {
            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
        }

        if (this.lightboxPrev) {
            this.lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prevPhoto();
            });
        }

        if (this.lightboxNext) {
            this.lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextPhoto();
            });
        }

        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }

        window.addEventListener('keydown', (e) => {
            if (!this.lightbox || !this.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.prevPhoto();
            if (e.key === 'ArrowRight') this.nextPhoto();
        });
    }

    openLightbox(index) {
        if (!this.lightbox || !this.photos[index]) return;
        this.currentIndex = index;
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        if (!this.lightbox) return;
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    nextPhoto() {
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.updateLightboxContent();
    }

    prevPhoto() {
        this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const item = this.photos[this.currentIndex];
        if (!item) return;

        if (this.lightboxImg) {
            this.lightboxImg.src = item.image;
            this.lightboxImg.alt = item.caption;
        }

        if (this.lightboxCaption) {
            this.lightboxCaption.textContent = item.caption;
        }

        if (this.lightboxCounter) {
            this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
        }
    }
}

window.birthdayGallery = new PolaroidMemoryGallery();
