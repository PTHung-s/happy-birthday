// ===== RESPONSIVE UTILITIES =====

class ResponsiveManager {
    constructor() {
        this.deviceType = 'desktop';
        this.isPortrait = false;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.aspectRatio = this.screenWidth / this.screenHeight;
        this.pixelDensity = window.devicePixelRatio || 1;
        
        this.detectDevice();
        this.setupEventListeners();
        this.applyAutoSettings();
    }
    
    detectDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.isPortrait = this.screenHeight > this.screenWidth;
        this.aspectRatio = this.screenWidth / this.screenHeight;
        this.pixelDensity = window.devicePixelRatio || 1;
        
        // Phát hiện device type với logic nâng cao
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(userAgent);
        
        // Logic phân loại thiết bị thông minh hơn
        if (isMobileUA && !isTabletUA && (isTouch || this.screenWidth <= BREAKPOINTS.mobile)) {
            this.deviceType = 'mobile';
        } else if ((isTabletUA || isTouch) && this.screenWidth <= BREAKPOINTS.tablet && this.screenWidth > BREAKPOINTS.mobile) {
            this.deviceType = 'tablet';
        } else if (this.screenWidth <= BREAKPOINTS.tablet) {
            this.deviceType = 'tablet';
        } else {
            this.deviceType = 'desktop';
        }
        
