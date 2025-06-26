// ===== CẤU HÌNH CÓ THỂ ĐIỀU CHỈNH =====

// Cấu hình trái tim
const HEART_CONFIG = {
    // Kích thước cơ bản
    size: 1.5,
    offsetX: 0,
    offsetY: 0,
    
    // Số lượng hiệu ứng
    trails: {
        desktop: 32,
        tablet: 24,
        mobile: 16
    },
    
    particles: {
        desktop: 32,
        tablet: 24,
        mobile: 20
    },
    
    // Tốc độ và hiệu ứng
    speed: 1.0,
    opacity: 0.4,
    glowIntensity: 2.0,
    
    // Màu sắc (HSL)
    colors: {
        hueStart: 280,  // Tím
        hueRange: 80,   // Đến đỏ
        saturation: 60,
        brightness: 20
    }
};

// Cấu hình bánh kem
const CAKE_CONFIG = {
    // Kích thước tổng thể
    scale: 1.0,
    
    // Số lượng hạt
    particles: {
        desktop: 15000,
        tablet: 12000,
        mobile: 8000
    },
    
    // Kích thước hạt
    particleSize: {
        desktop: { min: 2.0, max: 4.5 },
        tablet: { min: 1.5, max: 3.5 },
        mobile: { min: 1.0, max: 2.5 }
    },
    
    // Tầng bánh
    layers: [
        { radius: 1.2, height: 0.2, y: -0.5, color: "blue" },
        { radius: 0.8, height: 0.15, y: -0.3, color: "pink" },
        { radius: 0.5, height: 0.12, y: -0.15, color: "white" }
    ],
    
    // Màu sắc sáng hơn
    colors: {
        blue: { r: 0.4, g: 0.7, b: 1.0 },
        pink: { r: 1.0, g: 0.6, b: 0.8 },
        white: { r: 1.0, g: 0.98, b: 0.95 },
        flame: [
            { r: 1.0, g: 1.0, b: 0.4 },
            { r: 1.0, g: 0.8, b: 0.3 },
            { r: 1.0, g: 0.6, b: 0.2 },
            { r: 1.0, g: 0.9, b: 0.5 }
        ]
    }
};

// Cấu hình camera - điều chỉnh để thấy bánh kem rõ hơn
const CAMERA_CONFIG = {
    desktop: { x: 0, y: 0.5, z: 4 }, // Đưa camera gần hơn và cao hơn
    tablet: { x: 0, y: 0.6, z: 4.5 },
    mobile: { x: 0, y: 0.7, z: 5 }
};

// Breakpoints responsive nâng cao
const BREAKPOINTS = {
    mobile: 480,
    mobileLarge: 640,
    tablet: 768,
    tabletLarge: 1024,
    desktop: 1200,
    desktopLarge: 1440,
    uhd: 1920
};
