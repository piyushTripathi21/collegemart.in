# CollegeMart — Comprehensive Fix Plan (29 Issues)

This plan addresses all reported issues grouped into 7 phases, ordered by priority. Each phase lists exact file changes.

## User Review Required

> [!CAUTION]
> **Issue #1–2: Your Google OAuth credentials and Gmail App Password are exposed in `.env` and likely committed to Git history.** Even after fixing `.env`, **you must rotate these credentials immediately** in the Google Cloud Console and Gmail settings. This plan cannot do that for you — it's an external action you must take manually.

> [!IMPORTANT]
> **Issues #5, #8, #9 (HTTPS / Production Build / Docker)**: These are deployment infrastructure concerns. This plan will:
> - Add a production-ready static file serving mode to `server.js`
> - Add a `Dockerfile` and `.dockerignore`
> - Add a `VITE_API_URL` env var for production frontend builds
>
> However, setting up a domain, SSL certificates, and a CI/CD pipeline are external ops tasks. The plan adds the *code* to support them.

> [!IMPORTANT]
> **Issue #24 (Cloud storage for uploads)**: Migrating to S3/Cloudinary requires you to set up an account and provide credentials. This plan will add the *abstraction layer* and a Cloudinary integration ready to activate via env vars, with local disk as fallback.

## Open Questions

> [!IMPORTANT]
> **Issue #15 (Push Notifications)**: Implementing push notifications (Service Workers + Web Push API) is a significant standalone feature. Should I include it in this plan or defer it to a follow-up?

> [!IMPORTANT]
> **Issue #18 (Admin Role Granularity)**: Currently all admins share the same API access. Adding proper RBAC requires schema changes and middleware. I'll add a middleware-based role check on destructive admin endpoints (delete users, delete products, ban). Does that scope sound right, or do you want full RBAC with configurable permissions?

> [!IMPORTANT]
> **Issue #12 (Phone OTP Verification)**: This requires a Twilio or similar SMS provider account. Should I add the integration code (with env vars for credentials), or defer this?

---

## Phase 1 — Security & Secrets (Issues #1–5)

### server.js

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)

**Issue #3 — JWT_SECRET fallback removal:**
- Change the JWT_SECRET logic to **throw immediately** if `JWT_SECRET` is not set, regardless of `NODE_ENV`. Remove the `'college_mart_secret'` fallback entirely.
```diff
-const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'college_mart_secret')
-if (!JWT_SECRET) {
-  throw new Error('JWT_SECRET must be set in production environment')
-}
+const JWT_SECRET = process.env.JWT_SECRET
+if (!JWT_SECRET) {
+  throw new Error('JWT_SECRET environment variable is required. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"')
+}
```

**Issue #5 — HTTPS enforcement middleware:**
- Add HTTPS redirect middleware that activates when `NODE_ENV === 'production'`:
```js
// Trust proxy for platforms like Heroku/Railway/Render
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`)
    }
    next()
  })
}
```

### .env & .gitignore

#### [MODIFY] [.env](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/.env)
- **Strip all real credentials**, replace with placeholder values.
- Add `JWT_SECRET` with a randomly generated value.

#### [MODIFY] [.env.example](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/.env.example)
- Update to include all env vars with descriptions and safe placeholder values.
- Add `JWT_SECRET`, `VITE_API_URL`, `CLOUDINARY_*` vars.

#### [MODIFY] [.gitignore](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/.gitignore)
- Verify `.env` is listed (it already is ✓). Add `public/uploads/` to avoid committing user uploads.

---

## Phase 2 — Hardcoded localhost URLs (Issues #6–7)

### Frontend — ProductDetailsPage.jsx

#### [MODIFY] [ProductDetailsPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductDetailsPage.jsx)

**Issue #6 — Socket.IO hardcoded URL:**
- Line 63: Replace `io('http://localhost:5000', ...)` with a dynamic URL derived from env:
```js
const SOCKET_URL = import.meta.env.VITE_API_URL || ''
// ...
const socket = io(SOCKET_URL, { auth: { token: user.token } })
```
- When `VITE_API_URL` is empty (dev mode), socket.io-client will connect to the current origin, which works with the Vite proxy.

### Backend — server.js

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)

**Issue #7 — Email notification hardcoded link:**
- Line 166: Replace `http://localhost:3000/chat` with a dynamic `FRONTEND_URL` env var:
```diff
-<a href="http://localhost:3000/chat" ...>
+<a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/chat" ...>
```

---

## Phase 3 — Production Build / Deployment (Issues #8–9)

### vite.config.js

#### [MODIFY] [vite.config.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/vite.config.js)

**Issue #8 — Production API URL:**
- The proxy is dev-only (correct). No change needed to the proxy itself.
- Ensure frontend API calls work in production by using `VITE_API_URL` as the axios base URL.

### New Files

#### [NEW] [src/services/api.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/services/api.js)
- Create a centralized axios instance with `baseURL` set from `VITE_API_URL`:
```js
import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
})
export default api
```
- All components currently using `axios` directly will import from this module instead.

