/**
 * ====================================================================
 * 🎊 CONFETTI & PARTICLE ENGINE 🎊
 * ====================================================================
 * High-performance Canvas Confetti with pastel colors, hearts, and stars
 */

class ConfettiEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confettiCanvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9998';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animId = null;

        this.colors = [
            '#ff6b9d', '#ff8eb4', '#ffc2d4', '#e0aaff', '#c77dff',
            '#ffd166', '#06d6a0', '#118ab2', '#ff9f1c', '#ffffff'
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    burst(x = this.width / 2, y = this.height / 2, count = 100) {
        const shapes = ['circle', 'rect', 'heart', 'star'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 4 + Math.random() * 9;
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 2,
                size: 6 + Math.random() * 8,
                color: color,
                shape: shape,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                wobble: Math.random() * 10,
                wobbleSpeed: 0.1 + Math.random() * 0.1,
                opacity: 1,
                decay: 0.008 + Math.random() * 0.012,
                gravity: 0.18 + Math.random() * 0.08
            });
        }

        if (!this.animId) {
            this.animate();
        }
    }

    cannonBurst() {
        // Left cannon
        this.burst(50, this.height - 50, 60);
        // Right cannon
        this.burst(this.width - 50, this.height - 50, 60);
        // Center surprise
        setTimeout(() => {
            this.burst(this.width / 2, this.height / 3, 100);
        }, 250);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.rotation += p.rotationSpeed;
            p.opacity -= p.decay;
            p.wobble += p.wobbleSpeed;

            if (p.opacity <= 0 || p.y > this.height + 50) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x + Math.sin(p.wobble) * 4, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.shape === 'heart') {
                this.drawHeart(p.size);
            } else if (p.shape === 'star') {
                this.drawStar(p.size);
            }

            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(() => this.animate());
        } else {
            this.animId = null;
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }

    drawHeart(size) {
        const s = size / 2.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s, -s * 0.8, -s * 2, s * 0.5, 0, s * 2);
        this.ctx.bezierCurveTo(s * 2, s * 0.5, s, -s * 0.8, 0, s * 0.3);
        this.ctx.fill();
    }

    drawStar(size) {
        const spikes = 5;
        const outerRadius = size / 2;
        const innerRadius = size / 4;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
            let x = Math.cos(rot) * outerRadius;
            let y = Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(0, -outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// Global instance
window.birthdayConfetti = new ConfettiEngine();
