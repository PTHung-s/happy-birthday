// ===== HEART EFFECT MODULE =====

class HeartEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.trails = [];
        this.path = [];
        this.animationId = null;
    }
    
    init() {
        this.canvas = document.getElementById('heartCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.createHeartPath();
        this.createTrails();
        this.startAnimation();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createHeartPath() {
        this.path = [];
        const centerX = window.innerWidth / 2 + responsiveManager.getHeartOffset().x;
        const centerY = window.innerHeight / 2 + responsiveManager.getHeartOffset().y;
        
        let scale = 180 * responsiveManager.getHeartSize();
        
        // Điều chỉnh scale cho mobile
        if (responsiveManager.deviceType === 'mobile') {
            if (responsiveManager.isPortrait) {
                scale = Math.min(scale, responsiveManager.screenWidth * 0.3);
            } else {
                scale = Math.min(scale, responsiveManager.screenHeight * 0.25);
            }
        }
        
        // Heart curve formula
        for (let i = 0; i < 6.3; i += 0.2) {
            const x = centerX + scale * Math.pow(Math.sin(i), 3);
            const y = centerY + 10 * (scale/180) * (-(15 * Math.cos(i) - 5 * Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i)));
            this.path.push([x, y]);
        }
    }
    
    createTrails() {
        this.trails = [];
        const numTrails = responsiveManager.getConfig(HEART_CONFIG.trails);
        const particlesPerTrail = responsiveManager.getConfig(HEART_CONFIG.particles);
        
        for (let i = 0; i < numTrails; i++) {
            const trail = this.createTrail(particlesPerTrail, i, numTrails);
            this.trails.push(trail);
        }
    }
    
    createTrail(numParticles, trailIndex, totalTrails) {
        const particles = [];
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        // Colors
        const hue = (trailIndex / totalTrails) * HEART_CONFIG.colors.hueRange + HEART_CONFIG.colors.hueStart;
        const saturation = Math.random() * 40 + HEART_CONFIG.colors.saturation;
        const brightness = Math.random() * 60 + HEART_CONFIG.colors.brightness;
        
        for (let i = 0; i < numParticles; i++) {
            const radiusMultiplier = responsiveManager.deviceType === 'mobile' ? 2 : 3;
            const baseRadius = responsiveManager.deviceType === 'mobile' ? 1.5 : 2;
            
            particles.push({
                x: startX,
                y: startY,
                vx: 0,
                vy: 0,
                radius: ((1 - i / numParticles) * radiusMultiplier) + baseRadius,
                speed: (Math.random() + HEART_CONFIG.speed) * (responsiveManager.deviceType === 'mobile' ? 0.8 : 1),
                targetIndex: Math.floor(Math.random() * this.path.length),
                direction: trailIndex % 2 * 2 - 1,
                friction: Math.random() * 0.2 + (responsiveManager.deviceType === 'mobile' ? 0.8 : 0.7),
                color: `hsla(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(brightness)}%, ${responsiveManager.deviceType === 'mobile' ? 0.3 : HEART_CONFIG.opacity})`
            });
        }
        
        return particles;
    }
    
    startAnimation() {
        this.animate();
    }
    
    animate() {
        // Clear with fade effect
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.trails.forEach(trail => {
            this.updateTrail(trail);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateTrail(trail) {
        const leader = trail[0];
        const target = this.path[leader.targetIndex];
        
        if (!target) return;
        
        // Calculate distance to target
        const dx = leader.x - target[0];
        const dy = leader.y - target[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Choose new target if close enough
        if (distance < 10) {
            if (Math.random() > 0.95) {
                leader.targetIndex = Math.floor(Math.random() * this.path.length);
            } else {
                if (Math.random() > 0.99) leader.direction *= -1;
                leader.targetIndex += leader.direction;
                leader.targetIndex = (leader.targetIndex + this.path.length) % this.path.length;
            }
        }
        
        // Update velocity
        leader.vx += (-dx / distance) * leader.speed;
        leader.vy += (-dy / distance) * leader.speed;
        
        // Update position
        leader.x += leader.vx;
        leader.y += leader.vy;
        
        // Draw leader
        this.drawParticle(leader);
        
        // Apply friction
        leader.vx *= leader.friction;
        leader.vy *= leader.friction;
        
        // Update followers
        for (let i = 1; i < trail.length; i++) {
            const current = trail[i];
            const previous = trail[i - 1];
            
            current.x -= (current.x - previous.x) * 0.7;
            current.y -= (current.y - previous.y) * 0.7;
            
            this.drawParticle(current);
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        
        // Glow effect (lighter on mobile)
        if (responsiveManager.deviceType !== 'mobile' || particle.radius > 3) {
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = particle.radius * (responsiveManager.deviceType === 'mobile' ? 1.5 : HEART_CONFIG.glowIntensity);
        }
        
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    resize() {
        this.setupCanvas();
        this.createHeartPath();
    }
    
    updateConfig() {
        this.createHeartPath();
        // Recreate trails with new config
        this.createTrails();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Export instance
const heartEffect = new HeartEffect();
