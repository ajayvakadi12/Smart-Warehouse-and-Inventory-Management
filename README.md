# 📦 Smart Warehouse & Inventory Management System

A production-ready, full-stack **Warehouse & Inventory Management System (WIMS)** built with the **MERN Stack** (MongoDB, Express.js, React, Node.js) and styled with **Tailwind CSS**. Designed for end-to-end logistics, real-time stock tracking, multi-warehouse hierarchy, and role-based operational workflows.

---

## 🌐 Live Demo & Deployment

| Resource | Link |
| :--- | :--- |
| **🚀 Live Deployed App** | [Launch Web Application](https://smart-warehouse-and-inventory-manag.vercel.app/) |
| **🔐 Direct Login URL** | `https://smart-warehouse-and-inventory-manag.vercel.app/` |

---

## 🔑 Demo Credentials

Use any of the pre-configured role-based credentials below to test the platform:

| Role | Email Address | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@warehouse.com` | `Admin@123` | Full administrative control, warehouse configuration, user roles, system reports |
| 🏢 **Warehouse Manager** | `manager@warehouse.com` | `Manager@123` | Inventory auditing, stock-in/out approval, rack & bin allocations, shipments |
| 👷 **Operations Staff** | `staff@warehouse.com` | `Staff@123` | Order pick & pack, stock view, inventory movement logging |

> 💡 **Self-Registration**: You can also register a brand-new custom account directly via the [Sign Up page](https://smart-warehouse-and-inventory-management-dqu6blzwz.vercel.app/register) or test password recovery via [Forgot Password](https://smart-warehouse-and-inventory-management-dqu6blzwz.vercel.app/forgot-password).

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Role-Based Access Control (RBAC)**: Enforced across Admin, Warehouse Manager, and Operations Staff.
- **JWT Authentication**: Secure stateless session handling via HTTP authorization tokens.
- **Bcrypt Password Encryption**: Industry-standard cryptographic salting and hashing.
- **Password Recovery**: Secure OTP-driven email verification workflow for password resets.
- **Profile Management**: In-app profile updating and verified password change.

### 🏭 Multi-Warehouse & Storage Hierarchy
- **Warehouse Management**: Track multiple facilities across locations with capacity limits and assigned managers.
- **Racks & Bins**: Granular storage location indexing (Aisles, Racks, and Bins) for precision item placement.
- **Capacity Monitoring**: Real-time warehouse utilization and space allocation metrics.

### 📦 Product & Inventory Lifecycle
- **SKU & Catalog Registry**: Product categorization, unique SKU generation, and barcode-ready identifiers.
- **Stock Movement Transactions**: Audit-trail logging for all **Stock-In** (receipts/returns) and **Stock-Out** (dispatches/sales).
- **Zero-Floor Protection**: Inventory safeguards preventing negative stock values and invalid dispatches.
- **Low Stock Alerts**: Automated status flags (`Available`, `Low Stock`, `Out of Stock`) to prevent stockouts.

### 🚚 Suppliers, Orders & Shipments
- **Supplier Directory**: Manage vendor details, contacts, and historical supply records.
- **Shipment Tracking**: Lifecycle tracking for inward and outward freight (`Pending`, `Shipped`, `Received`, `Delivered`).
- **Order Processing**: Customer order management, line-item quantities, and fulfillment status updates.

### 📊 Real-Time Analytics & Operations Dashboard
- **Executive KPIs**: Quick-view counters for Total Stock Value, Active Warehouses, Low Stock Count, and Pending Shipments.
- **Visual Analytics**: Interactive charts showing stock trends and category distributions.
- **Audit Logs**: Chronological log of recent warehouse actions and transactions.

---

## 🛠️ Technology Stack

```text
┌────────────────────────────────────────────────────────┐
│                        FRONTEND                        │
│     React 18  •  Vite  •  Tailwind CSS  •  Axios       │
│      React Router DOM v6  •  Lucide React Icons        │
└───────────────────────────┬────────────────────────────┘
                            │ RESTful JSON APIs
┌───────────────────────────▼────────────────────────────┐
│                        BACKEND                         │
│     Node.js  •  Express.js  •  JWT  •  BcryptJS        │
│          Nodemailer (OTP Engine)  •  CORS              │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼────────────────────────────┐
│                        DATABASE                        │
│              MongoDB Atlas / MongoDB Community         │
└────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Fast, modern client-side Single Page Application (SPA) |
| **Styling** | Tailwind CSS | Utility-first responsive UI design with clean dark/light contrast |
| **Icons** | Lucide React | Lightweight, consistent iconography |
| **Backend** | Node.js, Express.js | Scalable REST API architecture with modular routers and controllers |
| **Database** | MongoDB, Mongoose | Flexible document schema with relational referencing |
| **Security** | JWT, BcryptJS | Stateless authorization and password hashing |
| **Mailer** | Nodemailer | Automated OTP email delivery for forgotten passwords |
| **Hosting** | Vercel | Global edge deployment with SPA rewrite routing |

---

## 📂 Project Structure

```text
Smart-Warehouse-Inventory/
├── frontend/                     # React + Vite Frontend Client
│   ├── public/                   # Static assets & favicon
│   ├── src/
│   │   ├── components/           # Reusable UI components (Sidebar, Navbar, Cards)
│   │   ├── context/              # Global state (AuthContext, ThemeContext)
│   │   ├── pages/                # Application views (Dashboard, Products, Warehouses, etc.)
│   │   │   ├── auth/             # Login, Register, ForgotPassword
│   │   │   └── ...
│   │   ├── services/             # Axios API service clients
│   │   ├── App.jsx               # Application root & route definitions
│   │   └── main.jsx              # React DOM entry point
│   ├── vercel.json               # SPA routing rewrite configuration for Vercel
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/               # Database and environment configurations
│   │   ├── controllers/          # Business logic handlers
│   │   ├── middleware/           # Auth verification, RBAC, error handlers
│   │   ├── models/               # Mongoose schemas (User, Product, Warehouse, etc.)
│   │   ├── routes/               # API route definitions
│   │   ├── scripts/              # Seed scripts (`seed.js` for demo datasets)
│   │   ├── utils/                # Mailer and helper utilities
│   │   ├── app.js                # Express app initialization & middleware
│   │   └── server.js             # HTTP server entry point
│   └── package.json
│
├── .env.example                  # Environment variable template
├── package.json                  # Root runner scripts
└── README.md                     # Project documentation
```

---

## ⚙️ Local Installation & Setup

Follow these steps to run the complete system locally:

### 1. Prerequisites
- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher) or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas cluster connection URI)

