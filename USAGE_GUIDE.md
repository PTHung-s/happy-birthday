# 🎂 HƯỚNG DẪN SỬ DỤNG BIRTHDAY APP

## 🎉 Tính Năng Mới Đã Thêm

### ✨ Tự Động Responsive
- Hệ thống tự động điều chỉnh kích thước phù hợp với mọi thiết bị
- Bánh kem luôn nhỏ hơn trái tim (60% kích thước trái tim)
- Không cần điều chỉnh thủ công

### 🎵 Tự Động Phát Nhạc
- Nhạc sẽ tự động phát khi vào trang web
- Nếu browser chặn autoplay, nhạc sẽ phát sau tương tác đầu tiên
- Volume tự động tăng dần từ thấp lên vừa phải

### 🎊 Hiệu Ứng Text Trang Trí
- Hiển thị "HAPPY BIRTHDAY" với hiệu ứng sáng
- Tên người sinh nhật được highlight đặc biệt
- Năm sinh "2006" với hiệu ứng lấp lánh
- Text tên và năm sinh bay xung quanh màn hình liên tục

## 🛠️ Cách Tùy Chỉnh Tên Sinh Nhật

### Phương Pháp 1: Qua URL Parameter
Thêm `?name=TÊN_NGƯỜI_SINH_NHẬT` vào cuối URL

**Ví dụ:**
```
file:///path/to/index.html?name=Minh
file:///path/to/index.html?name=Nguyễn%20Văn%20A
```

### Phương Pháp 2: Qua Console (F12)
Mở Developer Tools (F12) và gõ:
```javascript
setBirthdayName("Tên Mới");
setBirthYear("2005");
```

### Phương Pháp 3: Chỉnh Sửa Code
Trong file `js/text-effects.js`, dòng 7:
```javascript
this.birthdayName = "TÊN_BẠN_MUỐN";
```

## 🔧 Developer Mode

### Kích Hoạt Panel Điều Chỉnh
Nhấn `Ctrl + Shift + D` để bật/tắt panel điều chỉnh thủ công

### Tính Năng Panel
- Điều chỉnh kích thước bánh kem và trái tim
- Thay đổi vị trí, độ sáng, tốc độ
- Các preset nhanh cho mobile/tablet/desktop
- Reset về mặc định hoặc random

## 📱 Responsive Tự Động

### Mobile Portrait
- Trái tim: 60-80% kích thước gốc
- Bánh kem: 50-60% kích thước gốc
- Text nhỏ hơn, vị trí điều chỉnh

### Mobile Landscape
- Trái tim: 80-100% kích thước gốc
- Bánh kem: 60-70% kích thước gốc

### Tablet
- Trái tim: 90-110% kích thước gốc
- Bánh kem: 70-80% kích thước gốc

### Desktop
- 4K+: Trái tim 160%, Bánh kem 100%
- QHD: Trái tim 140%, Bánh kem 90%
- FHD: Trái tim 120%, Bánh kem 80%

## 🎨 Hiệu Ứng Màu Sắc

### Trái Tim
- Màu hồng-tím với hiệu ứng sáng
- Opacity tự động: Mobile 0.5, Desktop 0.4
- Tốc độ tự động: Mobile 0.8x, Desktop 1.2x

### Text
- "HAPPY BIRTHDAY": Hồng với hiệu ứng glow
- Tên: Vàng với hiệu ứng pulse
- Năm: Xanh cyan với hiệu ứng sparkle

## 📋 Troubleshooting

### Nhạc Không Phát
1. Kiểm tra file `background-music.mp3` có tồn tại
2. Thử refresh trang và click vào màn hình
3. Kiểm tra volume browser

### Text Không Hiển Thị Đúng
1. Kiểm tra encoding UTF-8
2. Thử đặt tên tiếng Anh đơn giản
3. Sử dụng URL encoding cho tên có dấu

### Performance Chậm
1. Developer Mode: Giảm số particles
2. Tự động: Hệ thống đã tối ưu cho từng thiết bị

## 🎯 Tips Sử dụng

1. **Cho Mobile**: Để màn hình dọc để trải nghiệm tốt nhất
2. **Cho Desktop**: Full screen để hiệu ứng đẹp nhất
3. **Cho Presentation**: Sử dụng trên màn hình lớn với speakers
4. **Tùy Chỉnh**: Dùng Developer Mode để fine-tune

---

**Tạo bởi:** Birthday App Auto-Responsive System  
**Version:** 2.0 - Full Auto Mode  
**Tương thích:** Mọi thiết bị và browser hiện đại
