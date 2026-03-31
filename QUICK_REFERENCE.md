# 🚀 Quick Reference Card

## ⚡ One-Command Setup
```bash
setup-admin.bat
```

## 🔑 Admin Login
- **URL**: http://localhost:5173/admin/login
- **Email**: admin@pizzahut.com
- **Password**: Admin@123

## 📦 Manual Installation

### Backend
```bash
cd backend
npm install bcryptjs
node createAdmin.js
npm start
```

### Frontend
```bash
cd Login
npm install chart.js react-chartjs-2
npm run dev
```

## 🌐 Routes

### User Routes (Existing)
- `/` - Home
- `/order` - Order Menu
- `/cart` - Shopping Cart
- `/checkout` - Checkout
- `/login` - User Login
- `/signup` - User Signup

### Admin Routes (New)
- `/admin/login` - Admin Login
- `/admin/dashboard` - Analytics
- `/admin/orders` - Orders Management
- `/admin/menu` - Menu CRUD

## 🔌 API Endpoints

### Admin APIs
```
POST   /api/admin/login
GET    /api/admin/dashboard
GET    /api/admin/orders
PUT    /api/admin/orders/:orderId
GET    /api/admin/menu
POST   /api/admin/menu
PUT    /api/admin/menu/:itemId
DELETE /api/admin/menu/:category/:itemId
```

### Order APIs
```
POST   /api/orders/create
GET    /api/orders/my-orders
```

## 📊 Dashboard Features
- ✅ Total Revenue
- ✅ Total Orders
- ✅ Total Cost
- ✅ Net Profit
- ✅ Weekly Sales Chart
- ✅ Monthly Orders Chart

## 🛠️ Menu Management
- ✅ Add Items
- ✅ Edit Items
- ✅ Delete Items
- ✅ Categories: Pizzas, Drinks, Melts, Desserts, Pastas, Sides

## 📦 Orders Management
- ✅ View All Orders
- ✅ Filter by Status
- ✅ Update Status (Pending → Preparing → Delivered)
- ✅ Customer Details

## 🔐 Security
- ✅ JWT Authentication
- ✅ Bcrypt Password Hashing
- ✅ Protected Routes
- ✅ Role-Based Access
- ✅ Token Expiration (7 days)

## 📁 New Files Created

### Backend (9 files)
- models/adminModel.js
- models/orderModel.js
- middleware/adminAuthMiddleware.js
- controller/adminController.js
- controller/orderController.js
- routes/adminRoute.js
- routes/orderRoute.js
- createAdmin.js
- index.js (updated)

### Frontend (7 files)
- Admin/pages/AdminLogin.jsx
- Admin/pages/AdminDashboard.jsx
- Admin/pages/OrdersManagement.jsx
- Admin/pages/MenuManagement.jsx
- Admin/components/AdminSidebar.jsx
- Admin/components/AnalyticsCharts.jsx
- App.jsx (updated)

## 🐛 Troubleshooting

### Admin Login Fails
```bash
node createAdmin.js
```

### Charts Not Showing
```bash
npm install chart.js react-chartjs-2
```

### 401 Unauthorized
- Token expired → Login again
- Check Authorization header

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URL in .env

## 📝 Environment Variables Required
```
JWT_SECRET=your_secret_key
MONGO_URL=mongodb://localhost:27017/pizzahut
PORT=8080
```

## 🎯 Testing Checklist
- [ ] Admin login works
- [ ] Dashboard displays stats
- [ ] Charts render
- [ ] Orders can be filtered
- [ ] Order status updates
- [ ] Menu items CRUD works
- [ ] Logout works
- [ ] Token expiration handled

## 📞 Support Files
- **ADMIN_SETUP.md** - Detailed setup guide
- **IMPLEMENTATION_SUMMARY.md** - Complete overview
- **CHECKOUT_INTEGRATION_EXAMPLE.js** - Order integration
- **QUICK_REFERENCE.md** - This file

---

**🍕 Ready to manage your Pizza Hut platform!**
