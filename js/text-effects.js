// ===== TEXT EFFECTS - HIỆU ỨNG CHỮ TRANG TRÍ =====

class TextEffectsManager {
    constructor() {
        this.birthdayName = "Tên Sinh Nhật"; // Có thể thay đổi
        this.birthYear = "2006";
        this.isActive = false;
        this.floatingInterval = null;
        
        this.init();
    }
    
    init() {
        // Lấy tên từ URL parameters nếu có
        this.getBirthdayNameFromURL();
        
        // Thiết lập tên ban đầu
        this.setupBirthdayName();
        
        // Bắt đầu hiệu ứng sau khi trang load
        setTimeout(() => {
            this.startTextEffects();
        }, 3000);
    }
    
    getBirthdayNameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        if (nameParam) {
            this.birthdayName = decodeURIComponent(nameParam);
        }
    }
    
    setupBirthdayName() {
        const nameElement = document.getElementById('birthdayName');
        if (nameElement) {
            nameElement.textContent = this.birthdayName;
        }
    }
    
    startTextEffects() {
        this.isActive = true;
        this.startFloatingTexts();
        console.log('🎉 Text effects started for', this.birthdayName);
    }
    
    startFloatingTexts() {
        this.floatingInterval = setInterval(() => {
            if (this.isActive) {
                this.createFloatingText();
            }
        }, 2000); // Tạo text mới mỗi 2 giây
    }
    
    createFloatingText() {
        const container = document.getElementById('floatingTexts');
        if (!container) return;
        
        // Random chọn giữa tên và năm sinh
        const isName = Math.random() > 0.4; // 60% là tên, 40% là năm
        const text = isName ? this.birthdayName : this.birthYear;
        const className = isName ? 'floating-name' : 'floating-year';
        
        // Tạo element
        const textElement = document.createElement('div');
        textElement.className = `floating-text ${className}`;
        textElement.textContent = text;
        
        // Random vị trí bắt đầu (bên trái màn hình)
        const startY = Math.random() * (window.innerHeight - 100);
        const randomDelay = Math.random() * 2; // 0-2 giây delay
        
        // Thiết lập vị trí
        textElement.style.left = '-200px';
        textElement.style.top = startY + 'px';
        textElement.style.animationDelay = randomDelay + 's';
        
        // Random thêm hiệu ứng
        if (Math.random() > 0.7) {
            textElement.style.transform = 'scale(1.2)';
        }
        
        // Thêm vào container
        container.appendChild(textElement);
        
        // Xóa sau khi animation kết thúc
        setTimeout(() => {
            if (textElement && textElement.parentNode) {
                textElement.parentNode.removeChild(textElement);
            }
        }, 8000 + (randomDelay * 1000));
    }
    
    stopTextEffects() {
        this.isActive = false;
        if (this.floatingInterval) {
            clearInterval(this.floatingInterval);
            this.floatingInterval = null;
        }
        
        // Xóa tất cả floating texts
        const container = document.getElementById('floatingTexts');
        if (container) {
            container.innerHTML = '';
        }
    }
    
    setBirthdayName(name) {
        this.birthdayName = name;
        this.setupBirthdayName();
        console.log('🎂 Birthday name updated to:', name);
    }
    
    setBirthYear(year) {
        this.birthYear = year;
        const yearElement = document.querySelector('.birth-year');
        if (yearElement) {
            yearElement.textContent = `✨ ${year} ✨`;
        }
        console.log('📅 Birth year updated to:', year);
    }
    
    // Responsive adjustments
    updateForDevice(deviceType) {
        const container = document.querySelector('.birthday-text-container');
        if (!container) return;
        
        if (deviceType === 'mobile') {
            container.style.top = '10%';
        } else if (deviceType === 'tablet') {
            container.style.top = '15%';
        } else {
            container.style.top = '20%';
        }
    }
}

// Export instance
const textEffects = new TextEffectsManager();

// Global functions để có thể gọi từ console
window.setBirthdayName = (name) => textEffects.setBirthdayName(name);
window.setBirthYear = (year) => textEffects.setBirthYear(year);
