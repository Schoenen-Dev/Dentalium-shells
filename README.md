# Dentalium Shells — E-commerce (Next.js + MongoDB)

A boutique e-commerce site for authentic dentalium tusk shells, seashell jewelry, and coastal decor.
Built with **Next.js 14 (App Router) + Tailwind + shadcn/ui + MongoDB**.

---

## ✨ Features

- Beautiful coastal-luxury landing page (hero, categories, featured products, story, testimonials, newsletter)
- Full shop with category filters + live search
- Product detail pages with image gallery
- Persistent cart (session-based) with slide-out drawer
- Full checkout flow + order confirmation
- Admin panel to add / delete products
- Auto-seeds 6 demo products on first run
- All backend logic in Next.js API routes (no separate server)

---

## 🚀 Run locally in VS Code

### 1. Prerequisites
- **Node.js 18+** → https://nodejs.org
- **MongoDB** running locally → https://www.mongodb.com/try/download/community
  (or use MongoDB Atlas free tier and paste the connection string)
- **Yarn** → `npm install -g yarn`

### 2. Open the project in VS Code
```bash
cd dentalium-shells
code .
```

### 3. Install dependencies
```bash
yarn install
```

### 4. Configure environment variables
The `.env` file at the project root already contains:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=dentalium
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*
```
Edit `MONGO_URL` if you're using Atlas (e.g. `mongodb+srv://user:pass@cluster.mongodb.net`).

### 5. Start MongoDB (if local)
- **macOS (Homebrew)**: `brew services start mongodb-community`
- **Windows**: start the MongoDB service from Services panel
- **Linux**: `sudo systemctl start mongod`
- **Docker (any OS)**: `docker run -d -p 27017:27017 --name mongo mongo:7`

### 6. Run the app
```bash
yarn dev
```
Open **http://localhost:3000** 🎉

The first time you load it, the API auto-seeds 6 demo products into MongoDB.

---

## 📂 Project structure

```
app/
├── api/[[...path]]/route.js    ← All backend API endpoints
├── layout.js                   ← Root layout + fonts
├── page.js                     ← All UI (Home, Shop, Product, Cart, Checkout, Admin)
└── globals.css                 ← Tailwind + custom styles
components/ui/                  ← shadcn/ui components
lib/                            ← utilities
.env                            ← Environment variables
package.json
```

---

## 🧪 API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api/health` | Health check |
| GET    | `/api/products` | List all products (`?category=&q=` filters) |
| GET    | `/api/products/:slug` | Single product by slug |
| POST   | `/api/products` | Create product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| GET    | `/api/categories` | List categories |
| GET    | `/api/cart/:sessionId` | Get cart for session |
| POST   | `/api/cart` | Add / set / remove cart item |
| POST   | `/api/orders` | Place order |
| GET    | `/api/orders` | List recent orders |
| POST   | `/api/newsletter` | Newsletter subscribe |

---

## 🛠 Build for production
```bash
yarn build
yarn start
```

---

## 💡 Customization tips

- **Change brand colors** → edit `app/globals.css` (`.bg-deep`, `.text-gold`, `.bg-sand`)
- **Change fonts** → edit `app/layout.js` (currently Playfair Display + Inter)
- **Edit seed products** → see `SEED_PRODUCTS` array at the top of `app/api/[[...path]]/route.js`
- **Admin panel** → click "Admin" in the top nav (no auth in MVP — add before going live)

---

## ⚠️ Before going live
- Add authentication to the `/admin` panel
- Replace demo checkout with real **Stripe** integration
- Add proper image upload (S3 / Cloudinary)
- Add transactional email for order confirmation
- Add SEO metadata per product page

Made with ❤️ and saltwater.
