// ===== TEXT EFFECTS - HIỆU ỨNG CHỮ TRANG TRÍ =====

class TextEffectsManager {
    constructor() {
        this.birthdayName = "Đạt"; // Có thể thay đổi
        this.birthYear = "19";
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
        // Tăng tần suất tạo text - giảm thời gian interval
        this.floatingInterval = setInterval(() => {
            if (this.isActive) {
                // Tạo nhiều text cùng lúc
                this.createMultipleFloatingTexts();
            }
        }, 1000); // Giảm từ 2000ms xuống 1000ms = tăng gấp đôi tần suất
    }
    
    // Phương thức để điều chỉnh tần suất và số lượng text
    setTextDensity(density = 'normal') {
        if (this.floatingInterval) {
            clearInterval(this.floatingInterval);
        }
        
        let interval, minTexts, maxTexts;
        
        switch(density) {
            case 'light':
                interval = 3000; // 3 giây
                minTexts = 1;
                maxTexts = 2;
                break;
            case 'normal':
                interval = 1000; // 1 giây
                minTexts = 2;
                maxTexts = 4;
                break;
            case 'heavy':
                interval = 500; // 0.5 giây
                minTexts = 3;
                maxTexts = 6;
                break;
            case 'extreme':
                interval = 300; // 0.3 giây
                minTexts = 4;
                maxTexts = 8;
                break;
            default:
                interval = 1000;
                minTexts = 2;
                maxTexts = 4;
        }
        
        this.textSettings = { minTexts, maxTexts };
        
        this.floatingInterval = setInterval(() => {
            if (this.isActive) {
                this.createMultipleFloatingTexts();
            }
        }, interval);
        
        console.log(`🎨 Text density set to: ${density} (${interval}ms interval, ${minTexts}-${maxTexts} texts)`);
    }
    
    createMultipleFloatingTexts() {
        const settings = this.textSettings || { minTexts: 2, maxTexts: 10 };
        const count = Math.floor(Math.random() * (settings.maxTexts - settings.minTexts + 1)) + settings.minTexts;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createFloatingText();
            }, i * 200); // Delay mỗi text 200ms
        }
    }
    
    createFloatingText() {
        const container = document.getElementById('floatingTexts');
        if (!container) return;
        
        // Thêm nhiều loại text khác nhau
        const textOptions = [
            { text: this.birthdayName, class: 'floating-name', weight: 40 },
            { text: '2006', class: 'floating-year', weight: 30 },
            { text: '🎉', class: 'floating-emoji', weight: 10 },
            { text: '🎂', class: 'floating-emoji', weight: 8 },
            { text: '✨', class: 'floating-emoji', weight: 7 },
            { text: '🎈', class: 'floating-emoji', weight: 5 }
        ];
        
        // Weighted random selection
        const totalWeight = textOptions.reduce((sum, option) => sum + option.weight, 0);
        let randomNum = Math.random() * totalWeight;
        let selectedOption = textOptions[0];
        
        for (const option of textOptions) {
            randomNum -= option.weight;
            if (randomNum <= 0) {
                selectedOption = option;
                break;
            }
        }
        
        // Tạo element
        const textElement = document.createElement('div');
        textElement.className = `floating-text ${selectedOption.class}`;
        textElement.textContent = selectedOption.text;
        
        // Random vị trí bắt đầu (từ nhiều hướng khác nhau)
        const direction = Math.random();
        let startX, startY, endX, endY;
        
        if (direction < 0.25) {
            // Từ trái
            startX = -200;
            startY = Math.random() * window.innerHeight;
            endX = window.innerWidth + 200;
            endY = Math.random() * window.innerHeight;
        } else if (direction < 0.5) {
            // Từ phải
            startX = window.innerWidth + 200;
            startY = Math.random() * window.innerHeight;
            endX = -200;
            endY = Math.random() * window.innerHeight;
        } else if (direction < 0.75) {
            // Từ trên
            startX = Math.random() * window.innerWidth;
            startY = -100;
            endX = Math.random() * window.innerWidth;
            endY = window.innerHeight + 100;
        } else {
            // Từ dưới
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight + 100;
            endX = Math.random() * window.innerWidth;
            endY = -100;
        }
        
        const randomDelay = Math.random() * 2; // 0-2 giây delay
        
        // Thiết lập vị trí ban đầu
        textElement.style.left = startX + 'px';
        textElement.style.top = startY + 'px';
        textElement.style.animationDelay = randomDelay + 's';
        
        // Random thêm hiệu ứng
        const randomScale = 0.8 + Math.random() * 0.6; // 0.8 - 1.4
        const randomRotation = (Math.random() - 0.5) * 60; // -30 đến 30 độ
        textElement.style.transform = `scale(${randomScale}) rotate(${randomRotation}deg)`;
        
        // Random màu sắc cho emoji
        if (selectedOption.class === 'floating-emoji') {
            const hue = Math.random() * 360;
            textElement.style.filter = `hue-rotate(${hue}deg)`;
        }
        
        // Thêm vào container
        container.appendChild(textElement);
        
        // Animate đến vị trí cuối
        setTimeout(() => {
            textElement.style.transition = 'all 6s linear';
            textElement.style.left = endX + 'px';
            textElement.style.top = endY + 'px';
            textElement.style.opacity = '0';
        }, 100);
        
        // Xóa sau khi animation kết thúc
        setTimeout(() => {
            if (textElement && textElement.parentNode) {
                textElement.parentNode.removeChild(textElement);
            }
        }, 7000 + (randomDelay * 1000));
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

// Global functions để có thể gọi từ console hoặc developer tools
window.setBirthdayName = (name) => textEffects.setBirthdayName(name);
window.setBirthYear = (year) => textEffects.setBirthYear(year);
window.setTextDensity = (density) => textEffects.setTextDensity(density);

// Shortcut functions
window.lightTexts = () => textEffects.setTextDensity('light');
window.normalTexts = () => textEffects.setTextDensity('normal');
window.heavyTexts = () => textEffects.setTextDensity('heavy');
window.extremeTexts = () => textEffects.setTextDensity('extreme');

console.log(`
🎉 TEXT EFFECTS CONTROLS:
- setBirthdayName("Tên mới")  // Đổi tên
- setBirthYear("2006")        // Đổi năm sinh
- lightTexts()                // Ít text trang trí
- normalTexts()               // Bình thường (mặc định)
- heavyTexts()                // Nhiều text trang trí
- extremeTexts()              // Cực nhiều text trang trí
`);
