class Effects {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particlesTop = [];
        this.particlesRight = [];
        this.particlesBottom = [];
        this.particlesLeft = [];
        this.explosions = [];
        this.damageIndicators = [];
        this.healthIndicators = [];
        this.fragments = [];
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    // SmokeEffect methods
    addSmokeParticle(x, y) {
        this.particles.push({
            x: x,
            y: y,
            alpha: 1.0,
            size: Math.random() * 5 + 5,
            speedX: Math.random() * 2 + 1,
            speedY: Math.random() * 1 - 0.5
        });
    }

    updateSmokeParticles() {
        this.particles.forEach(particle => {
            particle.x -= particle.speedX;
            particle.y += particle.speedY;
            particle.alpha -= 0.01;
        });

        this.particles = this.particles.filter(particle => particle.alpha > 0);
    }

    drawSmokeParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(128, 128, 128, ${particle.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    updateAndDrawSmokeParticles() {
        this.updateSmokeParticles();
        this.drawSmokeParticles();
    }

    // FireEffect methods
    addFireParticleTop(x, y) {
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 3 + 5,
            speedY: (Math.random() - 0.5) * 2,
            speedX: Math.random() * -2 - 1,
            alpha: 1,
            life: Math.random() * 30 + 20,
            color: this.getRandomFireColor()
        };
        this.particlesTop.push(particle);
    }

    addFireParticleBottom(x, y) {
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 3 + 5,
            speedY: (Math.random() - 0.5) * 2,
            speedX: Math.random() * -2 - 1,
            alpha: 1,
            life: Math.random() * 30 + 20,
            color: this.getRandomFireColor()
        };
        this.particlesBottom.push(particle);
    }

