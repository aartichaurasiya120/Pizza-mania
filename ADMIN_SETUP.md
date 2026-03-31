# 🔐 Admin Dashboard Setup Guide

## 📋 Prerequisites

Before setting up the admin dashboard, ensure you have:
- Node.js installed
- MongoDB running
- Backend and Frontend dependencies installed

---

## 🚀 Backend Setup

### 1. Install Required Dependencies

Navigate to the backend folder and install bcryptjs:

```bash
cd backend
npm install bcryptjs
```

### 2. Create Admin Account

Run the admin creation script:

```bash
node createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@pizzahut.com`
- Password: `Admin@123`

⚠️ **Important:** Change these credentials in production!

### 3. Start Backend Server

```bash
npm start
```

Server will run on `http://localhost:8080`

---

## 🎨 Frontend Setup

### 1. Install Chart.js Dependencies

Navigate to the Login folder and install required packages:

```bash
cd ../Login
npm install chart.js react-chartjs-2
```

### 2. Start Frontend Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (or your configured port)

---

## 🔑 Admin Access

### Login URL
```
http://localhost:5173/admin/login
```

### Admin Routes
- `/admin/login` - Admin Login Page
- `/admin/dashboard` - Analytics Dashboard
- `/admin/orders` - Orders Management
- `/admin/menu` - Menu CRUD Operations

---

## 📊 Features Implemented

### ✅ Admin Authentication
- Separate admin login system
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes with middleware
- Token expiration handling

### ✅ Dashboard Analytics
- Total Revenue display
- Total Orders count
- Total Cost calculation
- Net Profit/Loss overview
- Weekly Sales Chart (Line Chart)
- Monthly Orders Chart (Bar Chart)

### ✅ Orders Management
- View all orders
- Filter by status (Pending/Preparing/Delivered)
- Update order status
- View customer details
- Order date tracking

### ✅ Menu Management (CRUD)
- Add new items (Pizza, Drinks, Melts, Desserts, Pastas, Sides)
- Edit existing items
- Delete items
- Update prices, descriptions, images
- Category-based organization

---

## 🗂️ Project Structure

```
backend/
├── models/
│   ├── adminModel.js          # Admin schema
│   ├── orderModel.js          # Order schema
│   └── ...existing models
├── controller/
│   ├── adminController.js     # Admin business logic
│   ├── orderController.js     # Order handling
│   └── ...existing controllers
├── routes/
│   ├── adminRoute.js          # Admin API routes
│   ├── orderRoute.js          # Order API routes
│   └── ...existing routes
├── middleware/
│   ├── adminAuthMiddleware.js # Admin authentication
│   └── authMiddleware.js      # User authentication
├── createAdmin.js             # Admin creation script
└── index.js                   # Updated with new routes

Login/src/
├── Admin/
│   ├── pages/
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── OrdersManagement.jsx
│   │   └── MenuManagement.jsx
│   └── components/
│       ├── AdminSidebar.jsx
│       └── AnalyticsCharts.jsx
└── App.jsx                    # Updated with admin routes
```

---

## 🔒 Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Tokens**: 7-day expiration
3. **Role-Based Access**: Admin-only routes
4. **Token Validation**: Middleware protection
5. **Secure Headers**: Authorization Bearer tokens

---

## 📡 API Endpoints

### Admin Authentication
```
POST /api/admin/login
Body: { email, password }
```

### Dashboard
```
GET /api/admin/dashboard
Headers: { Authorization: Bearer <token> }
```

### Orders
```
GET /api/admin/orders?status=<status>
PUT /api/admin/orders/:orderId
Headers: { Authorization: Bearer <token> }
```

### Menu
```
GET /api/admin/menu?category=<category>
POST /api/admin/menu
PUT /api/admin/menu/:itemId
DELETE /api/admin/menu/:category/:itemId
Headers: { Authorization: Bearer <token> }
```

### User Orders (for checkout integration)
```
POST /api/orders/create
GET /api/orders/my-orders
Headers: { Authorization: Bearer <token> }
```

---

## 🎯 Usage Instructions

### For Admin:
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access dashboard, orders, or menu management
4. Logout when done

### For Users:
- User flow remains unchanged
- Orders are automatically tracked in admin panel
- Users can continue ordering normally

---

## 🔧 Customization

### Change Admin Credentials
Edit `backend/createAdmin.js`:
```javascript
const adminEmail = 'your-email@example.com';
const adminPassword = 'YourSecurePassword';
```

### Modify Profit Calculation
Edit `backend/controller/adminController.js`:
```javascript
const estimatedCost = (totalRevenue[0]?.total || 0) * 0.4; // Change 0.4 to your cost ratio
```

### Customize Chart Colors
Edit `Login/src/Admin/components/AnalyticsCharts.jsx`:
```javascript
borderColor: 'rgb(220, 38, 38)', // Change colors
backgroundColor: 'rgba(220, 38, 38, 0.5)',
```

---

## 🐛 Troubleshooting

### Issue: Admin login fails
- Ensure admin account is created: `node createAdmin.js`
- Check MongoDB connection
- Verify JWT_SECRET in .env file

### Issue: Charts not displaying
- Install chart.js: `npm install chart.js react-chartjs-2`
- Clear browser cache
- Check console for errors

### Issue: 401 Unauthorized
- Token expired - login again
- Check Authorization header format
- Verify middleware is applied

---

## 📝 Notes

- Admin credentials are stored in MongoDB, NOT in frontend
- JWT tokens expire after 7 days
- All admin routes are protected with middleware
- Profit calculation uses 40% cost estimation (customizable)
- Charts use Chart.js v4 with React wrapper

---

## 🚀 Next Steps

Consider implementing:
- Email notifications for orders
- Real-time order updates (Socket.io)
- Advanced analytics (customer insights)
- Export reports (PDF/Excel)
- Image upload for menu items
- Multi-admin support with roles

---

## 📞 Support

For issues or questions:
1. Check console logs (browser & server)
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check API endpoint URLs match your setup

---

**Happy Managing! 🍕**
