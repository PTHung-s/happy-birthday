Chắc chắn rồi! Để một AI (như GPT-4 với khả năng code, hoặc Copilot) có thể tạo ra một trang web với hiệu ứng tương tự như trong video, bạn cần cung cấp một prompt (yêu cầu) thật chi tiết và rõ ràng.

Dưới đây là một prompt mẫu được thiết kế để hướng dẫn AI từng bước. Bạn có thể sao chép và sử dụng nó.

---

### **Prompt chi tiết để AI tạo website hiệu ứng trái tim hạt phát sáng**

**Mục tiêu tổng thể:**
Tạo một trang web một trang (single-page) với nền đen hoàn toàn. Ở trung tâm trang web, hiển thị một hoạt ảnh 3D mượt mà và đẹp mắt: các hạt ánh sáng màu xanh lam tập hợp lại từ một mặt phẳng ở dưới cùng, xoáy lên để tạo thành một hình trái tim 3D, sau đó hình trái tim này "thở" nhẹ nhàng và liên tục. Toàn bộ hiệu ứng cần có ánh sáng lan tỏa (glow/bloom effect) để trông huyền ảo. Đồng thời, phát một bản nhạc piano nhẹ nhàng, du dương trong nền.

**Yêu cầu kỹ thuật:**
- **Công nghệ:** Sử dụng **HTML, CSS, và JavaScript**.
- **Thư viện đồ họa:** Bắt buộc sử dụng **Three.js** để xử lý đồ họa 3D và hệ thống hạt (particle system).
- **Thư viện hoạt ảnh (Tùy chọn nhưng khuyến khích):** Sử dụng **GSAP (GreenSock Animation Platform)** để điều khiển các chuỗi hoạt ảnh phức tạp một cách mượt mà và chính xác.
- **Tệp âm thanh:** Sử dụng một tệp âm thanh `background-music.mp3` (AI có thể giả định tệp này tồn tại trong cùng thư mục).

---

### **Chi tiết từng phần:**

**1. Cấu trúc tệp:**
Tạo 3 tệp:
- `index.html`: Chứa cấu trúc cơ bản của trang.
- `style.css`: Định dạng cho trang web (nền đen, canvas toàn màn hình).
- `script.js`: Chứa toàn bộ logic JavaScript và Three.js.

**2. HTML (`index.html`):**
- Một cấu trúc HTML5 cơ bản.
- Trong `<body>`, chỉ cần một thẻ `<canvas id="bg"></canvas>`.
- Thêm một thẻ `<audio id="music" src="background-music.mp3" loop></audio>` để chứa nhạc nền.
- Liên kết đến tệp `style.css`.
- Import thư viện `Three.js` và `GSAP` qua CDN.
- Liên kết đến tệp `script.js` (đặt ở cuối `<body>`).

**3. CSS (`style.css`):**
- Reset margin và padding của `body` và `html` về 0.
- Đặt `overflow: hidden;` để tránh thanh cuộn.
- Đặt `background-color: #000000;` cho `body`.
- Định dạng cho canvas `#bg` để nó chiếm toàn bộ màn hình:
  ```css
  #bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  ```

**4. JavaScript (`script.js`):**

**Bước 1: Khởi tạo Scene Three.js**
- Tạo một `Scene`, một `PerspectiveCamera`, và một `WebGLRenderer`.
- Gắn renderer vào canvas `#bg`.
- Cài đặt renderer để có kích thước bằng cửa sổ trình duyệt và xử lý việc thay đổi kích thước cửa sổ (resize).

**Bước 2: Tạo hệ thống hạt (Particle System)**
- **Nguồn hình dạng:** Để tạo hình trái tim 3D, cách tốt nhất là tải một model 3D đơn giản của hình trái tim (ví dụ, tệp `.gltf` hoặc `.obj`). Lấy tọa độ các đỉnh (vertices) từ model này để làm vị trí mục tiêu cho các hạt.
- **Số lượng hạt:** Tạo khoảng 10,000 - 20,000 hạt để hình trái tim trông dày dặn.
- **Tạo hạt:**
    - Tạo một `BufferGeometry`.
    - Tạo một mảng `positions` (Float32Array) để lưu trữ vị trí ban đầu của các hạt. Ban đầu, hãy rải các hạt ngẫu nhiên trên một mặt phẳng (`PlaneGeometry`) ở dưới cùng của màn hình.
