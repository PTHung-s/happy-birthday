// Biến toàn cục
let scene, camera, renderer;
let particles, particleSystem;
let cakePositions = [];
let candlePositions = [];
let flamePositions = [];
let initialPositions = [];
let musicStarted = false;
let trailSystems = []; // Lưu trữ các hệ thống vệt sáng

// Khởi tạo khi trang load
window.addEventListener('load', () => {
    init();
});

// Thiết lập ban đầu
function init() {
    // Tạo scene
    scene = new THREE.Scene();
    
    // Thêm ánh sáng để làm rõ chi tiết bánh
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Tạo camera với góc nhìn đẹp như trong hình mẫu
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.3, 5); // Góc nhìn hơi từ trên xuống
    
    // Tạo renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    
    // Tạo hệ thống hạt
    createParticleSystem();
    
    // Bắt đầu animation
    animate();
    
    // Xử lý resize window
    window.addEventListener('resize', onWindowResize);
    
    // Xử lý click để phát nhạc
    setupMusicControl();
    
    // Bắt đầu hoạt ảnh tập hợp thành bánh sinh nhật sau 1 giây
    setTimeout(() => {
        startCakeFormation();
    }, 1000);
}

// Tạo bánh sinh nhật theo mẫu với kem chảy và trang trí
function generateCakeShape(numPoints = 15000) { // Cập nhật số điểm
    const positions = [];
    
    // Phân chia: 70% bánh, 8% kem trang trí, 2% kẹo, 15% nến, 5% lửa
    const cakePoints = Math.floor(numPoints * 0.70);
    const creamDecorPoints = Math.floor(numPoints * 0.08);
    const candyDecorPoints = Math.floor(numPoints * 0.02);
    const candlePoints = Math.floor(numPoints * 0.15);
    const flamePoints = numPoints - cakePoints - creamDecorPoints - candyDecorPoints - candlePoints;
    
    // 1. TẠO 3 TẦNG BÁNH THON GỌN HƠN
    const layers = [
        { radius: 1.2, height: 0.2, y: -0.5, color: "blue" },    // Tầng dưới - nhỏ hơn
        { radius: 0.8, height: 0.15, y: -0.3, color: "pink" },   // Tầng giữa - thon hơn
        { radius: 0.5, height: 0.12, y: -0.15, color: "white" }   // Tầng trên - nhỏ gọn
    ];
    
    layers.forEach((layer, layerIndex) => {
        const pointsForLayer = Math.floor(cakePoints / layers.length); // Chia đều điểm cho các tầng
        
        // A. TẠO THÂN BÁNH CHẮC CHẮN
        const bodyPoints = Math.floor(pointsForLayer * 0.7); // Tăng tỷ lệ thân bánh
        for (let i = 0; i < bodyPoints; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * layer.radius * 0.85; // Thon gọn hơn
            const h = Math.random() * layer.height;
            
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            const y = layer.y + h;
            
            positions.push(x, y, z);
        }
        
        // B. TẠO VIỀN BÁNH SẮC NÉT
        const rimPoints = Math.floor(pointsForLayer * 0.25);
        for (let i = 0; i < rimPoints; i++) {
            const theta = (i / rimPoints) * Math.PI * 2;
            const r = layer.radius * (0.98 + Math.random() * 0.04); // Viền gọn hơn
            const h = Math.random() * layer.height;
            
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            const y = layer.y + h;
            
            positions.push(x, y, z);
        }
        
        // C. TẠO ÍT KEM CHẢY HƠN
        const dripPoints = Math.floor(pointsForLayer * 0.05); // Giảm từ 0.15 xuống 0.05
        for (let i = 0; i < dripPoints; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = layer.radius * (1.0 + Math.random() * 0.05); // Kem chảy ít hơn
            
            const dripLength = Math.random() * 0.08; // Giảm độ dài kem chảy
            const h = -dripLength;
            
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            const y = layer.y + h;
            
            positions.push(x, y, z);
        }
    });
    
    // D. TẠO KEM TRANG TRÍ TRÊN ĐỈNH (hoa kem)
    for (let i = 0; i < creamDecorPoints; i++) {
        // Tạo hoa kem xoắn ốc
        const t = (i / creamDecorPoints) * Math.PI * 4; // 2 vòng xoắn
        const r = 0.3 * (1 - (i / creamDecorPoints) * 0.5); // Thu nhỏ dần vào tâm
        const h = Math.sin(t * 2) * 0.05; // Độ cao sóng
        
        const x = r * Math.cos(t);
        const z = r * Math.sin(t);
        const y = 0.05 + h;
        
        positions.push(x, y, z);
        
        // Thêm hoa kem nhỏ ở các vị trí ngẫu nhiên
        if (Math.random() < 0.1) {
            const flowerR = 0.8 + Math.random() * 0.4;
            const flowerTheta = Math.random() * Math.PI * 2;
            const fx = flowerR * Math.cos(flowerTheta);
            const fz = flowerR * Math.sin(flowerTheta);
            const fy = 0.02 + Math.random() * 0.03;
            
            positions.push(fx, fy, fz);
        }
    }

    // E. TẠO KẸO TRÒN TRANG TRÍ
    const numCandies = 30; // Thêm 30 viên kẹo
    if (candyDecorPoints > numCandies) {
        const pointsPerCandy = Math.floor(candyDecorPoints / numCandies);
        for (let i = 0; i < numCandies; i++) {
            const layerIndex = Math.floor(Math.random() * layers.length);
            const layer = layers[layerIndex];
            
            const angle = Math.random() * Math.PI * 2;
            const r = layer.radius * (0.95 + Math.random() * 0.1); // Đặt ở mép ngoài
            const h = layer.y + Math.random() * layer.height;

            const candyCenterX = r * Math.cos(angle);
            const candyCenterZ = r * Math.sin(angle);
            const candyCenterY = h;
            const candyRadius = 0.04; // Kích thước kẹo

            for (let j = 0; j < pointsPerCandy; j++) {
                // Tạo hình cầu nhỏ cho mỗi viên kẹo
                const u = Math.random();
                const v = Math.random();
                const theta_s = 2 * Math.PI * u;
                const phi_s = Math.acos(2 * v - 1);
                
                const x = candyCenterX + candyRadius * Math.sin(phi_s) * Math.cos(theta_s);
                const y = candyCenterY + candyRadius * Math.cos(phi_s);
                const z = candyCenterZ + candyRadius * Math.sin(phi_s) * Math.sin(theta_s);

                positions.push(x, y, z);
            }
        }
    }
    
    // 2. TẠO NẾN HỒNG NHIỀU KÍCH THƯỚC - ĐẶT TRÊN BỀ MẶT BÁNH
    const candleHeights = [0.25, 0.30, 0.20, 0.35, 0.22, 0.28, 0.32]; // Nến nhỏ hơn
    const numCandles = candleHeights.length;
    const candleRadius = 0.015; // Nến mảnh hơn
    const topLayerRadius = 0.5; // Bán kính tầng trên cùng
    const topLayerY = -0.03; // Vị trí bề mặt tầng trên
    
    // Lưu vị trí nến để tạo lửa
    const candlePositions = [];
    
    for (let candleIndex = 0; candleIndex < numCandles; candleIndex++) {
        // Phân bố nến đều trên tầng bánh trên cùng
        const angle = (candleIndex / numCandles) * Math.PI * 2;
        const candleDistance = topLayerRadius * 0.7; // Đặt trong phạm vi tầng trên
        const candleX = candleDistance * Math.cos(angle);
        const candleZ = candleDistance * Math.sin(angle);
        const candleHeight = candleHeights[candleIndex];
        
        // Lưu vị trí để tạo lửa
        candlePositions.push({
            x: candleX,
            z: candleZ,
            height: candleHeight,
            baseY: topLayerY
        });
        
        const pointsPerCandle = Math.floor(candlePoints / numCandles);
        
        for (let i = 0; i < pointsPerCandle; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * candleRadius;
            const h = Math.random() * candleHeight;
            
            const x = candleX + r * Math.cos(theta);
            const y = topLayerY + h; // Bắt đầu từ bề mặt bánh
            const z = candleZ + r * Math.sin(theta);
            
            positions.push(x, y, z);
        }
    }
    
    // 3. TẠO LỬA NẾN VÀNG - LIÊN KẾT CHẶT VỚI NẾN
    for (let candleIndex = 0; candleIndex < numCandles; candleIndex++) {
        const candle = candlePositions[candleIndex];
        const flameBaseY = candle.baseY + candle.height + 0.01; // Sát đầu nến
        
        const pointsPerFlame = Math.floor(flamePoints / numCandles);
        
        for (let i = 0; i < pointsPerFlame; i++) {
            const t = Math.random();
            const flameHeight = 0.08; // Lửa nhỏ hơn
            const flameWidth = 0.012 * (1 - t * 0.7); // Hình lửa thon gọn
            
            const theta = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random()) * flameWidth;
            
            const x = candle.x + r * Math.cos(theta);
            const y = flameBaseY + t * flameHeight;
            const z = candle.z + r * Math.sin(theta);
            
            positions.push(x, y, z);
        }
    }
    
    return positions;
}

