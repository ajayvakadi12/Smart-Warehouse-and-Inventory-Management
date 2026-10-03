# 📦 Smart Warehouse Inventory Management System

A full-stack **Warehouse Inventory Management System** built using the **MERN Stack** to efficiently manage warehouses, racks, bins, products, suppliers, inventory, and shipments.

The system provides secure authentication, role-based access control, inventory tracking, RESTful APIs, and a modern responsive dashboard for managing warehouse operations.

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Secure password hashing using bcrypt
- Role-Based Authorization
- Protected Routes
- User Registration & Login

---

## 🏭 Warehouse Management

- Warehouse Management
- Rack Management
- Bin Management
- Organized inventory storage structure
- Warehouse-wise product tracking

---

## 📦 Product & Inventory Management

- Product Management
- Category Management
- SKU Management
- Stock In / Stock Out Tracking
- Inventory Monitoring
- Search, Filter & Pagination

---

## 🚚 Supplier & Shipment Management

- Supplier Management
- Shipment Tracking
- Order and inventory flow management

---

## 📊 Dashboard & Analytics

- Inventory Dashboard
- Stock Reports
- Data Visualization
- Business Insights
- Inventory Performance Tracking

---

# 📸 Screenshots

## 🔐 Login Page

![Login Page](screenshots/login.png)

---

## 📊 Dashboard

![Dashboard](screenshots/dashboard.png)

---

## 📦 Product Management

![Product Management](screenshots/products.png)

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Tools

- MongoDB Compass
- Thunder Client
- Git & GitHub
- VS Code

---

# 🏗️ System Architecture

```
Frontend
(React + Vite + Tailwind CSS)
          |
          |
          ↓
Backend API
(Node.js + Express.js)
          |
          |
          ↓
Database
(MongoDB + Mongoose)
```

---

# 📂 Project Structure

```text
Smart-Warehouse-Inventory
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   └── routes
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── config
│   │   └── server.js
│
├── screenshots
│
├── docs
│
├── deployment
│
└── README.md
```

---

# 🚀 Current Progress

## ✅ Completed

- MongoDB Database Setup
- Express Server Configuration
- JWT Authentication
- User Registration
- User Login
- Protected Routes
- Backend API Structure
- Warehouse Module APIs
- Product Module APIs
- Frontend Routing Setup
- Authentication Flow Integration
- GitHub Repository Setup

---

## 🚧 In Progress

- Inventory Tracking
- Dashboard Analytics
- Shipment Module
- Supplier Module
- Advanced UI Improvements

---

# 🔗 API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| POST | `/api/auth/logout` | Logout User |
| GET | `/api/profile` | Get User Profile |

---

## Warehouse

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/warehouses` | Create Warehouse |
| GET | `/api/warehouses` | Get Warehouses |

---

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Add Product |
| GET | `/api/products` | Get Products |

---

# ⚙️ Installation & Setup

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🔮 Future Enhancements

- Barcode / QR Code Integration
- Inventory Forecasting
- Low Stock Alerts
- Email Notifications
- Advanced Analytics Dashboard
- Excel/PDF Report Export
- Cloud Deployment
- Role-Based Admin Panel

---




