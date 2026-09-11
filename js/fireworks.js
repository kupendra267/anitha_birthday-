/**
 * ====================================================================
 * 🎆 FIREWORKS CANVAS ENGINE 🎆
 * ====================================================================
 * Realistic, magical fireworks with multi-color particle physics & sound
 */

class FireworksEngine {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'fireworksCanvas';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '1';
        }

        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.particles = [];
        this.isRunning = false;
        this.timer = null;

        this.colors = [
            '#ff3366', '#ff6699', '#ff99cc', '#ffcc00', '#ff9900',
            '#33ccff', '#66ffcc', '#cc66ff', '#ffffff', '#ff0055'
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement || document.body;
        this.width = this.canvas.width = parent.clientWidth || window.innerWidth;
        this.height = this.canvas.height = parent.clientHeight || window.innerHeight;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.resize();
        this.animate();

        // Launch initial salvo
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.launchRandom(), i * 400);
        }

        // Automatic continuous launches
        this.timer = setInterval(() => {
            if (this.isRunning && this.fireworks.length < 5) {
                this.launchRandom();
                if (Math.random() > 0.5) {
                    setTimeout(() => this.launchRandom(), 300);
                }
            }
        }, 1200);
    }

    stop() {
        this.isRunning = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    launchRandom() {
        const startX = this.width * (0.2 + Math.random() * 0.6);
        const targetX = startX + (Math.random() - 0.5) * (this.width * 0.4);
        const targetY = this.height * (0.15 + Math.random() * 0.35);
        this.launch(startX, this.height, targetX, targetY);
    }

    launch(sx, sy, tx, ty) {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.fireworks.push({
            x: sx,
            y: sy,
            sx: sx,
            sy: sy,
            tx: tx,
            ty: ty,
            distanceToTarget: Math.hypot(tx - sx, ty - sy),
            distanceTraveled: 0,
            angle: Math.atan2(ty - sy, tx - sx),
            speed: 4,
            acceleration: 1.05,
            brightness: 50 + Math.random() * 50,
            targetRadius: 1,
            color: color,
            trail: []
        });
    }

    explode(x, y, color) {
        const particleCount = 80 + Math.floor(Math.random() * 40);
        const isHeart = Math.random() > 0.6;

        for (let i = 0; i < particleCount; i++) {
            let angle, speed;

            if (isHeart) {
                // Heart-shaped mathematical distribution
                const t = (Math.PI * 2 * i) / particleCount;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                angle = Math.atan2(hy, hx);
                speed = Math.hypot(hx, hy) * 0.25 * (0.8 + Math.random() * 0.4);
            } else {
                angle = Math.random() * Math.PI * 2;
                speed = 2 + Math.random() * 6;
            }

            this.particles.push({
                x: x,
                y: y,
                angle: angle,
                speed: speed,
                friction: 0.95,
                gravity: 0.08,
                color: color,
                alpha: 1,
                decay: 0.012 + Math.random() * 0.018,
                size: 2 + Math.random() * 2,
                trail: []
            });
        }

        // Trigger confetti micro-burst
        if (window.birthdayConfetti && Math.random() > 0.4) {
            window.birthdayConfetti.burst(x, y, 20);
        }
    }

    animate() {
        if (!this.isRunning && this.fireworks.length === 0 && this.particles.length === 0) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            return;
        }

        // Semi-transparent fade for glowing light trails
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'lighter';

        // Update & draw rocket fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const f = this.fireworks[i];
            
            f.speed *= f.acceleration;
            const vx = Math.cos(f.angle) * f.speed;
            const vy = Math.sin(f.angle) * f.speed;
            f.distanceTraveled = Math.hypot(f.x - f.sx, f.y - f.sy);

            f.x += vx;
            f.y += vy;

            // Draw rocket trail
            this.ctx.beginPath();
            this.ctx.arc(f.x, f.y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = f.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = f.color;
            this.ctx.fill();

            if (f.distanceTraveled >= f.distanceToTarget) {
                this.explode(f.tx, f.ty, f.color);
                this.fireworks.splice(i, 1);
            }
        }

        // Update & draw explosion particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.speed *= p.friction;
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed + p.gravity;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Global instance
window.birthdayFireworks = new FireworksEngine();