    addFireParticleRight(x, y) {
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 3 + 5,
            speedY: (Math.random() - 0.5) * 2,
            speedX: Math.random() * -2 - 1,
            alpha: 1,
            life: Math.random() * 30 + 20,
            color: this.getRandomFireColor()
        };
        this.particlesRight.push(particle);
    }
    
    addFireParticleLeft(x, y) {
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 3 + 5,
            speedY: (Math.random() - 0.5) * 2,
            speedX: Math.random() * -2 - 1,
            alpha: 1,
            life: Math.random() * 30 + 20,
            color: this.getRandomFireColor()
        };
        this.particlesLeft.push(particle);
    }
    
    getRandomFireColor() {
        const colors = ['rgba(255, 69, 0, 1)', 'rgba(255, 140, 0, 1)', 'rgba(255, 215, 0, 1)'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateAndDrawFireParticles() {
        this.updateAndDrawParticles(this.particlesTop);
        this.updateAndDrawParticles(this.particlesBottom);
        this.updateAndDrawParticles(this.particlesRight);
        this.updateAndDrawParticles(this.particlesLeft);
    }

    updateAndDrawParticles(particles) {
        particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.alpha -= 0.02;
            particle.size *= 0.95;
            particle.life -= 1;

            if (particle.life <= 0 || particle.alpha <= 0) {
                particles.splice(index, 1);
            } else {
                this.drawFireParticle(particle);
            }
        });
    }

    drawFireParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    // ScreenShakeEffect methods
    shakeScreen(duration = 500, intensity = 5) {
        const startTime = performance.now();

        const shake = () => {
            const elapsedTime = performance.now() - startTime;
            if (elapsedTime < duration) {
                const dx = (Math.random() - 0.5) * intensity;
                const dy = (Math.random() - 0.5) * intensity;
                this.canvas.style.transform = `translate(${dx}px, ${dy}px)`;
                requestAnimationFrame(shake);
            } else {
                this.canvas.style.transform = 'translate(0, 0)';
            }
        };

        shake();
    }

    // DamageEffect methods
    addDamageIndicator(amount, x, y) {
        this.damageIndicators.push({
            amount: amount,
            x: x,
            y: y,
            startTime: performance.now()
        });
    }

    addHealthIndicator(amount, x, y) {
        this.healthIndicators.push({
            amount: amount,
            x: x,
            y: y,
            startTime: performance.now()
        });
    }

    drawDamageIndicators() {
        const gameTime = performance.now();
        this.damageIndicators = this.damageIndicators.filter(indicator => {
            const elapsed = (gameTime - indicator.startTime) / 1000;
            if (elapsed < 1) {
                this.ctx.save();
                this.ctx.fillStyle = `rgba(255, 0, 0, ${1 - elapsed})`;
                this.ctx.font = '20px Arial';
                this.ctx.fillText(`-${indicator.amount}`, indicator.x, indicator.y - elapsed * 20);
                this.ctx.restore();
                return true;
            }
            return false;
        });
    }

    drawHealthIndicators() {
        const gameTime = performance.now();
        this.healthIndicators = this.healthIndicators.filter(indicator => {
            const elapsed = (gameTime - indicator.startTime) / 1000;
            if (elapsed < 1) {
                this.ctx.save();
                this.ctx.fillStyle = `rgba(0, 255, 0, ${1 - elapsed})`;
                this.ctx.font = '20px Arial';
                this.ctx.fillText(`+${indicator.amount}`, indicator.x, indicator.y - elapsed * 20);
                this.ctx.restore();
                return true;
            }
            return false;
        });
    }

    // ShieldFragments methods
    createShieldFragments(x, y) {
        const numFragments = 15;
        for (let i = 0; i < numFragments; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 3 + 1;
            const size = Math.random() * 10 + 5;
            const color = 'rgba(255, 255, 0, 1)';

            this.fragments.push({
                x: x, y: y, 
                angle: angle, 
                speed: speed, 
                size: size, 
                color: color,
                alpha: 1
            });
        }
    }

    updateShieldFragments() {
        for (let i = 0; i < this.fragments.length; i++) {
            const fragment = this.fragments[i];
            fragment.x += fragment.speed * Math.cos(fragment.angle);
            fragment.y += fragment.speed * Math.sin(fragment.angle);
            fragment.alpha -= 0.02;

            if (fragment.alpha <= 0) {
                this.fragments.splice(i, 1);
                i--;
            }
        }
    }

    drawShieldFragments() {
        for (const fragment of this.fragments) {
            this.ctx.globalAlpha = fragment.alpha;
            this.ctx.fillStyle = fragment.color;
            this.ctx.beginPath();
            this.ctx.moveTo(fragment.x, fragment.y);
            this.ctx.lineTo(
                fragment.x + fragment.size * Math.cos(fragment.angle + Math.PI / 4), 
                fragment.y + fragment.size * Math.sin(fragment.angle + Math.PI / 4)
            );
            this.ctx.lineTo(
                fragment.x + fragment.size * Math.cos(fragment.angle - Math.PI / 4), 
                fragment.y + fragment.size * Math.sin(fragment.angle - Math.PI / 4)
            );
            this.ctx.closePath();
            this.ctx.fill();
        }

        this.ctx.globalAlpha = 1;
    }

    // Sparkle methods
    addSparkle(x, y, radius, opacity) {
        this.particles.push(this.createSparkle(x, y, radius, opacity));
    }

    updateSparkles() {
        this.particles.forEach(particle => {
            this.updateSparkle(particle);
        });

        this.particles = this.particles.filter(particle => particle.opacity > 0);
    }

    drawSparkles() {
        this.particles.forEach(particle => {
            this.drawSparkle(particle);
        });
    }

    createSparkle(x, y, radius, opacity) {
        return {
            x: x,
            y: y,
            radius: radius,
            opacity: opacity,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2
        };
    }

    updateSparkle(particle) {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.opacity -= 0.01;
        if (particle.opacity < 0) {
            particle.opacity = 0;
        }
    }

    drawSparkle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.fill();
        this.ctx.restore();
    }
}

// Xuất class Effects
export default Effects;