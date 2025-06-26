// ===== CAKE EFFECT MODULE =====

class CakeEffect {
    constructor() {
        this.particleSystem = null;
        this.geometry = null;
        this.material = null;
        this.trailSystems = [];
        this.positions = [];
        this.initialPositions = [];
    }
    
    generateCakeShape(numPoints) {
        const positions = [];
        const config = CAKE_CONFIG;
        
        // Điều chỉnh số điểm theo device
        const devicePoints = responsiveManager.getConfig(config.particles);
        numPoints = Math.min(numPoints, devicePoints);
        
        // Phân chia điểm
        const cakePoints = Math.floor(numPoints * 0.70);
        const creamDecorPoints = Math.floor(numPoints * 0.08);
        const candyDecorPoints = Math.floor(numPoints * 0.02);
        const candlePoints = Math.floor(numPoints * 0.15);
        const flamePoints = numPoints - cakePoints - creamDecorPoints - candyDecorPoints - candlePoints;
        
        // Scale theo device
        const scale = config.scale * (responsiveManager.deviceType === 'mobile' ? 0.8 : 1.0);
        const layers = config.layers.map(layer => ({
            ...layer,
            radius: layer.radius * scale,
            height: layer.height * scale,
            y: layer.y * scale
        }));
        
        // Tạo các tầng bánh
        layers.forEach((layer, layerIndex) => {
            const pointsForLayer = Math.floor(cakePoints / layers.length);
            
            // Thân bánh
            const bodyPoints = Math.floor(pointsForLayer * 0.7);
            for (let i = 0; i < bodyPoints; i++) {
                const theta = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * layer.radius * 0.85;
                const h = Math.random() * layer.height;
                
                const x = r * Math.cos(theta);
                const z = r * Math.sin(theta);
                const y = layer.y + h;
                
                positions.push(x, y, z);
            }
            
            // Viền bánh
            const rimPoints = Math.floor(pointsForLayer * 0.25);
            for (let i = 0; i < rimPoints; i++) {
                const theta = (i / rimPoints) * Math.PI * 2;
                const r = layer.radius * (0.98 + Math.random() * 0.04);
                const h = Math.random() * layer.height;
                
                const x = r * Math.cos(theta);
                const z = r * Math.sin(theta);
                const y = layer.y + h;
                
                positions.push(x, y, z);
            }
            
            // Kem chảy
            const dripPoints = Math.floor(pointsForLayer * 0.05);
            for (let i = 0; i < dripPoints; i++) {
                const theta = Math.random() * Math.PI * 2;
                const r = layer.radius * (1.0 + Math.random() * 0.05);
                const dripLength = Math.random() * 0.08;
                const h = -dripLength;
                
                const x = r * Math.cos(theta);
                const z = r * Math.sin(theta);
                const y = layer.y + h;
                
                positions.push(x, y, z);
            }
        });
        
        // Thêm kem trang trí, kẹo, nến, lửa...
        this.addDecorations(positions, creamDecorPoints, candyDecorPoints);
        this.addCandles(positions, candlePoints, flamePoints, scale);
        
        return positions;
    }
    
    addDecorations(positions, creamDecorPoints, candyDecorPoints) {
        // Kem trang trí
        for (let i = 0; i < creamDecorPoints; i++) {
            const t = (i / creamDecorPoints) * Math.PI * 4;
            const r = 0.3 * (1 - (i / creamDecorPoints) * 0.5);
            const h = Math.sin(t * 2) * 0.05;
            
            const x = r * Math.cos(t);
            const z = r * Math.sin(t);
            const y = 0.05 + h;
            
            positions.push(x, y, z);
        }
        
        // Kẹo trang trí
        const numCandies = Math.min(30, candyDecorPoints);
        const pointsPerCandy = Math.floor(candyDecorPoints / numCandies);
        
        for (let i = 0; i < numCandies && pointsPerCandy > 0; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 0.8 + Math.random() * 0.4;
            const candyRadius = 0.04;
            
            for (let j = 0; j < pointsPerCandy; j++) {
                const u = Math.random();
                const v = Math.random();
                const theta_s = 2 * Math.PI * u;
                const phi_s = Math.acos(2 * v - 1);
                
                const x = r * Math.cos(angle) + candyRadius * Math.sin(phi_s) * Math.cos(theta_s);
                const y = -0.3 + candyRadius * Math.cos(phi_s);
                const z = r * Math.sin(angle) + candyRadius * Math.sin(phi_s) * Math.sin(theta_s);
                
                positions.push(x, y, z);
            }
        }
    }
    
