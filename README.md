# Nampox Frontend - React + Serverless API

Webapp hiện đại sử dụng **React** và **Vercel Serverless Functions**, sẵn sàng deploy lên Vercel.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tech Stack](https://img.shields.io/badge/Vercel-Serverless-000?logo=vercel)

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173) để xem app.

### Build Production

```bash
npm run build
```

## 📁 Project Structure

```
Frontend/
├── api/                    # Serverless API endpoints
│   ├── hello.js           # GET /api/hello
│   ├── users.js           # GET/POST /api/users
│   └── time.js            # GET /api/time
├── public/                 # Static assets
├── src/
│   ├── App.jsx            # Main React component
│   ├── App.css            # Component styles
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── vercel.json            # Vercel configuration
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hello?name={name}` | API chào hỏi |
| GET | `/api/users` | Lấy danh sách users |
| POST | `/api/users` | Tạo user mới |
| GET | `/api/time` | Lấy thời gian server |

### Ví dụ Response

**GET /api/hello?name=Nampox**
```json
{
  "message": "Xin chào, Nampox! 👋",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "method": "GET"
}
```

**GET /api/users**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Nguyễn Văn A", "email": "vana@example.com", "role": "Admin" }
  ],
  "total": 4
}
```

## ▲ Deploy lên Vercel

### Cách 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy Production
vercel --prod
```

### Cách 2: GitHub Integration

1. Push code lên GitHub repository
2. Vào [vercel.com](https://vercel.com) và đăng nhập
3. Click **"New Project"**
4. Import repository từ GitHub
5. Click **"Deploy"**

Vercel sẽ tự động:
- Detect framework (Vite)
- Build app (`npm run build`)
- Deploy serverless functions từ `/api`
- Cung cấp domain miễn phí

### Cách 3: Drag & Drop

1. Build production: `npm run build`
2. Vào [vercel.com/new](https://vercel.com/new)
3. Kéo thả folder project

## ⚙️ Environment Variables

Nếu cần dùng environment variables (database, API keys), thêm vào Vercel Dashboard:

**Settings → Environment Variables**

```env
DATABASE_URL=your_database_url
API_SECRET=your_api_secret
```

Sử dụng trong serverless functions:
```javascript
const dbUrl = process.env.DATABASE_URL;
```

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 5
- **Backend**: Vercel Serverless Functions (Node.js)
- **Styling**: CSS3 (Custom Properties, Grid, Flexbox)
- **Fonts**: Outfit, JetBrains Mono
- **Hosting**: Vercel

## 📝 Tạo API Endpoint Mới

Tạo file trong folder `/api`:

```javascript
// api/example.js
export default function handler(req, res) {
  // GET request
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Hello from API!' 
    });
  }
  
  // POST request
  if (req.method === 'POST') {
    const { data } = req.body;
    return res.status(201).json({ 
      received: data 
    });
  }
  
  // Method not allowed
  return res.status(405).json({ 
    error: 'Method not allowed' 
  });
}
```

API sẽ available tại: `/api/example`

## 📄 License

MIT License - Sử dụng thoải mái!

---

Made with 💜 by **Nampox**