#### [NEW] [Dockerfile](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/Dockerfile)
- Multi-stage build: build frontend with Vite, then serve via Express.

#### [NEW] [.dockerignore](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/.dockerignore)
- Exclude `node_modules`, `.env`, `dist`, `public/uploads`.

### server.js — Serve Static Build

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)
- Add static file serving for the Vite `dist/` folder in production mode at the bottom, before `server.listen`:
```js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}
```

---

## Phase 4 — Missing Core Features (Issues #10–14, #26)

### Issue #10 — Email Verification on Signup

#### [MODIFY] [database.sql](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/database.sql)
- Add `email_verified BOOLEAN DEFAULT FALSE` and `email_verification_token VARCHAR(255)` columns to the `users` table.

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)
- On `/api/users/register`: generate a verification token, store it, send a verification email.
- Add `/api/users/verify-email/:token` endpoint to verify the token.
- Add check in login: if `email_verified = FALSE`, return error asking user to verify.

#### [MODIFY] [LoginModal.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/LoginModal.jsx)
- Show a message after signup: "Please check your email to verify your account before logging in."

---

### Issue #11 — Forgot Password Flow

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)
- Add `password_reset_token VARCHAR(255)` and `password_reset_expires DATETIME` to users table schema.
- Add `/api/users/forgot-password` endpoint: generates a token, sends email with reset link.
- Add `/api/users/reset-password/:token` endpoint: verifies token expiry, updates password.

#### [NEW] [src/components/ForgotPasswordModal.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ForgotPasswordModal.jsx)
- Simple modal: enter email → receive reset link.

#### [NEW] [src/components/ResetPasswordPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ResetPasswordPage.jsx)
- Page at `/reset-password/:token`: enter new password → submit.

#### [MODIFY] [LoginModal.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/LoginModal.jsx)
- Add "Forgot Password?" link below the password field.

#### [MODIFY] [App.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/App.jsx)
- Add route for `/reset-password/:token`.

---

### Issue #13 — Hide Seller Contact Info

#### [MODIFY] [ProductDetailsPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductDetailsPage.jsx)
- Replace the direct rendering of `product.sellerEmail` and `product.sellerPhone` (lines 657–669) with:
  - A "Show Contact Details" button that requires login.
  - State `showContactInfo` toggled by the button.
  - Only reveal email/phone after the user clicks the button (and is authenticated).

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)
- In the product detail API (`GET /api/products/:id`), **strip** `sellerEmail` and `sellerPhone` from the response.
- Add a new authenticated endpoint `GET /api/products/:id/contact` that returns the seller's contact info.

---

### Issue #14 — Chat Pagination

#### [MODIFY] [ProductDetailsPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductDetailsPage.jsx)
- Add a "Load earlier messages" button at the top of the chat panel.
- Track `chatPage` state, increment on "Load More", prepend older messages.

---

### Issue #26 — Terms of Service Acceptance on Signup

#### [MODIFY] [LoginModal.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/LoginModal.jsx)
- Add a checkbox: "I agree to the [Terms of Use](/terms-of-use) and [Privacy Policy](/privacy-policy)".
- Block submission if unchecked during signup.

#### [MODIFY] [database.sql](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/database.sql)
- Add `accepted_terms_at DATETIME` column to users table.

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)
- Accept `acceptedTerms` flag in register endpoint, store timestamp.

---

## Phase 5 — Admin Panel Fixes (Issues #16–17)

### Issue #16 — AdminCoins.jsx dark class

#### [MODIFY] [AdminCoins.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminCoins.jsx)
- Line 90: Replace `className="text-slate-300"` with `style={{ color: 'var(--text-secondary)' }}`.

### Issue #17 — All admin text-slate-* class fixes

The following files will be updated to replace hardcoded `text-slate-*` classes with CSS variable-based inline styles or proper dark/light-aware classes:

#### [MODIFY] [AdminUsers.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminUsers.jsx)
#### [MODIFY] [AdminReports.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminReports.jsx)
#### [MODIFY] [AdminProducts.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminProducts.jsx)
#### [MODIFY] [AdminCategories.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminCategories.jsx)
#### [MODIFY] [AdminAnnouncements.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminAnnouncements.jsx)
#### [MODIFY] [AdminLayout.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminLayout.jsx)
#### [MODIFY] [AdminLogin.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminLogin.jsx)
#### [MODIFY] [AdminAccessControl.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminAccessControl.jsx)
#### [MODIFY] [AdminSettings.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminSettings.jsx)
#### [MODIFY] [AdminDashboard.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminDashboard.jsx)
#### [MODIFY] [AdminMessages.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminMessages.jsx)
#### [MODIFY] [AdminReviews.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/admin/AdminReviews.jsx)

**Strategy**: Replace `text-slate-950` on teal buttons with `text-white` for visibility. Replace `text-slate-300`, `text-slate-400`, `text-slate-500` on body/table text with CSS variable styles `color: var(--text-primary)` / `var(--text-muted)`.