// Tạo hệ thống hạt cho bánh sinh nhật với vệt ánh sáng
function createParticleSystem() {
    const particleCount = 15000; // Giảm số lượng vì sẽ có trail
    
    // Tạo geometry chính
    const geometry = new THREE.BufferGeometry();
    
    // Vị trí ban đầu (rải ngẫu nhiên ở dưới)
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3); // Lưu vận tốc cho trail
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Vị trí ban đầu - rải ngẫu nhiên ở mặt phẳng dưới rộng hơn
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 1] = -8 + Math.random() * 4;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        // Vận tốc ban đầu
        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;
        
        // Màu sắc theo mẫu bánh: xanh-hồng-trắng với kem và trang trí
        const particleIndex = i / particleCount;
        let color;
        
        if (particleIndex < 0.70) {
            // 70% đầu: Các thành phần bánh
            const cakeProgress = (particleIndex / 0.70);
            
            if (cakeProgress < 1/3) {
                // Tầng dưới - Xanh dương pastel
                color = new THREE.Color(0.7, 0.85, 0.95);
            } else if (cakeProgress < 2/3) {
                // Tầng giữa - Hồng pastel
                color = new THREE.Color(0.95, 0.8, 0.9);
            } else {
                // Tầng trên - Trắng kem (bao gồm cả kem chảy)
                color = new THREE.Color(0.98, 0.96, 0.94);
            }
            
        } else if (particleIndex < 0.78) {
            // 8% tiếp theo: Kem trang trí và hoa - Hồng đậm hơn
            const decorColors = [
                new THREE.Color(0.95, 0.7, 0.8),  // Hồng đậm
                new THREE.Color(0.98, 0.95, 0.95), // Trắng kem
                new THREE.Color(0.9, 0.6, 0.7),   // Hồng đỏ
                new THREE.Color(0.85, 0.9, 0.98)  // Xanh nhạt
            ];
            color = decorColors[Math.floor(Math.random() * decorColors.length)];

        } else if (particleIndex < 0.80) {
            // 2% tiếp theo: Kẹo trang trí nhiều màu
            const candyColors = [
                new THREE.Color("gold"),
                new THREE.Color("cyan"),
                new THREE.Color("hotpink"),
                new THREE.Color("lightgreen"),
                new THREE.Color("orange")
            ];
            color = candyColors[Math.floor(Math.random() * candyColors.length)];

        } else if (particleIndex < 0.95) {
            // 15% tiếp theo: Nến hồng
            color = new THREE.Color(0.95, 0.7, 0.8); // Hồng nến
            
        } else {
            // 5% cuối: Lửa nến - Vàng cam
            const flameColors = [
                new THREE.Color(1.0, 0.9, 0.3),    // Vàng sáng
                new THREE.Color(1.0, 0.7, 0.2),    // Vàng cam
                new THREE.Color(1.0, 0.5, 0.1),    // Cam
                new THREE.Color(0.95, 0.8, 0.4)    // Vàng nhạt
            ];
            color = flameColors[Math.floor(Math.random() * flameColors.length)];
        }
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Kích thước hạt theo vị trí
        if (particleIndex < 0.80) {
            sizes[i] = 1.2 + Math.random() * 0.8; // Lớn hơn để thấy rõ trail
        } else if (particleIndex < 0.95) {
            sizes[i] = 0.8 + Math.random() * 0.4;
        } else {
            sizes[i] = 1.5 + Math.random() * 1.0; // Lửa sáng nhất
        }
    }
    
    // Lưu vị trí ban đầu
    initialPositions = Array.from(positions);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Tạo material cho hạt chính với hiệu ứng sáng
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Tạo gradient tròn sáng
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    // Material cho particle system chính
    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: texture,
        alphaTest: 0.1,
        sizeAttenuation: true
    });
    
    // Tạo particle system chính
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    // Tạo hệ thống vệt sáng cho một số hạt được chọn
    createTrailSystems(particleCount);
    
    // Tạo vị trí bánh sinh nhật
    cakePositions = generateCakeShape(particleCount);
}

