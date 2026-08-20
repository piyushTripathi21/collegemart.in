# CollegeMart - Quick Start Guide

## ⚡ Fast Setup (3 Steps)

### Step 1️⃣ Database Setup
```bash
npm run setup-db
```

This will:
- Connect to your MySQL server
- Create the `collegemart` database
- Set up all tables with sample data
- Verify the setup

**If setup-db fails:**
1. Check if MySQL is running
2. Update `.env` file with your MySQL password:
   ```
   DB_PASSWORD=your_actual_password
   ```
3. Try again: `npm run setup-db`

### Step 2️⃣ Start Development Servers

**Option A: Run both concurrently**
```bash
npm run dev:full
```

**Option B: Run separately in two terminals**

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
npm run server
```

### Step 3️⃣ Open in Browser
```
http://localhost:3000
```

---

## 🔧 Configuration

### MySQL Connection (.env)
```
DB_HOST=localhost          # MySQL server address
DB_USER=root               # MySQL username
DB_PASSWORD=               # MySQL password (if any)
DB_NAME=collegemart        # Database name
PORT=5000                  # API server port
NODE_ENV=development       # Environment mode
```

**Important:** If your MySQL root user has a password, add it to `DB_PASSWORD`

---

## 📁 Project Structure

```
collegemart/
├── src/                    # React Frontend
│   ├── components/         # React components
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server.js               # Express API server
├── database.sql            # Database schema
├── setup-db.js             # Database setup script
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── .env                    # Environment variables
└── README.md               # Full documentation
```

---

## 🌐 Accessing the Application

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | React UI |
| **API** | http://localhost:5000 | Backend API |
| **Health Check** | http://localhost:5000/api/health | Test API |

---

## 📦 Available Commands

```bash
# Development
npm run dev              # Start React frontend (port 3000)
npm run server           # Start Express API (port 5000)
npm run dev:full        # Start both concurrently

# Production
npm run build            # Build React app
npm run preview          # Preview production build

# Database
npm run setup-db        # Initialize/reset database
```

---

## ✨ Features Included

✅ **Frontend (React)**
- Navbar with search, location, wishlist
- Category tabs with horizontal scroll
- Hero section with CTA buttons
- 12-category grid display
- 8-product listings with conditions
- Sell CTA card (featured position)
- Full responsive footer
- Mobile-friendly design

✅ **Backend (Express API)**
- RESTful API endpoints
- MySQL database connection
- CORS enabled
- Body parser for JSON/form data
- Error handling
- Sample CRUD operations

✅ **Database (MySQL)**
- 8 predefined tables
- 8 sample users
- 8 sample products
- 12 categories
- Indexes for performance

---

## 🎨 Design Features

**Colors Used:**
- Primary Dark: #002f34
- Primary Teal: #23e5db
- Background: #f2f4f5
- Featured Badge: #f6b200

**Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Components:**
- Sticky navbar (z-index: 100)
- Category pills (horizontal scroll)
- Product cards with hover effects
- Condition badges (Like New/Good/Fair)
- Social icons in footer
- App download badges

---

## 🚀 Performance Tips

1. **Database**: Indexes created for faster queries
2. **Frontend**: Using Vite for fast HMR
3. **Build**: Minified CSS with Tailwind
4. **API**: Connection pooling for MySQL

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Check MySQL is running
# Update .env with correct credentials
# Run: npm run setup-db
```

### "Port 3000 already in use"
```bash
# Vite will prompt to use different port
# Or manually: npm run dev -- --port 3001
```

### "Port 5000 already in use"
```bash
# Kill the process or use different port in server.js
```

### "CORS error when calling API"
```
# Make sure npm run server is running
# Check server.js CORS configuration
```

---

## 📚 API Examples

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Product by ID
```bash
curl http://localhost:5000/api/products/1
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Item","price":100,"condition":"Good","category":"Electronics","location":"IIT Delhi"}'
```

### Search Products
```bash
curl http://localhost:5000/api/search?q=laptop
```

---

## 🎯 Sample Data

**8 Sample Users:**
- Raj Kumar (IIT Delhi)
- Priya Singh (VIT Vellore)
- Arjun Patel (BITS Pilani)
- Neha Sharma (NIT Trichy)
- Rohit Kumar (Manipal)
- Sanya Gupta (Symbiosis Pune)
- Aditya Singh (DU North Campus)
- Meera Nair (Amity)

**8 Sample Products:**
1. Engineering Mathematics (₹450)
2. Dell Laptop (₹18,000)
3. Hero Cycle (₹2,500)
4. Sony Headphones (₹1,200)
5. Casio Calculator (₹350)
6. Study Table (₹800)
7. Nike Shoes (₹600)
8. Graphics Calculator (₹2,000)

---

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. Check `DATABASE_SETUP.md` for database-specific help
3. Review `.env` file for configuration issues
4. Verify MySQL is running
5. Check console for error messages

---

## ✅ Verification Checklist

- [ ] MySQL is installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Database setup completed (`npm run setup-db`)
- [ ] Frontend runs on port 3000
- [ ] Backend runs on port 5000
- [ ] API health check responds
- [ ] Products display in UI
- [ ] Responsive design works on mobile

---

Happy coding! 🎓✨
