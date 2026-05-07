# 🛒 eMate — eCommerce Web Application

A full-stack eCommerce app built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 📁 Project Structure

```
emate/
├── backend/                        ← Node.js + Express API
│   ├── config/
│   │   ├── db.js                   ← MongoDB connection
│   │   └── cloudinary.js           ← Cloudinary + Multer setup
│   ├── models/
│   │   ├── User.js                 ← User schema
│   │   ├── Product.js              ← Product schema
│   │   ├── Cart.js                 ← Cart schema
│   │   └── Order.js                ← Order schema
│   ├── controllers/
│   │   ├── authController.js       ← Register, Login, Forgot Password
│   │   ├── productController.js    ← CRUD for products
│   │   ├── cartController.js       ← Cart operations
│   │   └── orderController.js      ← Place, view, confirm, cancel orders
│   ├── routes/
│   │   ├── authRoutes.js           ← /api/auth
│   │   ├── productRoutes.js        ← /api/products
│   │   ├── cartRoutes.js           ← /api/cart
│   │   └── orderRoutes.js          ← /api/orders
│   ├── middleware/
│   │   └── authMiddleware.js       ← JWT protect + adminOnly
│   ├── server.js                   ← App entry point
│   ├── .env                        ← Environment variables
│   └── package.json
│
└── frontend/                       ← React + Vite
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Cart.jsx            ← Place order button
    │   │   ├── MyOrders.jsx        ← User: view orders + delivery time
    │   │   ├── AdminPanel.jsx      ← Admin: manage products + orders button
    │   │   └── AdminOrders.jsx     ← Admin: all orders, confirm/cancel
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Hero.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── services/
    │   │   └── api.js              ← All Axios API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed on your system:

| Tool       | Version  | Download |
|------------|----------|----------|
| Node.js    | v18+     | https://nodejs.org |
| npm        | v9+      | comes with Node.js |
| Git        | any      | https://git-scm.com (optional) |

---

## 🚀 Setup & Running

### Step 1 — Extract the zip

Extract `emate.zip` to your Desktop (or anywhere you prefer):

```
emate/
  ├── backend/
  └── frontend/
```

---

### Step 2 — Setup the Backend

Open a terminal (CMD or PowerShell on Windows):

```bash
cd path\to\emate\backend
```

Install dependencies:

```bash
npm install
```

The `.env` file is already included with your credentials. If you need to change the database or other settings, open `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Start the backend server:

```bash
# Development mode (auto-restart on file changes)
npm run dev

# OR Production mode
npm start
```

✅ You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

### Step 3 — Setup the Frontend

Open a **second terminal** (keep the backend terminal running):

```bash
cd path\to\emate\frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

✅ You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

---

### Step 4 — Open the App

Open your browser and go to:

```
http://localhost:5173
```

---

## 🔑 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint               | Description         | Access |
|--------|------------------------|---------------------|--------|
| POST   | `/api/auth/register`   | Register new user   | Public |
| POST   | `/api/auth/login`      | Login user          | Public |
| POST   | `/api/auth/forgot-password` | Reset password | Public |

### Products — `/api/products`
| Method | Endpoint              | Description          | Access     |
|--------|-----------------------|----------------------|------------|
| GET    | `/api/products`       | Get all products     | Public     |
| GET    | `/api/products/:id`   | Get single product   | Public     |
| POST   | `/api/products`       | Add product          | Admin only |
| PUT    | `/api/products/:id`   | Update product       | Admin only |
| DELETE | `/api/products/:id`   | Delete product       | Admin only |

### Cart — `/api/cart`
| Method | Endpoint                       | Description       | Access         |
|--------|--------------------------------|-------------------|----------------|
| GET    | `/api/cart`                    | Get user's cart   | Logged-in user |
| POST   | `/api/cart/add`                | Add item to cart  | Logged-in user |
| PUT    | `/api/cart/update/:productId`  | Update quantity   | Logged-in user |
| DELETE | `/api/cart/remove/:productId`  | Remove item       | Logged-in user |
| DELETE | `/api/cart/clear`              | Clear cart        | Logged-in user |

### Orders — `/api/orders`
| Method | Endpoint                   | Description                    | Access         |
|--------|----------------------------|--------------------------------|----------------|
| POST   | `/api/orders/place`        | Place order from cart          | Logged-in user |
| GET    | `/api/orders/my`           | Get my orders                  | Logged-in user |
| GET    | `/api/orders/all`          | Get all orders                 | Admin only     |
| PUT    | `/api/orders/:id/status`   | Confirm/Cancel + delivery time | Admin only     |

---

## 👤 Default Admin Setup

To make a user an admin, go to your MongoDB Atlas dashboard:

1. Open your cluster → Browse Collections → `users` collection
2. Find the user you want to make admin
3. Edit the document and change `"role": "user"` → `"role": "admin"`
4. Save

That user can now access the Admin Panel at `/admin`.

---

## 🌟 Features

- ✅ User registration & login with JWT authentication
- ✅ Forgot password using father's name verification
- ✅ Browse products with category filter and search
- ✅ Add to cart, update quantity, remove items
- ✅ **Place order** from cart — cart clears automatically
- ✅ **User: My Orders page** — see order status & estimated delivery time
- ✅ **Admin Panel** — add, edit, delete products with image upload
- ✅ **Admin Orders page** — all orders grouped by user (name, email, contact)
- ✅ **Admin: Confirm / Cancel** orders with estimated delivery time
- ✅ Product images uploaded to Cloudinary

---

## 🛠️ Common Issues

**`npm error code ENOENT` — package.json not found**
→ You're in the wrong folder. Make sure to `cd` into `backend` or `frontend` first.

**MongoDB connection error**
→ Check your `MONGO_URI` in `backend/.env`. Make sure your IP is whitelisted in MongoDB Atlas (Network Access → Add IP → 0.0.0.0/0 for all IPs).

**Port already in use**
→ Change `PORT=5000` in `.env` or kill the process using that port.

**Frontend can't reach backend**
→ Make sure backend is running on port 5000. Check `frontend/src/services/api.js` — the `baseURL` should be `http://localhost:5000/api`.
