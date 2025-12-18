<<<<<<< HEAD
# Quiz Application - ASM4

Full-stack Quiz Application được xây dựng với Node.js (Express + MongoDB) cho backend và React + Redux cho frontend.

## ✨ Tính năng

### Backend
- ✅ Express Server với RESTful API
- ✅ MongoDB với Mongoose ODM
- ✅ Authentication với JWT
- ✅ CRUD operations cho Quizzes và Questions
- ✅ Validation và Error Handling
- ✅ Phân quyền Admin/User

### Frontend
- ✅ React với Redux cho state management
- ✅ React Router cho client-side routing
- ✅ Authentication (Login, Signup, Logout)
- ✅ Hiển thị danh sách quiz
- ✅ Làm quiz và tính điểm
- ✅ Admin Dashboard để CRUD quizzes và questions
- ✅ Bootstrap 5 cho styling
- ✅ Responsive design

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js (v14 trở lên)
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

### Backend Setup

1. **Vào thư mục server:**
```bash
cd server
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env:**
```bash
cp .env.example .env
```

4. **Chỉnh sửa file .env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

5. **Chạy MongoDB:**
   - Nếu dùng MongoDB local, đảm bảo MongoDB đang chạy
   - Hoặc sử dụng MongoDB Atlas và cập nhật MONGODB_URI trong .env

6. **Chạy server:**
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5000`

### Frontend Setup

1. **Mở terminal mới, vào thư mục client:**
```bash
cd client
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Chạy frontend:**
```bash
npm start
```

Frontend sẽ chạy tại `http://localhost:3000`

## 📝 Tạo tài khoản Admin

Sau khi chạy server, bạn có thể tạo tài khoản admin bằng cách:

1. Đăng ký tài khoản mới qua frontend
2. Vào MongoDB và cập nhật role thành 'admin':
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Hoặc tạo trực tiếp trong MongoDB:
```javascript
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hash của password
  role: "admin"
})
```

## 🌐 Deploy

### Backend Deploy (Heroku, Railway, Render)

#### Option 1: Heroku

1. **Cài đặt Heroku CLI và đăng nhập:**
```bash
heroku login
```

2. **Tạo app:**
```bash
cd server
heroku create your-app-name
```

3. **Thiết lập MongoDB Atlas:**
   - Tạo cluster miễn phí tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Lấy connection string
   - Thêm vào Heroku config vars:
```bash
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET="your-secret-key"
```

4. **Deploy:**
```bash
git push heroku main
```

#### Option 2: Railway

1. Đăng ký tại [Railway](https://railway.app)
2. Tạo project mới
3. Deploy từ GitHub repository
4. Thêm environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - PORT (Railway tự động set)

#### Option 3: Render

1. Đăng ký tại [Render](https://render.com)
2. Tạo Web Service mới
3. Connect GitHub repository
4. Build command: `cd server && npm install`
5. Start command: `cd server && npm start`
6. Thêm environment variables

### Frontend Deploy (Vercel, Netlify)

#### Option 1: Vercel (Khuyến nghị)

1. **Cài đặt Vercel CLI:**
```bash
npm i -g vercel
```

2. **Vào thư mục client:**
```bash
cd client
```

3. **Deploy:**
```bash
vercel
```

4. **Cập nhật API URL:**
   - Tạo file `vercel.json` trong thư mục client:
```json
{
  "env": {
    "REACT_APP_API_URL": "https://your-backend-url.herokuapp.com"
  }
}
```

5. **Hoặc deploy qua GitHub:**
   - Đẩy code lên GitHub
   - Vào [vercel.com](https://vercel.com)
   - Import project
   - Set Root Directory: `client`
   - Add environment variable: `REACT_APP_API_URL`

#### Option 2: Netlify

1. **Build project:**
```bash
cd client
npm run build
```

2. **Deploy:**
   - Kéo thả thư mục `build` vào [Netlify Drop](https://app.netlify.com/drop)
   - Hoặc connect GitHub và set:
     - Build command: `cd client && npm install && npm run build`
     - Publish directory: `client/build`

3. **Thêm environment variable:**
   - REACT_APP_API_URL: URL của backend

### Cập nhật API URL trong Frontend

Nếu deploy frontend và backend ở các domain khác nhau, cần cập nhật API URL:

1. Tạo file `client/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.herokuapp.com
```

2. Cập nhật `client/src/actions/authActions.js` và `client/src/actions/quizActions.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || '';
axios.get(`${API_URL}/api/...`)
```

Hoặc sử dụng proxy trong `package.json` (chỉ hoạt động khi dev).

## 📁 Cấu trúc Project

```
asm4/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── Question.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── quizzes.js
│   │   └── questions.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── quiz/
│   │   │   ├── admin/
│   │   │   ├── layout/
│   │   │   └── routing/
│   │   ├── actions/
│   │   ├── reducers/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🧪 Test

### Test Backend API

Sử dụng Postman hoặc curl:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get Quizzes (cần token)
curl http://localhost:5000/api/quizzes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/signup` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Quizzes
- `GET /api/quizzes` - Lấy tất cả quizzes
- `GET /api/quizzes/:id` - Lấy quiz theo ID
- `POST /api/quizzes` - Tạo quiz mới (Admin only)
- `PUT /api/quizzes/:id` - Cập nhật quiz (Admin only)
- `DELETE /api/quizzes/:id` - Xóa quiz (Admin only)

### Questions
- `GET /api/questions/quiz/:quizId` - Lấy questions của quiz
- `GET /api/questions/:id` - Lấy question theo ID
- `POST /api/questions` - Tạo question mới (Admin only)
- `PUT /api/questions/:id` - Cập nhật question (Admin only)
- `DELETE /api/questions/:id` - Xóa question (Admin only)

## 🛠️ Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator

### Frontend
- React
- Redux
- React Router
- Axios
- Bootstrap 5
- React Bootstrap

## 👨‍💻 Tác giả

ASM4 - SDN302

## 📄 License

MIT
=======
# asm4-sdn302
>>>>>>> 03b596e21d0d19fb6d8a0bf2ed55c956144f5d7a
