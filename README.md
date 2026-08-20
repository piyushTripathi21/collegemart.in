# CollegeMart - Campus Marketplace

A responsive, modern marketplace website where college students can buy and sell products within their campus. Built as an OLX India-style clone specifically designed for student communities.

## Features

✨ **Modern UI/UX**
- Exact OLX India design clone
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Clean, intuitive navigation

🛍️ **Marketplace Features**
- Browse products by categories
- Search functionality
- Product filters (price, condition, location)
- Wishlist system
- User profiles and seller ratings
- Product listings with detailed information

💻 **Tech Stack**
- **Frontend**: React 18 + Tailwind CSS + Vite
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **API**: RESTful API with CORS

## Project Structure

```
collegemart/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── CategoryTabs.jsx
│   │   ├── CategoriesSection.jsx
│   │   ├── ProductsSection.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server.js
├── database.sql
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── .gitignore
└── index.html
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

**Prerequisites:**
- MySQL Server installed and running
- Access to MySQL command line or MySQL client

**Steps:**
```bash
# Login to MySQL
mysql -u root -p

# Run the database setup script
source database.sql
```

Or copy-paste the contents of `database.sql` into your MySQL client.

### 3. Environment Variables

Create/Update `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=collegemart
PORT=5000
NODE_ENV=development
```

Adjust `DB_PASSWORD` if your MySQL has a password.

### 4. Run the Project

**Option A: Run Frontend & Backend Separately**

Terminal 1 - Start Frontend (Vite):
```bash
npm run dev
```
Frontend runs on: `http://localhost:3000`

Terminal 2 - Start Backend:
```bash
npm run server
```
Backend runs on: `http://localhost:5000`

**Option B: Run Both Concurrently**
```bash
npm run dev:full
```

### 5. Build for Production
```bash
npm run build
npm run preview
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Get by category
- `GET /api/products/featured/all` - Get featured products
- `GET /api/search?q=query` - Search products

### Users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `GET /api/users/:id/products` - Get user's products

### Health Check
- `GET /api/health` - Database connection status

## Database Schema

### Tables:
- **users** - User accounts and profiles
- **products** - Product listings
- **categories** - Product categories
- **wishlist** - User favorites
- **reviews** - Product reviews
- **messages** - User messages
- **transactions** - Purchase history

## UI Components

### Navbar
- Logo with accent color
- Location dropdown
- Search bar with category filter
- Wishlist & Login buttons
- "+ SELL" action button

### Category Tabs
- Horizontal scrollable tabs
- "ALL CATEGORIES" active by default
- Current date display
- 9+ categories

### Hero Section
- Dark teal gradient background
- Headline with emoji
- Two CTA buttons

### Categories Grid
- 12-card auto-fill grid
- Emoji icons + names
- Hover shadow effects

### Products Grid
- Auto-fill responsive grid
- Product cards with:
  - Image/emoji placeholder
  - Price (₹ format)
  - Condition badge (Like New/Good/Fair)
  - Title with truncation
  - Location & time metadata
  - Featured badge
  - Heart wishlist button
- Sell CTA card (position 4)

### Footer
- 5-column grid layout
- College lists
- Social media icons
- App store badges
- Dark teal bottom bar

## Color System

| Element | Color | Hex |
|---------|-------|-----|
| Primary Dark | Navy | #002f34 |
| Primary Teal | Turquoise | #23e5db |
| Background | Light Gray | #f2f4f5 |
| Featured Badge | Gold | #f6b200 |
| Like New | Green | #e6f9f2 |
| Good | Amber | #fff4e0 |
| Fair | Red | #fdecea |

## Responsive Design

- **Desktop**: Full layout with optimized spacing
- **Tablet**: Adjusted grid columns
- **Mobile**: Single column, stacked layout

Breakpoint: 768px (Tailwind md)

## Sample Data

The database includes:
- 8 sample users from different colleges
- 8 sample products across categories
- All categories with emojis
- Featured products marked

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Lazy loading for images
- CSS minification
- Database indexing
- Connection pooling
- API response caching ready

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Payment integration
- [ ] Real-time chat
- [ ] Image uploads
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Rating system
- [ ] Mobile app

## License

MIT License © 2024-2026 CollegeMart

## Support

For issues or questions, create an issue in the repository.

---

Built with ❤️ for college students
