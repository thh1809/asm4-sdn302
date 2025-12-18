# 🚀 Hướng Dẫn Chạy Nhanh

## Bước 1: Cài đặt MongoDB

### Option 1: MongoDB Local
1. Tải MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Cài đặt và chạy MongoDB service

### Option 2: MongoDB Atlas (Khuyến nghị - Miễn phí)
1. Đăng ký tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí (M0)
3. Tạo database user
4. Whitelist IP: 0.0.0.0/0 (cho phép tất cả)
5. Lấy connection string

## Bước 2: Setup Backend

```bash
# Vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo file .env
# Windows (PowerShell):
Copy-Item .env.example .env

# Mac/Linux:
cp .env.example .env

# Chỉnh sửa file .env:
# MONGODB_URI=mongodb://localhost:27017/quizapp
# Hoặc dùng MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/quizapp
# JWT_SECRET=your-secret-key-here
# PORT=5000

# Chạy server
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

## Bước 3: Setup Frontend

```bash
# Mở terminal mới, vào thư mục client
cd client

# Cài đặt dependencies
npm install

# Chạy frontend
npm start
```

Frontend sẽ tự động mở tại: http://localhost:3000

## Bước 4: Tạo tài khoản Admin

1. Đăng ký tài khoản mới qua frontend (http://localhost:3000/signup)
2. Vào MongoDB:
   - Nếu dùng MongoDB local: Mở MongoDB Compass hoặc mongo shell
   - Nếu dùng MongoDB Atlas: Vào "Browse Collections"
3. Tìm database `quizapp` → collection `users`
4. Tìm user vừa tạo và đổi `role: "user"` thành `role: "admin"`
5. Save

## Bước 5: Sử dụng

1. **User thường:**
   - Đăng nhập
   - Xem danh sách quiz
   - Làm quiz và xem kết quả

2. **Admin:**
   - Đăng nhập với tài khoản admin
   - Vào "Admin Dashboard"
   - Tạo quiz mới
   - Tạo câu hỏi cho quiz
   - Xóa quiz/câu hỏi

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to MongoDB"
- Kiểm tra MongoDB đang chạy (nếu dùng local)
- Kiểm tra connection string trong .env
- Nếu dùng Atlas, kiểm tra IP whitelist

### Lỗi: "Port 5000 already in use"
- Đổi PORT trong file .env
- Hoặc kill process đang dùng port 5000

### Lỗi: "Port 3000 already in use"
- React sẽ tự động hỏi dùng port khác
- Hoặc set PORT=3001 trong terminal

### Lỗi khi npm install
- Xóa node_modules và package-lock.json
- Chạy lại: `npm install`

## 📝 Test API

Sau khi chạy backend, test API:

```bash
# Test get quizzes
curl http://localhost:5000/api/quizzes

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'
```

## ✅ Checklist

- [ ] MongoDB đã chạy hoặc đã có Atlas connection string
- [ ] Backend đã chạy tại http://localhost:5000
- [ ] Frontend đã chạy tại http://localhost:3000
- [ ] Đã tạo tài khoản và đổi thành admin
- [ ] Đã test login/logout
- [ ] Đã tạo quiz và câu hỏi (admin)
- [ ] Đã làm quiz và xem kết quả (user)

---

**Chúc bạn code vui vẻ! 🎉**