- **Vật liệu cho hạt:**
    - Sử dụng `PointsMaterial`.
    - `size`: Đặt kích thước hạt nhỏ (ví dụ: `0.02`).
    - `color`: Màu xanh lam nhạt (ví dụ: `#00aaff`).
    - `transparent: true`.
    - `blending: THREE.AdditiveBlending` để các hạt chồng lên nhau sẽ sáng hơn.
    - `depthWrite: false` để tránh các vấn đề về sắp xếp độ sâu.
    - `map`: Sử dụng một texture hình tròn mờ (png) để các hạt trông mềm mại thay vì là hình vuông.
- Tạo một đối tượng `THREE.Points` từ geometry và material trên, sau đó thêm vào `Scene`.

**Bước 3: Hoạt ảnh (Animation) - Phần quan trọng nhất (Sử dụng GSAP)**
- Tạo một timeline GSAP để kiểm soát chuỗi hoạt ảnh.

- **Phase 1: Tập hợp và Xoáy lên (0-5 giây)**
    - Lấy vị trí các đỉnh từ model trái tim đã tải.
    - Sử dụng `gsap.to()` để di chuyển từng hạt từ vị trí ban đầu trên mặt phẳng đến vị trí tương ứng trên hình trái tim.
    - Thêm vào hiệu ứng `stagger` để các hạt di chuyển không đồng đều, tạo cảm giác tự nhiên.
    - Trong quá trình di chuyển, thêm một chút nhiễu (noise) hoặc chuyển động xoáy (sử dụng công thức sin/cos) vào đường đi của hạt để tạo ra hiệu ứng "cơn lốc" như trong video.

- **Phase 2: Trái tim "thở" (Lặp lại vô hạn)**
    - Sau khi Phase 1 hoàn thành, tạo một hoạt ảnh lặp vô hạn (`repeat: -1`, `yoyo: true`).
    - Hoạt ảnh này sẽ scale (phóng to/thu nhỏ) đối tượng `THREE.Points` một chút (ví dụ: từ scale 1.0 đến 1.1 và ngược lại) trong khoảng 3-4 giây. Điều này tạo ra hiệu ứng "thở" hoặc "đập" nhẹ nhàng.

- **Phase 3 (Nâng cao - Nếu có thể): Hiệu ứng tỏa ra**
    - Thỉnh thoảng (ví dụ sau mỗi 10 giây), kích hoạt một hoạt ảnh ngắn: các hạt tạm thời di chuyển ra khỏi hình trái tim theo các đường cong ngẫu nhiên rồi nhanh chóng quay trở lại vị trí cũ, giống như các tia lửa bắn ra trong video.

**Bước 4: Hiệu ứng hậu kỳ (Post-processing) - Tạo ánh sáng lan tỏa**
- Sử dụng `EffectComposer` của Three.js.
- Thêm một `RenderPass`.
- Thêm `UnrealBloomPass` để tạo hiệu ứng phát sáng (glow/bloom). Tinh chỉnh các thông số `threshold`, `strength`, và `radius` của `UnrealBloomPass` để đạt được độ sáng đẹp mắt, không quá chói.

**Bước 5: Vòng lặp Animation và Âm thanh**
- Tạo hàm `animate()` để gọi `renderer.render(scene, camera)` và `composer.render()` trong mỗi khung hình.
- Sử dụng `requestAnimationFrame(animate)` để tạo vòng lặp.
- Bắt đầu phát nhạc nền sau khi người dùng tương tác lần đầu (ví dụ: một cú nhấp chuột) để tuân thủ chính sách tự động phát của trình duyệt.
  ```javascript
  window.addEventListener('click', () => {
    document.getElementById('music').play();
  }, { once: true });
  ```

---

**Tóm tắt cho AI:** Hãy code một trang web nền đen, sử dụng Three.js và GSAP, tạo hoạt ảnh các hạt màu xanh phát sáng bay lên từ dưới để tạo thành một trái tim 3D. Trái tim này sau đó sẽ "thở" nhẹ nhàng. Áp dụng hiệu ứng `UnrealBloomPass` để làm cho nó phát sáng. Phát nhạc nền du dương khi người dùng tương tác.