    addCandles(positions, candlePoints, flamePoints, scale) {
        const candleHeights = [0.25, 0.30, 0.20, 0.35, 0.22, 0.28, 0.32].map(h => h * scale);
        const numCandles = candleHeights.length;
        const candlePositions = [];
        
        // Tạo nến
        for (let candleIndex = 0; candleIndex < numCandles; candleIndex++) {
            const angle = (candleIndex / numCandles) * Math.PI * 2;
            const candleDistance = 0.5 * scale * 0.7;
            const candleX = candleDistance * Math.cos(angle);
            const candleZ = candleDistance * Math.sin(angle);
            const candleHeight = candleHeights[candleIndex];
            
            candlePositions.push({
                x: candleX,
                z: candleZ,
                height: candleHeight,
                baseY: -0.03 * scale
            });
            
            const pointsPerCandle = Math.floor(candlePoints / numCandles);
            
            for (let i = 0; i < pointsPerCandle; i++) {
                const theta = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * 0.015 * scale;
                const h = Math.random() * candleHeight;
                
                const x = candleX + r * Math.cos(theta);
                const y = -0.03 * scale + h;
                const z = candleZ + r * Math.sin(theta);
                
                positions.push(x, y, z);
            }
        }
        
        // Tạo lửa nến
        for (let candleIndex = 0; candleIndex < numCandles; candleIndex++) {
            const candle = candlePositions[candleIndex];
            const flameBaseY = candle.baseY + candle.height + 0.01 * scale;
            const pointsPerFlame = Math.floor(flamePoints / numCandles);
            
            for (let i = 0; i < pointsPerFlame; i++) {
                const t = Math.random();
                const flameHeight = 0.08 * scale;
                const flameWidth = 0.012 * scale * (1 - t * 0.7);
                
                const theta = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * flameWidth;
                
                const x = candle.x + r * Math.cos(theta);
                const y = flameBaseY + t * flameHeight;
                const z = candle.z + r * Math.sin(theta);
                
                positions.push(x, y, z);
            }
        }
    }
    
    createParticleSystem(scene) {
        const particleCount = responsiveManager.getConfig(CAKE_CONFIG.particles);
        
        this.geometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Vị trí ban đầu random
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = -8 + Math.random() * 4;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            this.setParticleColor(colors, sizes, i, particleCount);
        }
        
        this.initialPositions = Array.from(positions);
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        this.createMaterial();
        
        this.particleSystem = new THREE.Points(this.geometry, this.material);
        scene.add(this.particleSystem);
        
        this.positions = this.generateCakeShape(particleCount);
    }
    
    setParticleColor(colors, sizes, i, particleCount) {
        const particleIndex = i / particleCount;
        const i3 = i * 3;
        let color;
        
        const config = CAKE_CONFIG.colors;
        const sizeConfig = responsiveManager.getConfig(CAKE_CONFIG.particleSize);
        
        if (particleIndex < 0.70) {
            const cakeProgress = (particleIndex / 0.70);
            
            if (cakeProgress < 1/3) {
                color = new THREE.Color(config.blue.r, config.blue.g, config.blue.b);
            } else if (cakeProgress < 2/3) {
                color = new THREE.Color(config.pink.r, config.pink.g, config.pink.b);
            } else {
                color = new THREE.Color(config.white.r, config.white.g, config.white.b);
            }
            
            sizes[i] = sizeConfig.min + Math.random() * (sizeConfig.max - sizeConfig.min);
        } else if (particleIndex < 0.95) {
            // Nến
            color = new THREE.Color(1.0, 0.5, 0.7);
            sizes[i] = sizeConfig.min * 0.9 + Math.random() * (sizeConfig.max * 0.8);
        } else {
            // Lửa
            const flameColor = config.flame[Math.floor(Math.random() * config.flame.length)];
            color = new THREE.Color(flameColor.r, flameColor.g, flameColor.b);
            sizes[i] = sizeConfig.max + Math.random() * sizeConfig.max;
        }
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    createMaterial() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        this.material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            map: texture,
            alphaTest: 0.1,
            sizeAttenuation: true
        });
    }
}

// Export instance
const cakeEffect = new CakeEffect();