        // Debug info
        this.logDeviceInfo();
    }
    
    logDeviceInfo() {
        console.log(`
🎂 === BIRTHDAY AUTO-RESPONSIVE === 🎂
📱 Device Type: ${this.deviceType.toUpperCase()}
📏 Screen Size: ${this.screenWidth} x ${this.screenHeight}px
🔄 Orientation: ${this.isPortrait ? 'Portrait' : 'Landscape'}
📊 Aspect Ratio: ${this.aspectRatio.toFixed(2)}
🎯 Pixel Density: ${this.pixelDensity}x
⚙️ Auto Heart Size: ${this.getOptimalHeartSize().toFixed(2)}
🎂 Auto Cake Scale: ${this.getOptimalCakeScale().toFixed(2)}
✨ Auto Opacity: ${this.getOptimalHeartOpacity().toFixed(2)}
⚡ Auto Speed: ${this.getOptimalHeartSpeed().toFixed(2)}
========================================
        `);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.detectDevice();
            this.onResize();
        });
        
        // Listen for orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectDevice();
                this.onResize();
            }, 100);
        });
    }
    
    onResize() {
        this.applyAutoSettings();
        // Trigger effects update
        if (window.heartEffect && window.heartEffect.resize) {
            window.heartEffect.resize();
        }
        if (window.cakeEffect && window.cakeEffect.updateConfig) {
            window.cakeEffect.updateConfig();
        }
        if (window.textEffects && window.textEffects.updateForDevice) {
            window.textEffects.updateForDevice(this.deviceType);
        }
    }
    
    // Tự động áp dụng cài đặt tối ưu cho từng thiết bị
    applyAutoSettings() {
        // Tự động điều chỉnh cấu hình trái tim
        this.autoConfigureHeart();
        
        // Tự động điều chỉnh cấu hình bánh kem
        this.autoConfigureCake();
        
        // Hiển thị thông báo
        this.showAutoNotice();
        
        console.log('Auto-settings applied for', this.deviceType);
    }
    
    showAutoNotice() {
        const notice = document.getElementById('autoResponsiveNotice');
        const deviceTypeSpan = document.getElementById('deviceType');
        
        if (notice && deviceTypeSpan) {
            // Cập nhật text device type
            let deviceName = this.deviceType;
            if (this.deviceType === 'mobile') {
                deviceName = this.isPortrait ? 'điện thoại (dọc)' : 'điện thoại (ngang)';
            } else if (this.deviceType === 'tablet') {
                deviceName = this.isPortrait ? 'máy tính bảng (dọc)' : 'máy tính bảng (ngang)';
            } else {
                deviceName = 'máy tính';
            }
            
            deviceTypeSpan.textContent = deviceName;
            
            // Hiển thị thông báo
            notice.classList.add('show');
            
            // Ẩn sau 3 giây
            setTimeout(() => {
                notice.classList.add('fade-out');
                setTimeout(() => {
                    notice.classList.remove('show', 'fade-out');
                }, 300);
            }, 3000);
        }
    }
    
    autoConfigureHeart() {
        // Tính toán kích thước trái tim tự động dựa trên màn hình
        let autoSize = this.getOptimalHeartSize();
        let autoOffset = this.getOptimalHeartOffset();
        let autoOpacity = this.getOptimalHeartOpacity();
        let autoSpeed = this.getOptimalHeartSpeed();
        
        // Áp dụng tự động
        HEART_CONFIG.size = autoSize;
        HEART_CONFIG.offsetX = autoOffset.x;
        HEART_CONFIG.offsetY = autoOffset.y;
        HEART_CONFIG.opacity = autoOpacity;
        HEART_CONFIG.speed = autoSpeed;
    }
    
    autoConfigureCake() {
        // Tự động điều chỉnh scale bánh kem
        let autoScale = this.getOptimalCakeScale();
        CAKE_CONFIG.scale = autoScale;
    }
    
    getOptimalHeartSize() {
        let baseSize = 1.5;
        let sizeMultiplier = 1;
        
        // Dựa trên kích thước màn hình
        if (this.deviceType === 'mobile') {
            if (this.isPortrait) {
                // Portrait mobile - nhỏ hơn
                sizeMultiplier = Math.max(0.8, this.screenWidth / 600);
            } else {
                // Landscape mobile - vừa phải
                sizeMultiplier = Math.max(0.9, this.screenWidth / 800);
            }
        } else if (this.deviceType === 'tablet') {
            if (this.isPortrait) {
                sizeMultiplier = Math.max(0.9, this.screenWidth / 700);
            } else {
                sizeMultiplier = Math.max(1.1, this.screenWidth / 900);
            }
        } else {
            // Desktop - tự động scale theo resolution
            if (this.screenWidth >= 1920) {
                sizeMultiplier = 1.6; // 4K và cao hơn
            } else if (this.screenWidth >= 1440) {
                sizeMultiplier = 1.4; // QHD
            } else {
                sizeMultiplier = 1.2; // FHD và thấp hơn
            }
        }
        
        // Điều chỉnh theo aspect ratio
        if (this.aspectRatio < 1.2) {
            sizeMultiplier *= 0.8; // Màn hình vuông/dọc
        } else if (this.aspectRatio > 2.0) {
            sizeMultiplier *= 1.2; // Màn hình siêu rộng
        }
        
        return baseSize * sizeMultiplier;
    }
    
    getOptimalHeartOffset() {
        let offsetX = 0;
        let offsetY = 0;
        
        if (this.deviceType === 'mobile') {
            if (this.isPortrait) {
                offsetY = this.screenHeight * 0.05; // Hơi xuống dưới trên mobile dọc
            } else {
                offsetY = -this.screenHeight * 0.02; // Hơi lên trên mobile ngang
            }
        } else if (this.deviceType === 'tablet') {
            offsetY = this.screenHeight * 0.02;
        }
        
        return { x: offsetX, y: offsetY };
    }
    
    getOptimalHeartOpacity() {
        // Độ trong suốt tự động dựa trên thiết bị
        let baseOpacity = 0.4;
        
        if (this.deviceType === 'mobile') {
            baseOpacity = 0.5; // Sáng hơn trên mobile
        } else if (this.deviceType === 'tablet') {
            baseOpacity = 0.45;
        } else {
            baseOpacity = 0.4;
        }
        
        // Điều chỉnh theo pixel density
        if (this.pixelDensity > 2) {
            baseOpacity += 0.1; // Màn hình retina
        }
        
        return Math.min(1.0, baseOpacity);
    }
    
    getOptimalHeartSpeed() {
        // Tốc độ tự động dựa trên performance thiết bị
        let baseSpeed = 1.0;
        
        if (this.deviceType === 'mobile') {
            baseSpeed = 0.8; // Chậm hơn để tiết kiệm pin
        } else if (this.deviceType === 'tablet') {
            baseSpeed = 0.9;
        } else {
            baseSpeed = 1.2; // Desktop có thể xử lý nhanh hơn
        }
        
        return baseSpeed;
    }
    
    getOptimalCakeScale() {
        // Kích thước bánh kem vừa phải, luôn nhỏ hơn trái tim
        let baseScale = 1.0; // Quay về kích thước cơ bản
        
        if (this.deviceType === 'mobile') {
            if (this.isPortrait) {
                baseScale = Math.max(0.5, this.screenWidth / 600);
            } else {
                baseScale = Math.max(0.8, this.screenWidth / 800);
            }
        } else if (this.deviceType === 'tablet') {
            baseScale = Math.max(0.8, this.screenWidth / 900);
        } else {
            // Desktop - kích thước hợp lý
            if (this.screenWidth >= 1920) {
                baseScale = 1.3;
            } else if (this.screenWidth >= 1440) {
                baseScale = 1.2;
            } else {
                baseScale = 1.0;
            }
        }
        
        // Đảm bảo bánh kem nhỏ hơn trái tim
        let heartSize = this.getOptimalHeartSize();
        let maxCakeScale = heartSize * 0.6; // Bánh kem = 60% kích thước trái tim
        
        return Math.min(baseScale, maxCakeScale);
    }
    
    getConfig(configObj) {
        return configObj[this.deviceType] || configObj.desktop;
    }
    
    getHeartSize() {
        let baseSize = HEART_CONFIG.size;
        
        if (this.deviceType === 'mobile') {
            if (this.isPortrait) {
                baseSize = Math.min(0.8, this.screenWidth / 500);
            } else {
                baseSize = Math.min(1.0, this.screenWidth / 600);
            }
        } else if (this.deviceType === 'tablet') {
            baseSize = Math.min(1.2, this.screenWidth / 600);
        }
        
        return baseSize;
    }
    
    getHeartOffset() {
        let offsetY = HEART_CONFIG.offsetY;
        
        if (this.deviceType === 'mobile' && this.isPortrait) {
            offsetY = this.screenHeight * 0.1;
        }
        
        return {
            x: HEART_CONFIG.offsetX,
            y: offsetY
        };
    }
    
    getCameraPosition() {
        return this.getConfig(CAMERA_CONFIG);
    }
}

// Global debug function để kiểm tra bánh kem
window.debugCake = function() {
    console.log('=== 🎂 CAKE DEBUG INFO ===');
    console.log('Cake effect exists:', !!window.cakeEffect);
    console.log('Cake particle system:', !!window.cakeEffect?.particleSystem);
    
    if (window.cakeEffect?.particleSystem) {
        const cake = window.cakeEffect.particleSystem;
        console.log('Cake particle count:', cake.geometry.attributes.position.count);
        console.log('Cake scale:', window.CAKE_CONFIG.scale);
        console.log('Cake position:', cake.position);
        console.log('Cake visible:', cake.visible);
        console.log('Cake in scene:', window.app?.scene?.children.includes(cake));
    }
    
    if (window.app?.camera) {
        console.log('Camera position:', window.app.camera.position);
    }
    
    console.log('=================');
    
    // Force show cake if hidden
    if (window.cakeEffect?.particleSystem) {
        window.cakeEffect.particleSystem.visible = true;
        console.log('✅ Forced cake to be visible');
    }
};

console.log('🔧 Debug function available: debugCake()');

// Export instance
const responsiveManager = new ResponsiveManager();