---

## Phase 6 — Code Quality & Robustness (Issues #19–23, #25)

### Issue #20 — Replace alert() with Toast Notifications

#### [NEW] [src/components/Toast.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/Toast.jsx)
- A reusable toast notification component with auto-dismiss, types (success/error/info/warning), and smooth animations.

#### [NEW] [src/context/ToastContext.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/context/ToastContext.jsx)
- Context provider with `showToast(message, type)` function.

#### [MODIFY] [src/main.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/main.jsx)
- Wrap app with `ToastProvider`.

#### [MODIFY] All components using `alert()`
- Replace every `alert(...)` call with `showToast(...)` from the ToastContext.
- Affected files: `ProductDetailsPage.jsx`, `ProductsSection.jsx`, `LoginModal.jsx`, `SellPage.jsx`, `ProfilePage.jsx`, `FavoritesPage.jsx`, plus all admin components.

---

### Issue #21 — React Error Boundary

#### [NEW] [src/components/ErrorBoundary.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ErrorBoundary.jsx)
- Class component catching render errors, showing a friendly fallback UI with a "Reload" button.

#### [MODIFY] [src/main.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/main.jsx)
- Wrap `<App />` with `<ErrorBoundary>`.

---

### Issue #22 — Loading Skeletons

#### [NEW] [src/components/ProductSkeleton.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductSkeleton.jsx)
- Shimmer skeleton matching the product card layout.

#### [MODIFY] [src/components/ProductsSection.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductsSection.jsx)
- Replace "Loading products..." text with skeleton grid.

#### [MODIFY] [src/components/ProductDetailsPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductDetailsPage.jsx)
- Replace "Loading product details..." text with a detail page skeleton.

---

### Issue #23 — Image Compression

#### [MODIFY] [src/components/SellPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/SellPage.jsx)
- Add client-side image compression using Canvas API before upload.
- Resize images to max 1200px width, compress to JPEG quality 0.8.
- Limit to ~2MB per image after compression.

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)
- Reduce multer `fileSize` limit from 50MB to 5MB per file.

---

### Issue #25 — Dynamic SEO Meta Tags

#### [MODIFY] [index.html](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/index.html)
- Add default meta description, OG tags, and favicon.

#### [NEW] [src/hooks/useDocumentMeta.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/hooks/useDocumentMeta.js)
- Custom hook `useDocumentMeta({ title, description, ogImage })` that updates `<title>` and meta tags dynamically.

#### [MODIFY] [ProductDetailsPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductDetailsPage.jsx)
- Call `useDocumentMeta()` with product title, description, and first image.

#### [MODIFY] [App.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/App.jsx)
- Set default meta on the home route.

---

### Issue #19 — Token in localStorage (Partial)

> [!NOTE]
> Full HttpOnly cookie migration requires significant auth flow rework. For this pass, we'll add:
> - XSS content security headers via Helmet (already present)
> - Input sanitization is already in place
> - Mark this as a documented known limitation for a future sprint

---

## Phase 7 — Performance (Issues #27–29)

### Issue #27 — Image Lazy Loading

#### [MODIFY] [ProductsSection.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductsSection.jsx)
- Add `loading="lazy"` attribute to all product `<img>` tags.

#### [MODIFY] [FreshRecommendations.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/FreshRecommendations.jsx)
- Same treatment.

#### [MODIFY] [CategoryPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/CategoryPage.jsx)
- Same treatment.

---

### Issue #28 — Caching (Documentation)

> [!NOTE]
> Adding a Redis caching layer requires a Redis server. For this pass, I'll add **in-memory caching** for the most-hit read-only endpoints (`GET /api/products`, `GET /api/products/featured/all`) with a 60-second TTL. This is a lightweight solution that doesn't require Redis.

#### [MODIFY] [server.js](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/server.js)
- Add a simple in-memory cache for product listing endpoints.

---

### Issue #29 — Socket Error Handling

#### [MODIFY] [ProductDetailsPage.jsx](file:///c:/Users/singh/Desktop/WebDeveloper/Startup/src/components/ProductDetailsPage.jsx)
- Improve socket error handling: listen for `connect_error`, display a non-blocking warning toast.
- Add auto-reconnect attempt logic.

---

## Verification Plan

### Automated Tests
```bash
# Build check
npm run build

# Server startup check
node -e "import('./server.js')" 
```

### Manual Verification
1. Start the dev server (`npm run dev:full`) and verify:
   - Registration flow with email verification
   - Forgot password flow
   - Seller contact info hidden behind "Show Contact" button
   - Toast notifications instead of alerts
   - Skeleton loaders on product pages
   - Image lazy loading (check Network tab)
   - Socket.IO connects via relative URL
   - Error boundary catches render errors
   - Admin panel text is visible in light theme
   - ToS checkbox blocks signup
   - Chat pagination "Load More" button works
2. Run `npm run build` to verify production build succeeds
3. Review `.env` to confirm no credentials remain
