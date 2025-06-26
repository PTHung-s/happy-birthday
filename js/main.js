// ===== MAIN APPLICATION =====

class BirthdayApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.musicStarted = false;
        
        this.init();
    }
    
    init() {
        this.setupThreeJS();
        this.setupLighting();
        this.setupCamera();
        this.setupRenderer();
        
        // Initialize effects
        cakeEffect.createParticleSystem(this.scene);
        heartEffect.init();
        
        // Setup responsive callbacks
        responsiveManager.onResize = () => {
            this.onWindowResize();
            heartEffect.resize();
        };
        
        // Start animation
        this.animate();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start cake formation after delay
        setTimeout(() => {
            this.startCakeFormation();
        }, 1000);
        
        // Áp dụng cài đặt tự động từ responsive manager
        setTimeout(() => {
            responsiveManager.applyAutoSettings();
            birthdayControls.updateControlsFromConfig();
            console.log('🎂 Auto-responsive settings applied successfully!');
        }, 500);
        
        // Load saved settings (chỉ khi ở developer mode)
        // birthdayControls.loadSettings();
    }
    
    setupThreeJS() {
        this.scene = new THREE.Scene();
    }
    
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        const cameraPos = responsiveManager.getCameraPosition();
        this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
            antialias: true,
            alpha: true
        });
        
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        this.setupMusicControl();
    }
    
    setupMusicControl() {
        const music = document.getElementById('music');
        const notice = document.getElementById('clickNotice');
        
        // Tự động thử phát nhạc ngay khi load
        setTimeout(() => {
            this.tryAutoPlayMusic();
        }, 1000);
        
        // Show notice after delay (backup nếu autoplay fail)
        setTimeout(() => {
            if (!this.musicStarted) {
                notice.classList.add('show');
            }
        }, 3000);
        
        // Handle click to play music (backup)
        const handleFirstClick = () => {
            if (!this.musicStarted) {
                music.play().catch(e => {
                    console.log('Cannot play music - file may be missing:', e);
                });
                this.musicStarted = true;
                notice.style.opacity = '0';
                setTimeout(() => {
                    notice.style.display = 'none';
                }, 500);
            }
            window.removeEventListener('click', handleFirstClick);
        };
        
        window.addEventListener('click', handleFirstClick);
    }
    
    tryAutoPlayMusic() {
        const music = document.getElementById('music');
        const notice = document.getElementById('clickNotice');
        
        // Thử autoplay với volume thấp trước
        music.volume = 0.1;
        music.muted = false;
        
        music.play()
            .then(() => {
                // Autoplay thành công
                this.musicStarted = true;
                notice.style.display = 'none';
                
                // Tăng dần volume
                let volume = 0.1;
                const volumeInterval = setInterval(() => {
                    volume += 0.05;
                    music.volume = Math.min(volume, 0.7);
                    if (volume >= 0.7) {
                        clearInterval(volumeInterval);
                    }
                }, 200);
                
                console.log('🎵 Music auto-started successfully!');
            })
            .catch(e => {
                // Autoplay thất bại (browser policy)
                console.log('🔇 Autoplay blocked by browser, waiting for user interaction');
                
                // Thử với interaction events
                const tryPlayOnInteraction = () => {
                    music.play().then(() => {
                        this.musicStarted = true;
                        notice.style.opacity = '0';
                        setTimeout(() => notice.style.display = 'none', 500);
                        
                        // Tăng volume
                        music.volume = 0.7;
                        console.log('🎵 Music started after interaction!');
                    }).catch(err => console.log('Music play error:', err));
                };
                
                // Listen for any user interaction
                ['click', 'touchstart', 'keydown'].forEach(event => {
                    document.addEventListener(event, tryPlayOnInteraction, { once: true });
                });
            });
    }
    
    startCakeFormation() {
        if (!cakeEffect.particleSystem) return;
        
        const positions = cakeEffect.particleSystem.geometry.attributes.position.array;
        
        // Animate particles to cake positions
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            
            if (particleIndex < cakeEffect.positions.length / 3) {
                const targetX = cakeEffect.positions[i];
                const targetY = cakeEffect.positions[i + 1];
                const targetZ = cakeEffect.positions[i + 2];
                
                gsap.to(positions, {
                    duration: 4 + Math.random() * 2,
                    ease: "power2.inOut",
                    [i]: targetX,
                    [i + 1]: targetY,
                    [i + 2]: targetZ,
                    delay: Math.random() * 3,
                    onUpdate: () => {
                        cakeEffect.particleSystem.geometry.attributes.position.needsUpdate = true;
                    }
                });
            }
        }
        
        // Start cake effects after formation
        setTimeout(() => {
            this.startCakeEffects();
        }, 7000);
    }
    
    startCakeEffects() {
        // Rotation animation
        if (cakeEffect.particleSystem) {
            gsap.to(cakeEffect.particleSystem.rotation, {
                duration: 50,
                y: Math.PI * 2,
                repeat: -1,
                ease: "none"
            });
            
            gsap.to(cakeEffect.particleSystem.rotation, {
                duration: 60,
                x: Math.PI * 0.1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        // Start candle flicker
        setInterval(() => {
            this.flickerCandles();
        }, 300);
        
        // Start celebration effects
        setInterval(() => {
            this.createCelebrationEffect();
        }, 5000);
    }
    
    flickerCandles() {
        if (!cakeEffect.particleSystem) return;
        
        const positions = cakeEffect.particleSystem.geometry.attributes.position.array;
        const colors = cakeEffect.particleSystem.geometry.attributes.color.array;
        const particleCount = cakeEffect.particleSystem.geometry.attributes.position.count;
        
        const flameStartParticleIndex = Math.floor(particleCount * 0.95);
        
        for (let i = flameStartParticleIndex * 3; i < positions.length; i += 3) {
            if (Math.random() < 0.3) {
                const colorIndex = i;
                
                const intensity = 0.8 + Math.random() * 0.2;
                colors[colorIndex] = intensity;
                colors[colorIndex + 1] = intensity * (0.3 + Math.random() * 0.4);
                colors[colorIndex + 2] = intensity * Math.random() * 0.2;
                
                positions[i] += (Math.random() - 0.5) * 0.005;
                positions[i + 1] += Math.random() * 0.008;
                positions[i + 2] += (Math.random() - 0.5) * 0.005;
            }
        }
        
        cakeEffect.particleSystem.geometry.attributes.position.needsUpdate = true;
        cakeEffect.particleSystem.geometry.attributes.color.needsUpdate = true;
    }
    
    createCelebrationEffect() {
        if (!cakeEffect.particleSystem) return;
        
        const positions = cakeEffect.particleSystem.geometry.attributes.position.array;
        const tempPositions = [...positions];
        
        for (let i = 0; i < positions.length; i += 3) {
            if (Math.random() < 0.08) {
                const centerX = tempPositions[i];
                const centerY = tempPositions[i + 1];
                const centerZ = tempPositions[i + 2];
                
                const circleRadius = 0.8 + Math.random() * 0.6;
                const angle = Math.random() * Math.PI * 2;
                const height = Math.random() * 0.5;
                
                const targetX = centerX + circleRadius * Math.cos(angle);
                const targetY = centerY + height;
                const targetZ = centerZ + circleRadius * Math.sin(angle);
                
                gsap.to(positions, {
                    duration: 3,
                    [i]: targetX,
                    [i + 1]: targetY,
                    [i + 2]: targetZ,
                    ease: "power2.out",
                    onUpdate: () => {
                        cakeEffect.particleSystem.geometry.attributes.position.needsUpdate = true;
                    },
                    onComplete: () => {
                        // Return animation
                        gsap.to(positions, {
                            duration: 2,
                            [i]: tempPositions[i],
                            [i + 1]: tempPositions[i + 1],
                            [i + 2]: tempPositions[i + 2],
                            ease: "power1.inOut",
                            onUpdate: () => {
                                cakeEffect.particleSystem.geometry.attributes.position.needsUpdate = true;
                            }
                        });
                    }
                });
            }
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Camera orbit animation
        const time = Date.now() * 0.0008;
        const radius = 4;
        this.camera.position.x = Math.sin(time) * radius;
        this.camera.position.y = 0.2 + Math.sin(time * 0.5) * 0.3;
        this.camera.position.z = Math.cos(time) * radius;
        this.camera.lookAt(0, -0.1, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update camera position for new device type
        const cameraPos = responsiveManager.getCameraPosition();
        this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        
        // Tự động áp dụng cài đặt responsive khi resize
        setTimeout(() => {
            responsiveManager.applyAutoSettings();
            birthdayControls.updateControlsFromConfig();
            console.log('🔄 Auto-resize applied:', responsiveManager.deviceType);
        }, 100);
    }
}

// Initialize app when page loads
window.addEventListener('load', () => {
    window.birthdayApp = new BirthdayApp();
    window.heartEffect = heartEffect;
    window.cakeEffect = cakeEffect;
    window.birthdayControls = birthdayControls;
    
    console.log('🎂 Birthday App Loaded! Use these functions:');
    console.log('- setHeartSize(size)');
    console.log('- setHeartPosition(x, y)');
    console.log('- setCakeScale(scale)');
    console.log('- birthdayControls.applyPreset("mobile/tablet/desktop/romantic/party/minimal")');
});
