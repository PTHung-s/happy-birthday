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
        // Bắt đầu phát nhạc ngay lập tức
        this.initMusic();
        
        this.setupThreeJS();
        this.setupLighting();
        this.setupCamera();
        this.setupRenderer();

        // Initialize effects
        console.log('🎂 Initializing cake effect...');
        try {
            cakeEffect.createParticleSystem(this.scene);
            
            if (cakeEffect.particleSystem) {
                console.log('✅ Cake particle system created successfully');
                console.log('- Particle count:', cakeEffect.particleSystem.geometry.attributes.position.count);
                console.log('- Cake scale:', CAKE_CONFIG.scale);
                console.log('- Cake positions generated:', cakeEffect.positions.length / 3);
            } else {
                console.error('❌ Cake particle system is null!');
            }
        } catch (error) {
            console.error('❌ Error creating cake effect:', error);
        }
        
        console.log('❤️ Initializing heart effect...');
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
    
    initMusic() {
        const music = document.getElementById('music');
        
        // Đặt thuộc tính để tăng khả năng autoplay
        music.volume = 0.5;
        music.muted = false;
        music.preload = 'auto';
        
        // Thử phát nhạc ngay lập tức
        this.forceAutoPlayMusic();
        
        console.log('🎵 Music initialization started...');
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
        
        // Đặt camera ở vị trí có thể thấy bánh kem rõ ràng
        this.camera.position.set(0, 1, 4); // Đưa camera gần hơn
        this.camera.lookAt(0, 0, 0); // Nhìn về center
        
        console.log('📷 Camera positioned at:', this.camera.position);
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
        
        // Kiểm tra xem element có tồn tại không trước khi truy cập
        if (notice) {
            notice.style.display = 'none';
        }
        
        // Tự động phát nhạc ngay lập tức
        setTimeout(() => {
            this.forceAutoPlayMusic();
        }, 500);
        
        // Backup: thử lại nhiều lần nếu thất bại
        let retryCount = 0;
        const retryInterval = setInterval(() => {
            if (!this.musicStarted && retryCount < 5) {
                this.forceAutoPlayMusic();
                retryCount++;
            } else {
                clearInterval(retryInterval);
            }
        }, 1000);
    }
    
    forceAutoPlayMusic() {
        const music = document.getElementById('music');
        
        if (this.musicStarted) return;
        
        // Đặt volume mặc định
        music.volume = 0.5;
        music.muted = false;
        
        // Thử nhiều cách để phát nhạc
        const playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Thành công!
                    this.musicStarted = true;
                    console.log('🎵 Music auto-started successfully!');
                    
                    // Hiệu ứng fade in volume
                    music.volume = 0.1;
                    const fadeIn = setInterval(() => {
                        if (music.volume < 0.6) {
                            music.volume = Math.min(music.volume + 0.05, 0.6);
                        } else {
                            clearInterval(fadeIn);
                        }
                    }, 100);
                })
                .catch(error => {
                    console.log('🔇 Autoplay prevented, trying alternative methods...', error);
                    
                    // Thử với user gesture simulation
                    this.tryUserGesturePlay();
                });
        }
    }
    
    tryUserGesturePlay() {
        const music = document.getElementById('music');
        
        // Tạo một user gesture giả để trigger audio
        const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
        
        const playOnInteraction = () => {
            if (!this.musicStarted) {
                music.play().then(() => {
                    this.musicStarted = true;
                    console.log('🎵 Music started on user interaction!');
                    
                    // Remove listeners sau khi thành công
                    events.forEach(event => {
                        document.removeEventListener(event, playOnInteraction);
                    });
                }).catch(e => {
                    console.log('Still failed to play music:', e);
                });
            }
        };
        
        // Add listeners cho tất cả các user interactions
        events.forEach(event => {
            document.addEventListener(event, playOnInteraction, { once: true });
        });
        
        // Tự động trigger một fake interaction sau 2 giây
        setTimeout(() => {
            if (!this.musicStarted) {
                // Trigger a programmatic event
                const event = new Event('mousedown');
                document.dispatchEvent(event);
            }
        }, 2000);
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
    
    // Debug function để kiểm tra bánh kem
    debugCake() {
        console.log('=== CAKE DEBUG INFO ===');
        console.log('Scene objects:', this.scene.children.length);
        console.log('Cake particle system exists:', !!cakeEffect.particleSystem);
        
        if (cakeEffect.particleSystem) {
            console.log('Cake particle count:', cakeEffect.particleSystem.geometry.attributes.position.count);
            console.log('Cake positions array length:', cakeEffect.positions.length);
            console.log('Cake scale:', CAKE_CONFIG.scale);
            console.log('Cake position:', cakeEffect.particleSystem.position);
            console.log('Cake visible:', cakeEffect.particleSystem.visible);
            
            // Đưa camera về vị trí mặc định để thấy bánh kem
            this.camera.position.set(0, 1, 4);
            this.camera.lookAt(0, 0, 0);
            console.log('Camera reset to default position');
        } else {
            console.log('❌ No cake particle system found!');
            
            // Thử tạo lại bánh kem
            console.log('Attempting to recreate cake...');
            cakeEffect.createParticleSystem(this.scene);
            
            if (cakeEffect.particleSystem) {
                console.log('✅ Cake recreated successfully!');
            }
        }
        
        console.log('===================');
    }
}

// Initialize app when page loads
window.addEventListener('load', () => {
    window.birthdayApp = new BirthdayApp();
    window.heartEffect = heartEffect;
    window.cakeEffect = cakeEffect;
    window.birthdayControls = birthdayControls;
    
    // Debug functions
    window.debugCake = () => window.birthdayApp.debugCake();
    window.recreateCake = () => {
        if (window.birthdayApp && window.birthdayApp.scene) {
            cakeEffect.createParticleSystem(window.birthdayApp.scene);
            console.log('🎂 Cake recreated!');
        }
    };
    
    // Global quick fix functions
window.fixCake = function() {
    console.log('🔧 Fixing cake visibility...');
    
    // Reset camera position
    if (window.birthdayApp?.camera) {
        window.birthdayApp.camera.position.set(0, 0.5, 4);
        window.birthdayApp.camera.lookAt(0, 0, 0);
        console.log('📷 Camera reset to see cake');
    }
    
    // Reset cake scale
    if (window.CAKE_CONFIG) {
        window.CAKE_CONFIG.scale = 1.2;
        console.log('🎂 Cake scale reset to 1.2');
    }
    
    // Force recreate cake
    if (window.birthdayApp?.scene) {
        // Remove existing cake
        if (window.cakeEffect?.particleSystem) {
            window.birthdayApp.scene.remove(window.cakeEffect.particleSystem);
        }
        
        // Create new cake
        window.cakeEffect.createParticleSystem(window.birthdayApp.scene);
        
        // Start formation
        setTimeout(() => {
            window.birthdayApp.startCakeFormation();
        }, 1000);
        
        console.log('🎂 Cake recreated and formation started!');
    }
    
    console.log('✅ Cake fix complete! Check in a few seconds.');
};

    console.log('🎂 Birthday App Loaded! Use these functions:');
    console.log('- debugCake()        // Kiểm tra thông tin bánh kem');
    console.log('- recreateCake()     // Tạo lại bánh kem nếu bị mất');
    console.log('- setHeartSize(size)');
    console.log('- setHeartPosition(x, y)');
    console.log('- setCakeScale(scale)');
    console.log('- birthdayControls.applyPreset("mobile/tablet/desktop/romantic/party/minimal")');
});
