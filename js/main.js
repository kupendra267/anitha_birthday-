/**
 * ====================================================================
 * 💖 MAIN CONTROLLER & SURPRISE ORCHESTRATION 💖
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initContentFromConfig();
    initAmbientParticles();
    initActionButtons();
    initScrollTriggers();
});

function initContentFromConfig() {
    const cfg = window.BIRTHDAY_CONFIG;
    if (!cfg) return;

    // Welcome Section
    setElText('heroScriptTag', cfg.welcome.preTitle || "Anitha,");
    setElText('heroGreeting', cfg.welcome.mainTitle || "This Is For You 💖");
    setElText('heroSubtitle', cfg.welcome.subtitle);
    setElText('openSurpriseBtnText', cfg.welcome.buttonText);

    // Celebration Section
    setElText('celebrationTag', cfg.celebration.tag);
    setElText('celebrationHeading', cfg.celebration.heading);
    setElText('celebrationQuote', cfg.celebration.quoteHighlight);
    setElText('celebrationP1', cfg.celebration.messageP1);
    setElText('celebrationP2', cfg.celebration.messageP2);

    // Special Reasons Cards
    renderSpecialReasons(cfg.specialReasons);

    // Cake Section
    setElText('cakeTag', cfg.cake.tag);
    setElText('cakeHeading', cfg.cake.heading);
    setElText('cakeSubtext', cfg.cake.subtext);
    setElText('makeWishBtnText', cfg.cake.buttonText);
    setElText('cakeWishTitle', cfg.cake.wishTitle);
    setElText('cakeWishMessage', cfg.cake.wishMessage);

    // Secret Letter Section
    setElText('letterTag', cfg.secretMessage.tag);
    setElText('letterTeaser', cfg.secretMessage.teaser);
    setElText('letterSubtext', cfg.secretMessage.subtext);
    setElText('letterSalutation', cfg.secretMessage.letterSalutation);
    
    if (cfg.secretMessage.paragraphs && Array.isArray(cfg.secretMessage.paragraphs)) {
        const letterBodyEl = document.getElementById('letterBody');
        if (letterBodyEl) {
            letterBodyEl.innerHTML = '';
            cfg.secretMessage.paragraphs.forEach(pText => {
                const p = document.createElement('p');
                p.textContent = pText;
                letterBodyEl.appendChild(p);
            });
        }
    }
    
    setElText('letterClosing', cfg.secretMessage.letterClosing);
    setElText('letterSignature', cfg.secretMessage.letterSignature);

    // Finale Section
    setElText('finalTag', cfg.finalScreen.tag);
    setElText('finalHeading', cfg.finalScreen.heading);
    setElText('finalQuote', cfg.finalScreen.quote);
    setElText('finalTagline', cfg.finalScreen.tagline);
}

function setElText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
}

function renderSpecialReasons(reasons) {
    const grid = document.getElementById('specialGrid');
    if (!grid || !reasons) return;

    grid.innerHTML = '';
    reasons.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'special-card glass-card';

        card.innerHTML = `
            <div class="special-icon-badge">${item.emoji}</div>
            <span class="special-subtitle-tag">${item.subtitle || 'Special Quality'}</span>
            <h3 class="special-title">${item.title}</h3>
            <p class="special-desc">${item.description}</p>
        `;

        grid.appendChild(card);
    });
}

function initAmbientParticles() {
    const container = document.getElementById('ambientParticles');
    if (!container) return;

    const symbols = ['💖', '🌸', '✨', '💕', '🌷', '⭐', '🎈'];
    const count = window.innerWidth < 768 ? 14 : 24;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-float-particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        const size = 16 + Math.random() * 16;
        const left = Math.random() * 100;
        const duration = 12 + Math.random() * 14;
        const delay = Math.random() * 10;
        const opacity = 0.25 + Math.random() * 0.45;

        particle.style.fontSize = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        particle.style.opacity = opacity;

        container.appendChild(particle);
    }
}

function initActionButtons() {
    // Page 1: Open Surprise
    const openBtn = document.getElementById('openSurpriseBtn');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (window.birthdayConfetti) {
                window.birthdayConfetti.cannonBurst();
            }

            const nextSec = document.getElementById('celebrationSection');
            if (nextSec) {
                nextSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Finale: Replay
    const replayBtn = document.getElementById('replaySurpriseBtn');
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            if (window.birthdayCake) window.birthdayCake.relight();
            if (window.birthdayEnvelope) window.birthdayEnvelope.closeEnvelope();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Finale: Virtual Hug
    const hugBtn = document.getElementById('sendHugBtn');
    if (hugBtn) {
        hugBtn.addEventListener('click', () => {
            showVirtualHug();
        });
    }

    // Finale: Love Rain
    const loveRainBtn = document.getElementById('loveRainBtn');
    if (loveRainBtn) {
        loveRainBtn.addEventListener('click', () => {
            if (window.birthdayConfetti) window.birthdayConfetti.cannonBurst();
            triggerLoveShower();
        });
    }
}

function initScrollTriggers() {
    const finaleSec = document.getElementById('finaleSection');
    if (!finaleSec) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (window.birthdayFireworks) window.birthdayFireworks.start();
            } else {
                if (window.birthdayFireworks) window.birthdayFireworks.stop();
            }
        });
    }, { threshold: 0.2 });

    observer.observe(finaleSec);
}

function showVirtualHug() {
    const modal = document.createElement('div');
    modal.className = 'virtual-hug-modal active';
    modal.innerHTML = `
        <div class="hug-card glass-card">
            <div class="hug-emoji">🤗💖</div>
            <h2>Sending You The Warmest Hug!</h2>
            <p>May your day be filled with boundless warmth, peace, and endless reasons to smile!</p>
            <button class="btn btn-primary" id="closeHugBtn">Aww, Thank You! ✨</button>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#closeHugBtn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 400);
    });

    if (window.birthdayConfetti) {
        window.birthdayConfetti.burst(window.innerWidth / 2, window.innerHeight / 2, 60);
    }
}

function triggerLoveShower() {
    const hearts = ['💖', '💕', '💗', '🌸', '✨', '🌷'];
    for (let i = 0; i < 35; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'falling-love-particle';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = `${Math.random() * 95}vw`;
            heart.style.animationDuration = `${3 + Math.random() * 3}s`;
            heart.style.fontSize = `${20 + Math.random() * 22}px`;
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 5500);
        }, i * 90);
    }
}