---

### 2. Clone the Repository
```bash
git clone https://github.com/ajayvakadi12/Smart-Warehouse-and-Inventory-Management.git
cd Smart-Warehouse-and-Inventory-Management
```

---

### 3. Environment Configuration

Create a `.env` file in the root or `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_warehouse?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration (for OTP Password Reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

> 📌 **Note on OTP**: If `EMAIL_USER` / `EMAIL_PASS` are not set during local development, the backend automatically prints the generated OTP to the terminal console so you can test password resets without an SMTP server.

---

### 4. Install Dependencies

You can install dependencies for both the frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 5. Seed the Demo Database (Optional but Recommended)

Populate your database with sample warehouses, categories, suppliers, products, and the standard demo users (`admin`, `manager`, `staff`):

```bash
cd backend
npm run seed
```

---

### 6. Run the Application

#### Option A: Running from the root directory
```bash
# Start backend API (runs on http://localhost:5000)
npm run dev:backend

# In a separate terminal, start frontend (runs on http://localhost:5173)
npm run dev:frontend
```

#### Option B: Running individually
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser to access the dashboard.

---

## 🔗 Key API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `POST` | `/api/auth/send-otp` | Generate and dispatch password-reset OTP | Public |
| `POST` | `/api/auth/verify-otp` | Validate submitted OTP | Public |
| `POST` | `/api/auth/reset-password` | Set new password with validated OTP | Public |
| `PUT` | `/api/auth/change-password` | Update password for authenticated user | Authenticated |

### 🏭 Warehouses & Storage (`/api/warehouses`, `/api/racks`, `/api/bins`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/warehouses` | Fetch all warehouses with occupancy stats | Authenticated |
| `POST` | `/api/warehouses` | Create a new warehouse | Admin / Manager |
| `GET` | `/api/racks` | List racks mapped to warehouses | Authenticated |
| `GET` | `/api/bins` | List storage bins mapped to racks | Authenticated |

### 📦 Products & Inventory (`/api/products`, `/api/stock-transactions`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve products (search, filter, pagination) | Authenticated |
| `POST` | `/api/products` | Add a new inventory item | Admin / Manager |
| `PUT` | `/api/products/:id` | Update product details | Admin / Manager |
| `DELETE`| `/api/products/:id` | Remove a product from registry | Admin |
| `POST` | `/api/stock-transactions` | Record a Stock-In or Stock-Out transaction | Authenticated |

### 🚚 Shipments & Suppliers (`/api/shipments`, `/api/suppliers`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/suppliers` | List all verified suppliers | Authenticated |
| `POST` | `/api/suppliers` | Add a new supplier profile | Admin / Manager |
| `GET` | `/api/shipments` | List inbound/outbound shipments | Authenticated |
| `PUT` | `/api/shipments/:id`| Update shipment status (e.g., Delivered) | Authenticated |

---

## 🚀 Deployment Guide (Vercel)

The frontend is configured for deployment on **Vercel**:
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Set the Framework Preset to `Vite`.
4. Ensure `frontend/vercel.json` is present to handle client-side routing rewrites:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
5. Configure environment variables (e.g. `VITE_API_URL`) in your Vercel Project Settings.

---

## 🛡️ License

This project is licensed under the **ISC License**. Feel free to use, modify, and distribute it for personal and commercial applications.

