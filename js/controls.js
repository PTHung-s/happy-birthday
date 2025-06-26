// ===== CONTROLS MODULE - ĐIỀU CHỈNH DỄ DÀNG =====

class BirthdayControls {
    constructor() {
        this.autoMode = true; // Bật chế độ tự động mặc định
        this.createControlPanel();
        this.setupEventListeners();
    }
    
    createControlPanel() {
        // Tạo CSS cho control panel
        const style = document.createElement('style');
        style.textContent = `
            .birthday-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 1000;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 250px;
                display: none; /* Ẩn mặc định */
            }
            
            .birthday-controls.show {
                display: block;
            }
            
            .control-group {
                margin-bottom: 15px;
            }
            
            .control-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #ff69b4;
            }
            
            .control-slider {
                width: 100%;
                margin-bottom: 5px;
            }
            
            .control-value {
                color: #fff;
                font-size: 11px;
            }
            
            .control-buttons {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
            }
            
            .control-btn {
                background: #ff69b4;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 10px;
            }
            
            .control-btn:hover {
                background: #ff1493;
            }
            
            .toggle-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 105, 180, 0.9);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 12px;
                z-index: 1001;
                backdrop-filter: blur(10px);
                display: none; /* Ẩn nút điều chỉnh */
            }
            
            .toggle-controls:hover {
                background: rgba(255, 20, 147, 0.9);
            }
            
            @media (max-width: 768px) {
                .birthday-controls {
                    right: 10px;
                    top: 10px;
                    max-width: 200px;
                    padding: 10px;
                }
                
                .toggle-controls {
                    right: 10px;
                    top: 10px;
                    padding: 8px 12px;
                    font-size: 11px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Tạo nút toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-controls';
        toggleBtn.textContent = '⚙️ Điều Chỉnh';
        toggleBtn.onclick = () => this.togglePanel();
        document.body.appendChild(toggleBtn);
        
        // Tạo control panel
        const panel = document.createElement('div');
        panel.className = 'birthday-controls';
        panel.id = 'birthdayControls';
        
        panel.innerHTML = `
            <div class="control-group">
                <label>🎂 Kích Thước Bánh Kem</label>
                <input type="range" class="control-slider" id="cakeScale" min="0.5" max="2.0" step="0.1" value="1.0">
                <div class="control-value" id="cakeScaleValue">1.0x</div>
            </div>
            
            <div class="control-group">
                <label>❤️ Kích Thước Trái Tim</label>
                <input type="range" class="control-slider" id="heartSize" min="0.3" max="3.0" step="0.1" value="1.5">
                <div class="control-value" id="heartSizeValue">1.5x</div>
            </div>
            
            <div class="control-group">
                <label>📍 Vị Trí Trái Tim Y</label>
                <input type="range" class="control-slider" id="heartOffsetY" min="-200" max="200" step="10" value="0">
                <div class="control-value" id="heartOffsetYValue">0px</div>
            </div>
            
            <div class="control-group">
                <label>🌟 Độ Sáng Trái Tim</label>
                <input type="range" class="control-slider" id="heartOpacity" min="0.1" max="1.0" step="0.1" value="0.4">
                <div class="control-value" id="heartOpacityValue">0.4</div>
            </div>
            
            <div class="control-group">
                <label>⚡ Tốc Độ Trái Tim</label>
                <input type="range" class="control-slider" id="heartSpeed" min="0.3" max="3.0" step="0.1" value="1.0">
                <div class="control-value" id="heartSpeedValue">1.0x</div>
            </div>
            
            <div class="control-group">
                <label>🎨 Presets Nhanh</label>
                <div class="control-buttons">
                    <button class="control-btn" onclick="birthdayControls.applyPreset('mobile')">📱 Mobile</button>
                    <button class="control-btn" onclick="birthdayControls.applyPreset('tablet')">🖥️ Tablet</button>
                    <button class="control-btn" onclick="birthdayControls.applyPreset('desktop')">💻 Desktop</button>
                    <button class="control-btn" onclick="birthdayControls.applyPreset('romantic')">💕 Lãng Mạn</button>
                    <button class="control-btn" onclick="birthdayControls.applyPreset('party')">🎉 Tiệc Tùng</button>
                    <button class="control-btn" onclick="birthdayControls.applyPreset('minimal')">✨ Tối Giản</button>
                </div>
            </div>
            
            <div class="control-group">
                <div class="control-buttons">
                    <button class="control-btn" onclick="birthdayControls.resetToDefaults()">🔄 Reset</button>
                    <button class="control-btn" onclick="birthdayControls.randomize()">🎲 Ngẫu Nhiên</button>
                    <button class="control-btn" onclick="birthdayControls.saveSettings()">💾 Lưu</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    setupEventListeners() {
        // Developer mode toggle (Ctrl + Shift + D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggleDeveloperMode();
            }
        });
        
        // Auto-update controls when responsive changes
        if (window.responsiveManager) {
            const originalOnResize = responsiveManager.onResize;
            responsiveManager.onResize = () => {
                originalOnResize.call(responsiveManager);
                this.updateControlsFromConfig();
            };
        }
        
        // Cake scale
        document.getElementById('cakeScale').addEventListener('input', (e) => {
            CAKE_CONFIG.scale = parseFloat(e.target.value);
            document.getElementById('cakeScaleValue').textContent = e.target.value + 'x';
            this.updateCake();
        });
        
        // Heart size
        document.getElementById('heartSize').addEventListener('input', (e) => {
            HEART_CONFIG.size = parseFloat(e.target.value);
            document.getElementById('heartSizeValue').textContent = e.target.value + 'x';
            this.updateHeart();
        });
        
        // Heart offset Y
        document.getElementById('heartOffsetY').addEventListener('input', (e) => {
            HEART_CONFIG.offsetY = parseInt(e.target.value);
            document.getElementById('heartOffsetYValue').textContent = e.target.value + 'px';
            this.updateHeart();
        });
        
        // Heart opacity
        document.getElementById('heartOpacity').addEventListener('input', (e) => {
            HEART_CONFIG.opacity = parseFloat(e.target.value);
            document.getElementById('heartOpacityValue').textContent = e.target.value;
            this.updateHeart();
        });
        
        // Heart speed
        document.getElementById('heartSpeed').addEventListener('input', (e) => {
            HEART_CONFIG.speed = parseFloat(e.target.value);
            document.getElementById('heartSpeedValue').textContent = e.target.value + 'x';
        });
    }
    
    togglePanel() {
        const panel = document.getElementById('birthdayControls');
        panel.classList.toggle('show');
    }
    
    toggleDeveloperMode() {
        const toggleBtn = document.querySelector('.toggle-controls');
        if (toggleBtn.style.display === 'none' || !toggleBtn.style.display) {
            toggleBtn.style.display = 'block';
            console.log('🛠️ Developer Mode ENABLED - Panel controls available');
        } else {
            toggleBtn.style.display = 'none';
            const panel = document.getElementById('birthdayControls');
            panel.classList.remove('show');
            console.log('🔒 Developer Mode DISABLED - Auto mode only');
        }
    }
    
    updateControlsFromConfig() {
        // Cập nhật UI controls để phản ánh config tự động
        if (document.getElementById('cakeScale')) {
            document.getElementById('cakeScale').value = CAKE_CONFIG.scale;
            document.getElementById('cakeScaleValue').textContent = CAKE_CONFIG.scale.toFixed(1) + 'x';
        }
        
        if (document.getElementById('heartSize')) {
            document.getElementById('heartSize').value = HEART_CONFIG.size;
            document.getElementById('heartSizeValue').textContent = HEART_CONFIG.size.toFixed(1) + 'x';
        }
        
        if (document.getElementById('heartOffsetY')) {
            document.getElementById('heartOffsetY').value = HEART_CONFIG.offsetY;
            document.getElementById('heartOffsetYValue').textContent = HEART_CONFIG.offsetY + 'px';
        }
        
        if (document.getElementById('heartOpacity')) {
            document.getElementById('heartOpacity').value = HEART_CONFIG.opacity;
            document.getElementById('heartOpacityValue').textContent = HEART_CONFIG.opacity.toFixed(1);
        }
        
        if (document.getElementById('heartSpeed')) {
            document.getElementById('heartSpeed').value = HEART_CONFIG.speed;
            document.getElementById('heartSpeedValue').textContent = HEART_CONFIG.speed.toFixed(1) + 'x';
        }
    }
    
    updateCake() {
        // Trigger cake update
        if (window.cakeEffect && window.cakeEffect.particleSystem) {
            // Logic to update cake
            console.log('Updating cake with scale:', CAKE_CONFIG.scale);
        }
    }
    
    updateHeart() {
        if (window.heartEffect) {
            heartEffect.updateConfig();
        }
    }
    
    applyPreset(preset) {
        const presets = {
            mobile: {
                heartSize: 0.8,
                heartOffsetY: 50,
                heartOpacity: 0.3,
                heartSpeed: 0.8,
                cakeScale: 0.7
            },
            tablet: {
                heartSize: 1.2,
                heartOffsetY: 20,
                heartOpacity: 0.4,
                heartSpeed: 1.0,
                cakeScale: 0.9
            },
            desktop: {
                heartSize: 1.5,
                heartOffsetY: 0,
                heartOpacity: 0.4,
                heartSpeed: 1.0,
                cakeScale: 1.0
            },
            romantic: {
                heartSize: 2.5,
                heartOffsetY: -30,
                heartOpacity: 0.6,
                heartSpeed: 0.7,
                cakeScale: 0.8
            },
            party: {
                heartSize: 2.0,
                heartOffsetY: 0,
                heartOpacity: 0.8,
                heartSpeed: 1.5,
                cakeScale: 1.2
            },
            minimal: {
                heartSize: 1.0,
                heartOffsetY: 80,
                heartOpacity: 0.2,
                heartSpeed: 0.5,
                cakeScale: 0.8
            }
        };
        
        const config = presets[preset];
        if (config) {
            this.applyConfig(config);
        }
    }
    
    applyConfig(config) {
        Object.assign(HEART_CONFIG, {
            size: config.heartSize,
            offsetY: config.heartOffsetY,
            opacity: config.heartOpacity,
            speed: config.heartSpeed
        });
        
        CAKE_CONFIG.scale = config.cakeScale;
        
        this.updateSliders();
        this.updateHeart();
        this.updateCake();
    }
    
    updateSliders() {
        document.getElementById('heartSize').value = HEART_CONFIG.size;
        document.getElementById('heartSizeValue').textContent = HEART_CONFIG.size + 'x';
        
        document.getElementById('heartOffsetY').value = HEART_CONFIG.offsetY;
        document.getElementById('heartOffsetYValue').textContent = HEART_CONFIG.offsetY + 'px';
        
        document.getElementById('heartOpacity').value = HEART_CONFIG.opacity;
        document.getElementById('heartOpacityValue').textContent = HEART_CONFIG.opacity;
        
        document.getElementById('heartSpeed').value = HEART_CONFIG.speed;
        document.getElementById('heartSpeedValue').textContent = HEART_CONFIG.speed + 'x';
        
        document.getElementById('cakeScale').value = CAKE_CONFIG.scale;
        document.getElementById('cakeScaleValue').textContent = CAKE_CONFIG.scale + 'x';
    }
    
    resetToDefaults() {
        this.applyConfig({
            heartSize: 1.5,
            heartOffsetY: 0,
            heartOpacity: 0.4,
            heartSpeed: 1.0,
            cakeScale: 1.0
        });
    }
    
    randomize() {
        this.applyConfig({
            heartSize: 0.5 + Math.random() * 2.5,
            heartOffsetY: -100 + Math.random() * 200,
            heartOpacity: 0.2 + Math.random() * 0.6,
            heartSpeed: 0.5 + Math.random() * 2.0,
            cakeScale: 0.6 + Math.random() * 1.4
        });
    }
    
    saveSettings() {
        const settings = {
            heartSize: HEART_CONFIG.size,
            heartOffsetY: HEART_CONFIG.offsetY,
            heartOpacity: HEART_CONFIG.opacity,
            heartSpeed: HEART_CONFIG.speed,
            cakeScale: CAKE_CONFIG.scale
        };
        
        localStorage.setItem('birthdaySettings', JSON.stringify(settings));
        alert('✅ Đã lưu cài đặt!');
    }
    
    loadSettings() {
        const saved = localStorage.getItem('birthdaySettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.applyConfig(settings);
        }
    }
}

// Global functions for easy console access
window.setHeartSize = (size) => {
    HEART_CONFIG.size = size;
    if (window.heartEffect) heartEffect.updateConfig();
    if (window.birthdayControls) birthdayControls.updateSliders();
};

window.setHeartPosition = (x, y) => {
    HEART_CONFIG.offsetX = x;
    HEART_CONFIG.offsetY = y;
    if (window.heartEffect) heartEffect.updateConfig();
    if (window.birthdayControls) birthdayControls.updateSliders();
};

window.setCakeScale = (scale) => {
    CAKE_CONFIG.scale = scale;
    if (window.birthdayControls) birthdayControls.updateSliders();
};

// Export instance
const birthdayControls = new BirthdayControls();