// Tạo hệ thống vệt ánh sáng
function createTrailSystems(particleCount) {
    const trailCount = Math.floor(particleCount * 0.3); // 30% hạt có trail
    
    for (let i = 0; i < trailCount; i++) {
        const trailLength = 8; // Độ dài vệt
        const trailGeometry = new THREE.BufferGeometry();
        const trailPositions = new Float32Array(trailLength * 3);
        const trailColors = new Float32Array(trailLength * 3);
        
        // Khởi tạo vị trí trail
        const particleIndex = Math.floor(Math.random() * particleCount);
        const baseColor = new THREE.Color();
        baseColor.setRGB(
            particleSystem.geometry.attributes.color.array[particleIndex * 3],
            particleSystem.geometry.attributes.color.array[particleIndex * 3 + 1],
            particleSystem.geometry.attributes.color.array[particleIndex * 3 + 2]
        );
        
        for (let j = 0; j < trailLength; j++) {
            const j3 = j * 3;
            // Bắt đầu từ vị trí hạt
            trailPositions[j3] = particleSystem.geometry.attributes.position.array[particleIndex * 3];
            trailPositions[j3 + 1] = particleSystem.geometry.attributes.position.array[particleIndex * 3 + 1];
            trailPositions[j3 + 2] = particleSystem.geometry.attributes.position.array[particleIndex * 3 + 2];
            
            // Màu sắc giảm dần
            const alpha = (trailLength - j) / trailLength;
            trailColors[j3] = baseColor.r * alpha;
            trailColors[j3 + 1] = baseColor.g * alpha;
            trailColors[j3 + 2] = baseColor.b * alpha;
        }
        
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
        
        // Material cho vệt sáng
        const trailMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            linewidth: 2,
            depthWrite: false
        });
        
        const trailLine = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(trailLine);
        
        trailSystems.push({
            line: trailLine,
            particleIndex: particleIndex,
            positions: trailPositions,
            colors: trailColors,
            baseColor: baseColor,
            history: []
        });
    }
}

