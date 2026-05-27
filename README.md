




# MediGo 💊

**"Your Trusted Online Medicine Shop"**

[![Live Demo](https://img.shields.io/badge/Live_Demo-vercel.app-000?style=for-the-badge&logo=vercel)](https://medigo1.vercel.app)
[![API Server](https://img.shields.io/badge/API_Server-vercel.app-000?style=for-the-badge&logo=vercel)](https://medigo-server-1.vercel.app)
[![Video Demo](https://img.shields.io/badge/Video_Demo-Google_Drive-4285F4?style=for-the-badge&logo=googledrive)](https://drive.google.com/file/d/1aPgAALHFV3sZ167gvckO_rZiv1ZR49Uv/view?usp=drive_link)

---

## 📋 Project Overview

MediGo is a full-stack e-commerce web application for purchasing over-the-counter (OTC) medicines. The platform serves three types of users:

- **Customers** - Browse, purchase, and track medicine orders
- **Sellers** - Manage inventory and fulfill orders
- **Admins** - Oversee the entire platform

> 💡 **Note**: Only OTC medicines (no prescription required)

---

## 🚀 Live Links

| Type | Link |
|------|------|
| **Frontend** | [https://medigo1.vercel.app](https://medigo1.vercel.app) |
| **Backend API** | [https://medigo-server-1.vercel.app](https://medigo-server-1.vercel.app) |
| **Demo Video** | [Watch on Google Drive](https://drive.google.com/file/d/1aPgAALHFV3sZ167gvckO_rZiv1ZR49Uv/view?usp=drive_link) |

### Admin Credentials

| Email | Password |
|-------|----------|
| westbrook@gmail.com | westbrook123 |

---

## 👥 Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Customer** | Users who purchase medicines | Browse, cart, order, track status, leave reviews |
| **Seller** | Medicine vendors/pharmacies | Manage inventory, view orders, update order status |
| **Admin** | Platform moderators | Manage all inventory, users, oversee orders |

---

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Axios for API calls
- React Router DOM for routing
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Better Auth for authentication
- Bcrypt for password hashing

### Deployment
- Frontend: Vercel
- Backend: Vercel
- Database: MongoDB Atlas

---

## ✨ Features

### Public Features
- Browse all available medicines
- Search and filter by category, price, manufacturer
- View detailed medicine information

### Customer Features
- Register and login as customer
- Add medicines to shopping cart
- Place orders with shipping address (Cash on Delivery)
- Track order status (Placed → Processing → Shipped → Delivered)
- Leave reviews for purchased medicines
- Manage profile information

### Seller Features
- Register and login as seller
- Add, edit, and remove medicines
- Manage stock levels
- View incoming orders
- Update order status

### Admin Features
- View all users (customers and sellers)
- Manage user status (ban/unban)
- View all medicines and orders
- Manage medicine categories

---

## 📁 Project Structure

### Frontend (MediGo-client-side)

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── customer/       # Customer pages (Cart, Orders, Profile)
│   ├── seller/         # Seller pages (Dashboard, Medicines, Orders)
│   ├── admin/          # Admin pages (Users, Categories)
│   └── public/         # Public pages (Home, Shop, Login, Register)
├── context/            # React Context for state management
├── services/           # API service functions
├── utils/              # Helper functions
└── App.jsx             # Main app with routing
```

### Backend (MediGo-server-side)

```
src/
├── controllers/        # Request handlers
├── models/             # Mongoose schemas
│   ├── User.model.js
│   ├── Medicine.model.js
│   ├── Order.model.js
│   ├── Category.model.js
│   └── Review.model.js
├── routes/             # API routes
├── middleware/         # Auth, error handling
├── utils/              # Helper functions
└── server.js           # Entry point
```

---

## 🗄️ Database Schema

### Users
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique, login credential |
| password | String | Hashed password |
| role | Enum | customer / seller / admin |
| isBanned | Boolean | Admin action flag |

### Categories
| Field | Type | Description |
|-------|------|-------------|
| name | String | Category name (e.g., "Pain Relief") |
| description | String | Optional description |

### Medicines
| Field | Type | Description |
|-------|------|-------------|
| name | String | Medicine name |
| category | ObjectId | Reference to Category |
| price | Number | Price per unit |
| stock | Number | Available quantity |
| manufacturer | String | Brand/manufacturer name |
| sellerId | ObjectId | Reference to User (seller) |

### Orders
| Field | Type | Description |
|-------|------|-------------|
| customerId | ObjectId | Reference to User (customer) |
| items | Array | List of { medicineId, quantity, price } |
| totalAmount | Number | Total order value |
| status | Enum | placed / processing / shipped / delivered / cancelled |
| shippingAddress | Object | Address details |

### Reviews
| Field | Type | Description |
|-------|------|-------------|
| medicineId | ObjectId | Reference to Medicine |
| customerId | ObjectId | Reference to User |
| rating | Number | 1-5 stars |
| comment | String | Review text |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Medicines (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medicines` | Get all medicines with filters |
| GET | `/api/medicines/:id` | Get medicine details |
| GET | `/api/categories` | Get all categories |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get order details |

### Seller Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/seller/medicines` | Add medicine |
| PUT | `/api/seller/medicines/:id` | Update medicine |
| DELETE | `/api/seller/medicines/:id` | Remove medicine |
| GET | `/api/seller/orders` | Get seller's orders |
| PATCH | `/api/seller/orders/:id` | Update order status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PATCH | `/api/admin/users/:id` | Update user status |

---

## 🔄 Flow Diagrams

### Customer Journey

```
Register → Browse Shop → Add to Cart → Checkout → Track Order
```

### Seller Journey

```
Register → Add Medicines → Manage Stock → View Orders → Update Status
```

### Order Status Flow

```
PLACED → PROCESSING → SHIPPED → DELIVERED
   ↘                        ↗
    ─────── CANCELLED ───────
```

---

## 🧪 Testing the Application

### As Admin
1. Login with: `westbrook@gmail.com` / `westbrook123`
2. Access admin dashboard at `/admin`
3. Manage users, categories, and view all orders

### As Seller
1. Register as a new seller
2. Add medicines at `/seller/medicines`
3. View and update orders at `/seller/orders`

### As Customer
1. Register as a new customer
2. Browse medicines at `/shop`
3. Add items to cart and checkout
4. Track orders at `/orders`

---

## 📦 Installation & Local Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB

### Backend Setup

```bash
# Clone backend repository
git clone https://github.com/tanvirislamakash2002/MediGo-server-side.git
cd MediGo-server-side

# Install dependencies
npm install

# Create .env file
echo "PORT=5000" > .env
echo "MONGODB_URI=your_mongodb_connection_string" >> .env
echo "JWT_SECRET=your_jwt_secret_key" >> .env

# Run server
npm run dev
```

### Frontend Setup

```bash
# Clone frontend repository
git clone https://github.com/tanvirislamakash2002/MediGo-client-side.git
cd MediGo-client-side

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Run development server
npm run dev
```

---

## 📱 Screenshots (Optional)

| Page | Description |
|------|-------------|
| Home | Hero section with categories and featured medicines |
| Shop | All medicines with search and filters |
| Cart | View and modify cart items |
| Checkout | Shipping address and order summary |
| Seller Dashboard | Manage medicines and view orders |
| Admin Panel | User and category management |

---

## 👨‍💻 Author

**Tanvir Islam Akash**

- GitHub: [@tanvirislamakash2002](https://github.com/tanvirislamakash2002)
- Frontend Repo: [MediGo-client-side](https://github.com/tanvirislamakash2002/MediGo-client-side)
- Backend Repo: [MediGo-server-side](https://github.com/tanvirislamakash2002/MediGo-server-side)

---

## 📄 License

This project is for educational purposes as part of a course submission.

---

## ⚠️ Disclaimer

This is a demo project for educational purposes only. It is not intended for real medical purchases. Always consult a healthcare professional before taking any medication.
```

