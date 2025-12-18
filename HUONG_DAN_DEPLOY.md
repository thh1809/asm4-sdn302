# 📖 Hướng Dẫn Deploy Chi Tiết - Quiz App ASM4

## 🎯 Tổng Quan

Ứng dụng Quiz App này là một full-stack application, cần deploy cả backend và frontend riêng biệt.

---

## 🌟 Phần 1: Deploy Backend

### Option 1: Heroku (Khuyến nghị)

1. **Cài đặt Heroku CLI:**
   - Tải tại: https://devcenter.heroku.com/articles/heroku-cli
   - Hoặc: `npm install -g heroku-cli`

2. **Đăng nhập Heroku:**
   ```bash
   heroku login
   ```

3. **Tạo MongoDB Atlas (Miễn phí):**
   - Vào https://www.mongodb.com/cloud/atlas
   - Đăng ký/Đăng nhập
   - Tạo cluster miễn phí (M0)
   - Click "Connect" → "Connect your application"
   - Copy connection string (ví dụ: `mongodb+srv://user:pass@cluster.mongodb.net/quizapp`)

4. **Tạo Heroku App:**
   ```bash
   cd server
   heroku create your-quiz-app-backend
   ```

5. **Thiết lập Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   heroku config:set JWT_SECRET="your-random-secret-key-here"
   heroku config:set NODE_ENV="production"
   ```

6. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-quiz-app-backend
   git push heroku main
   ```

7. **Kiểm tra:**
   - Vào: `https://your-quiz-app-backend.herokuapp.com/api/quizzes`
   - Nếu thấy `[]` hoặc không lỗi là thành công!

### Option 2: Railway

1. **Đăng ký Railway:**
   - Vào https://railway.app
   - Đăng nhập bằng GitHub

2. **Tạo Project:**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

3. **Cấu hình:**
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Thêm Environment Variables:**
   - MONGODB_URI: (từ MongoDB Atlas)
   - JWT_SECRET: (random string)
   - PORT: (Railway tự động set)

5. **Deploy:**
   - Railway tự động deploy khi bạn push code

### Option 3: Render

1. **Đăng ký Render:**
   - Vào https://render.com
   - Đăng nhập bằng GitHub

2. **Tạo Web Service:**
   - Click "New" → "Web Service"
   - Connect GitHub repository

3. **Cấu hình:**
   - Name: `quiz-app-backend`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Root Directory: `server`

4. **Thêm Environment Variables:**
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV: `production`

5. **Deploy:**
   - Click "Create Web Service"
   - Render sẽ tự động deploy

---

## 🌟 Phần 2: Deploy Frontend

### Option 1: Vercel (Khuyến nghị)

1. **Cài đặt Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Vào thư mục client:**
   ```bash
   cd client
   ```

3. **Tạo file `.env.production`:**
   ```
   REACT_APP_API_URL=https://your-backend-url.herokuapp.com
   ```

4. **Cập nhật axios calls:**
   - Tạo file `client/src/config.js`:
   ```javascript
   export const API_URL = process.env.REACT_APP_API_URL || '';
   ```
   - Cập nhật các file actions để dùng `API_URL`

5. **Deploy:**
   ```bash
   vercel
   ```

6. **Hoặc deploy qua GitHub:**
   - Đẩy code lên GitHub
   - Vào https://vercel.com
   - Import project
   - Root Directory: `client`
   - Add Environment Variable: `REACT_APP_API_URL`

### Option 2: Netlify

1. **Build project:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy:**
   - Vào https://app.netlify.com/drop
   - Kéo thả thư mục `build`

3. **Hoặc qua GitHub:**
   - Connect GitHub repository
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
   - Add environment variable: `REACT_APP_API_URL`

### Option 3: GitHub Pages

1. **Cài đặt gh-pages:**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Cập nhật package.json:**
   ```json
   "homepage": "https://yourusername.github.io/quiz-app",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## 🔧 Cập nhật API URL trong Frontend

Sau khi deploy backend, cần cập nhật API URL trong frontend:

### Cách 1: Environment Variables (Khuyến nghị)

1. **Tạo file `client/src/config.js`:**
```javascript
export const API_URL = process.env.REACT_APP_API_URL || '';
```

2. **Cập nhật `client/src/actions/authActions.js`:**
```javascript
import axios from 'axios';
import { API_URL } from '../config';

// Thay tất cả '/api/' thành `${API_URL}/api/`
const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
```

3. **Làm tương tự cho `quizActions.js`**

### Cách 2: Proxy (Chỉ cho development)

Giữ nguyên code, chỉ thêm vào `client/package.json`:
```json
"proxy": "http://localhost:5000"
```

---

## ✅ Checklist Deploy

### Backend
- [ ] Đã tạo MongoDB Atlas cluster
- [ ] Đã lấy connection string
- [ ] Đã deploy backend lên Heroku/Railway/Render
- [ ] Đã test API endpoints
- [ ] Đã lưu backend URL

### Frontend
- [ ] Đã cập nhật API URL trong code
- [ ] Đã tạo file `.env.production`
- [ ] Đã build project thành công
- [ ] Đã deploy frontend
- [ ] Đã test login/signup
- [ ] Đã test làm quiz

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Cannot connect to MongoDB"
- **Nguyên nhân:** MONGODB_URI sai hoặc chưa whitelist IP
- **Giải pháp:** 
  - Kiểm tra connection string
  - Vào MongoDB Atlas → Network Access → Add IP Address (0.0.0.0/0 cho tất cả)

### Lỗi: "CORS error"
- **Nguyên nhân:** Backend chưa cho phép frontend domain
- **Giải pháp:** Kiểm tra `server/server.js` có `app.use(cors())`

### Lỗi: "404 Not Found" khi gọi API
- **Nguyên nhân:** API URL sai
- **Giải pháp:** Kiểm tra `REACT_APP_API_URL` và cập nhật code

### Lỗi: "Build failed"
- **Nguyên nhân:** Thiếu dependencies hoặc lỗi syntax
- **Giải pháp:** Test build local trước: `npm run build`

---

## 📝 Tạo Admin Account sau khi Deploy

1. **Đăng ký tài khoản mới qua frontend**

2. **Vào MongoDB Atlas:**
   - Click "Browse Collections"
   - Tìm collection `users`
   - Tìm user vừa tạo
   - Click "Edit Document"
   - Đổi `role: "user"` thành `role: "admin"`
   - Save

3. **Hoặc dùng MongoDB Compass:**
   - Connect với MongoDB Atlas
   - Tìm database `quizapp`
   - Collection `users`
   - Update document: `{ role: "admin" }`

---

## 💡 Tips

1. **MongoDB Atlas:** Dùng cluster miễn phí M0, đủ cho project này
2. **Heroku:** Free tier đã hết, nhưng có thể dùng Railway hoặc Render
3. **Vercel:** Free tier rất tốt cho frontend
4. **Environment Variables:** Luôn dùng biến môi trường, không hardcode
5. **Testing:** Test local trước khi deploy

---

**Chúc bạn deploy thành công! 🎉**
