<div align="center">

# 🎓 CollegeMart

### The Campus Marketplace for Students

[![Live Website](https://img.shields.io/badge/Live%20Website-collegemart.in-4CAF50?style=for-the-badge&logo=globe)](https://collegemart.in)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**CollegeMart** is a full-stack campus marketplace where college students can buy and sell products within their campus community — fast, secure, and built for student life.

🌐 **[Visit collegemart.in](https://collegemart.in)**

</div>

---

## ✨ Features

- 🛒 **Buy & Sell** — List products and browse campus listings instantly
- 💬 **Real-time Chat** — Socket.IO powered in-app messaging between buyers and sellers
- 🔐 **Secure Auth** — JWT-based authentication with refresh tokens, CSRF protection, and token blacklisting
- 🏫 **College-based Filtering** — Browse listings specific to your college
- 🪙 **Coins Wallet** — In-app currency system for premium features
- 🔍 **Smart Search** — Full-text search with filters for price, condition, and category
- ❤️ **Favorites** — Save and revisit listings you love
- 📸 **Image Uploads** — Cloudinary-powered product image hosting
- 📊 **Admin Dashboard** — Manage users, products, colleges, offers, reviews, and analytics
- 🌙 **Dark / Light Mode** — System-aware theme with manual toggle
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL 8.0 |
| **Real-time** | Socket.IO |
| **Authentication** | JWT, bcrypt |
| **File Storage** | Cloudinary |
| **Email** | Nodemailer |
| **Security** | Helmet, CSRF, Rate Limiting |
| **Deployment** | Docker, Vercel (frontend) |

---

## 📁 Project Structure

```
collegemart.in/
├── backend/                    # Node.js + Express API server
│   ├── src/
│   │   ├── config/             # Database & Cloudinary configuration
│   │   ├── middleware/         # Auth, CSRF, rate limiting, validation, error handling
│   │   ├── routes/             # Auth, products, messages, colleges
│   │   ├── data/               # Static college data
│   │   └── utils/              # Shared error utilities
│   ├── admin-routes.js         # Admin panel API routes
│   ├── server.js               # Express app entry point with Socket.IO
│   ├── database.sql            # Full database schema
│   └── package.json
│
├── frontend_clgmart/           # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Page and UI components
│   │   │   └── admin/          # Admin dashboard components
│   │   ├── context/            # Theme and Toast context providers
│   │   ├── services/           # Axios API service layer
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   └── constants/          # App-wide constants
│   ├── index.html
│   └── package.json
│
├── .env.example                # Environment variable template
├── Dockerfile                  # Docker deployment config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MySQL** 8.0+
- **npm** v9+

### 1. Clone the Repository

```bash
git clone https://github.com/piyushTripathi21/collegemart.in.git
cd collegemart.in
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=collegemart

# Auth
JWT_SECRET=your_jwt_secret_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here

# Server
PORT=5000
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Set Up the Database

```bash
mysql -u root -p < backend/database.sql
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend_clgmart
npm install
```

### 5. Run the Development Servers

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
> API runs on `http://localhost:5000`

**Frontend** (Terminal 2):
```bash
cd frontend_clgmart
npm run dev
```
> App runs on `http://localhost:3000`

---

## 🔌 API Reference

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT |
| `POST` | `/auth/logout` | Invalidate token |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |
| `GET`  | `/auth/verify-email` | Verify email address |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/products` | List products (with filters) |
| `GET`  | `/products/:id` | Get product details |
| `POST` | `/products` | Create a listing |
| `PUT`  | `/products/:id` | Update a listing |
| `DELETE` | `/products/:id` | Delete a listing |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/messages` | Get conversations |
| `POST` | `/messages` | Send a message |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health` | Health check |
| `GET`  | `/notifications` | Unread counts |

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts, profiles, wallet balance |
| `products` | Product listings with images and metadata |
| `categories` | Product categories |
| `messages` | Chat messages between users |
| `offers` | Buy/sell offers on listings |
| `reviews` | Product and seller reviews |
| `transactions` | Coin and wallet transaction history |
| `token_blacklist` | Invalidated JWT tokens |
| `colleges` | Supported college list |

---

## 🔒 Security

- JWT authentication with token blacklisting on logout
- CSRF token validation on all state-changing requests
- Route-specific rate limiting (login, register, search, messages)
- Helmet.js security headers with custom CSP
- SQL injection prevention via parameterized queries
- Input validation and sanitization middleware
- Automatic Socket.IO token expiry disconnect

---

## 🐳 Docker Deployment

```bash
docker build -t collegemart .
docker run -p 5000:5000 --env-file .env collegemart
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License © 2024–2026 CollegeMart

---

<div align="center">

Built with ❤️ for college students across India

🌐 **[collegemart.in](https://collegemart.in)**

</div>