// Bắt đầu hoạt ảnh tập hợp thành bánh sinh nhật
function startCakeFormation() {
    const positions = particleSystem.geometry.attributes.position.array;
    
    // Animation tập hợp thành bánh sinh nhật
    for (let i = 0; i < positions.length; i += 3) {
        const particleIndex = i / 3;
        
        if (particleIndex < cakePositions.length / 3) {
            const targetX = cakePositions[i];
            const targetY = cakePositions[i + 1];
            const targetZ = cakePositions[i + 2];
            
            // Tạo đường đi xoáy lên như khói nến
            gsap.to(positions, {
                duration: 4 + Math.random() * 2,
                ease: "power2.inOut",
                [i]: targetX,
                [i + 1]: targetY,
                [i + 2]: targetZ,
                delay: Math.random() * 3,
                onUpdate: () => {
                    particleSystem.geometry.attributes.position.needsUpdate = true;
                }
            });
        }
    }
    
    // Bắt đầu hiệu ứng nến và pháo hoa sau 7 giây
    setTimeout(() => {
        startCandleEffect();
        startCelebrationEffect();
    }, 7000);
}

// Hiệu ứng xoay mượt mà và sợi sáng
function startCandleEffect() {
    // Loại bỏ hiệu ứng scale để không zoom ra vào
    // Chỉ giữ hiệu ứng xoay chậm
    gsap.to(particleSystem.rotation, {
        duration: 50,
        y: Math.PI * 2,
        repeat: -1,
        ease: "none"
    });
    
    // Thêm hiệu ứng xoay nhẹ theo trục X để tạo góc nhìn đẹp
    gsap.to(particleSystem.rotation, {
        duration: 60,
        x: Math.PI * 0.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Hiệu ứng lửa nến nhấp nháy
    setInterval(() => {
        flickerCandles();
    }, 300);
}

// Hiệu ứng lửa nến nhấp nháy - CẢI THIỆN VỊ TRÍ
function flickerCandles() {
    const positions = particleSystem.geometry.attributes.position.array;
    const colors = particleSystem.geometry.attributes.color.array;
    const particleCount = particleSystem.geometry.attributes.position.count;
    
    // Tạo hiệu ứng nhấp nháy cho các hạt lửa (5% cuối)
    const flameStartParticleIndex = Math.floor(particleCount * 0.95);
    
    for (let i = flameStartParticleIndex * 3; i < positions.length; i += 3) {
        if (Math.random() < 0.3) { // 30% cơ hội nhấp nháy
            const colorIndex = i;
            
            // Thay đổi màu sắc lửa
            const intensity = 0.8 + Math.random() * 0.2;
            colors[colorIndex] = intensity; // Red
            colors[colorIndex + 1] = intensity * (0.3 + Math.random() * 0.4); // Green
            colors[colorIndex + 2] = intensity * Math.random() * 0.2; // Blue
            
            // Thay đổi vị trí nhẹ (hiệu ứng lửa nhảy) - giảm cường độ
            positions[i] += (Math.random() - 0.5) * 0.005; // Giảm từ 0.01
            positions[i + 1] += Math.random() * 0.008; // Giảm từ 0.01, chỉ nhảy lên
            positions[i + 2] += (Math.random() - 0.5) * 0.005; // Giảm từ 0.01
        }
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.color.needsUpdate = true;
}

// Hiệu ứng pháo hoa sinh nhật
function startCelebrationEffect() {
    setInterval(() => {
        createFireworksEffect();
    }, 5000);
}

function createFireworksEffect() {
    const positions = particleSystem.geometry.attributes.position.array;
    const tempPositions = [...positions];
    
    // Tạo hiệu ứng pháo hoa theo quỹ đạo tròn
    for (let i = 0; i < positions.length; i += 3) {
        if (Math.random() < 0.08) {
            // Tạo quỹ đạo tròn thay vì nổ thẳng
            const centerX = tempPositions[i];
            const centerY = tempPositions[i + 1];
            const centerZ = tempPositions[i + 2];
            
            const circleRadius = 0.8 + Math.random() * 0.6;
            const angle = Math.random() * Math.PI * 2;
            const height = Math.random() * 0.5;
            
            const targetX = centerX + circleRadius * Math.cos(angle);
            const targetY = centerY + height;
            const targetZ = centerZ + circleRadius * Math.sin(angle);
            
            // Animation theo đường cong tròn
            gsap.to(positions, {
                duration: 3,
                [i]: targetX,
                [i + 1]: targetY,
                [i + 2]: targetZ,
                ease: "power2.out",
                onUpdate: () => {
                    particleSystem.geometry.attributes.position.needsUpdate = true;
                },
                onComplete: () => {
                    // Tạo quỹ đạo tròn về vị trí ban đầu
                    const returnAngle = angle + Math.PI;
                    const returnX = centerX + circleRadius * 0.5 * Math.cos(returnAngle);
                    const returnZ = centerZ + circleRadius * 0.5 * Math.sin(returnAngle);
                    
                    gsap.to(positions, {
                        duration: 2,
                        [i]: returnX,
                        [i + 1]: centerY,
                        [i + 2]: returnZ,
                        ease: "power2.inOut",
                        onUpdate: () => {
                            particleSystem.geometry.attributes.position.needsUpdate = true;
                        },
                        onComplete: () => {
                            // Quay về vị trí gốc
                            gsap.to(positions, {
                                duration: 1.5,
                                [i]: tempPositions[i],
                                [i + 1]: tempPositions[i + 1],
                                [i + 2]: tempPositions[i + 2],
                                ease: "power1.inOut",
                                onUpdate: () => {
                                    particleSystem.geometry.attributes.position.needsUpdate = true;
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}

// Thiết lập điều khiển nhạc
function setupMusicControl() {
    const music = document.getElementById('music');
    const notice = document.getElementById('clickNotice');
    
    // Hiển thị thông báo sau 2 giây
    setTimeout(() => {
        notice.classList.add('show');
    }, 2000);
    
    // Xử lý click để phát nhạc
    const handleFirstClick = () => {
        if (!musicStarted) {
            music.play().catch(e => {
                console.log('Không thể phát nhạc sinh nhật - có thể do không có file nhạc:', e);
            });
            musicStarted = true;
            notice.style.opacity = '0';
            setTimeout(() => {
                notice.style.display = 'none';
            }, 500);
        }
        window.removeEventListener('click', handleFirstClick);
    };
    
    window.addEventListener('click', handleFirstClick);
}

// Vòng lặp animation với quỹ đạo tròn và hiệu ứng vệt sáng
function animate() {
    requestAnimationFrame(animate);
    
    // Camera di chuyển theo quỹ đạo tròn quanh bánh
    const time = Date.now() * 0.0008;
    const radius = 4;
    camera.position.x = Math.sin(time) * radius;
    camera.position.y = 0.2 + Math.sin(time * 0.5) * 0.3; // Lên xuống nhẹ
    camera.position.z = Math.cos(time) * radius;
    camera.lookAt(0, -0.1, 0);
    
    // Cập nhật vệt sáng
    updateTrails();
    
    renderer.render(scene, camera);
}

// Cập nhật hệ thống vệt sáng
function updateTrails() {
    if (!particleSystem || trailSystems.length === 0) return;
    
    const positions = particleSystem.geometry.attributes.position.array;
    
    trailSystems.forEach(trail => {
        const particleIndex = trail.particleIndex;
        const currentPos = {
            x: positions[particleIndex * 3],
            y: positions[particleIndex * 3 + 1],
            z: positions[particleIndex * 3 + 2]
        };
        
        // Thêm vị trí hiện tại vào lịch sử
        trail.history.unshift(currentPos);
        
        // Giới hạn độ dài lịch sử
        const maxHistory = trail.positions.length / 3;
        if (trail.history.length > maxHistory) {
            trail.history.pop();
        }
        
        // Cập nhật vị trí vệt sáng
        for (let i = 0; i < trail.history.length && i < maxHistory; i++) {
            const i3 = i * 3;
            const pos = trail.history[i];
            
            trail.positions[i3] = pos.x;
            trail.positions[i3 + 1] = pos.y;
            trail.positions[i3 + 2] = pos.z;
            
            // Cập nhật độ sáng giảm dần
            const alpha = (maxHistory - i) / maxHistory;
            trail.colors[i3] = trail.baseColor.r * alpha;
            trail.colors[i3 + 1] = trail.baseColor.g * alpha;
            trail.colors[i3 + 2] = trail.baseColor.b * alpha;
        }
        
        // Đánh dấu cần update
        trail.line.geometry.attributes.position.needsUpdate = true;
        trail.line.geometry.attributes.color.needsUpdate = true;
    });
}

// Xử lý resize window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
