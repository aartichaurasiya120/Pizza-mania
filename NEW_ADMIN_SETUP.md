# 🍕 Pizza Hut Admin Panel - Setup Guide

## ✅ What Has Been Created

### New Traditional Admin Panel with Pure CSS
- **NO Tailwind CSS** - Pure CSS only
- Professional red & black Pizza Hut theme
- Background image effects with dark overlay
- Fully responsive layout
- Traditional admin panel design

---

## 📁 File Structure

```
Login/src/admin/
├── pages/
│   ├── AdminLogin.jsx          ✨ Login page
│   ├── AdminDashboard.jsx      ✨ Dashboard with charts
│   ├── OrdersManagement.jsx    ✨ Orders table
│   └── MenuManagement.jsx      ✨ Menu CRUD
├── components/
│   ├── Sidebar.jsx             ✨ Navigation sidebar
│   ├── Topbar.jsx              ✨ Top header bar
│   ├── SummaryCard.jsx         ✨ Dashboard cards
│   └── ProtectedRoute.jsx      ✨ Route protection
└── styles/
    ├── admin.css               ✨ Main styles + login
    ├── dashboard.css           ✨ Dashboard styles
    ├── table.css               ✨ Table styles
    ├── sidebar.css             ✨ Sidebar styles
    └── topbar.css              ✨ Topbar styles
```

---

## 🚀 Quick Start

### 1. Backend is Already Set Up
The backend routes and controllers are already in place from previous setup.

### 2. Admin Credentials
```
Email: admin@pizzahut.com
Password: Admin@123
```

### 3. Access Admin Panel
```
URL: http://localhost:5173/admin/login
```

---

## 🎨 Design Features

### Color Scheme
- Primary Red: `#b30000`
- Dark Red: `#8b0000`
- Black: `#111`
- Dark Gray: `#1a1a1a`
- White: `#fff`

### Visual Effects
- Background images with dark overlay
- Hover animations on cards and buttons
- Smooth transitions
- Glass effect cards
- Shadow effects
- Professional table design

### Layout
- Left sidebar navigation (260px)
- Top header bar
- Main content area
- Sticky positioning
- Mobile responsive

---

## 📊 Features Implemented

### 1. Admin Login
- Background image with overlay
- Professional login form
- Error handling
- JWT token storage as "adminToken"
- Redirect to dashboard on success

### 2. Dashboard
- Summary cards with icons:
  - Total Revenue
  - Total Orders
  - Total Cost
  - Net Profit/Loss
- Weekly Revenue Chart (Line)
- Monthly Orders Chart (Bar)
- Hover effects on cards
- Real-time data

### 3. Orders Management
- Professional data table
- Filter by status (All/Pending/Preparing/Delivered)
- Update order status dropdown
- Pagination (10 orders per page)
- Scrollable table
- Status badges with colors
- Hover effects on rows

### 4. Menu Management
- View all menu items (all categories)
- Add new item modal
- Edit item modal
- Delete item with confirmation
- Image preview in table
- Category selection
- Price management
- CRUD operations

---

## 🔐 Security Features

### Protected Routes
All admin routes except login are protected with ProtectedRoute component:
- Checks for adminToken in localStorage
- Redirects to login if not authenticated
- Wraps dashboard, orders, and menu pages

### Backend Middleware
- verifyAdmin middleware on all protected routes
- JWT token verification
- Role-based access control

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full sidebar visible
- Multi-column grid layouts
- Large charts

### Tablet (768px - 1024px)
- Sidebar toggleable
- Adjusted grid layouts
- Responsive tables

### Mobile (< 768px)
- Hamburger menu for sidebar
- Single column layouts
- Horizontal scroll for tables
- Stacked cards
- Mobile-optimized forms

---

## 🎯 API Endpoints Used

```
POST   /api/admin/login              - Admin login
GET    /api/admin/dashboard          - Dashboard stats
GET    /api/admin/orders             - Get all orders
PUT    /api/admin/orders/:orderId    - Update order status
GET    /api/admin/menu               - Get all menu items
POST   /api/admin/menu               - Add menu item
PUT    /api/admin/menu/:itemId       - Update menu item
DELETE /api/admin/menu/:itemId       - Delete menu item
```

---

## 🔧 How to Use

### Login
1. Navigate to `/admin/login`
2. Enter credentials
3. Click Login
4. Redirected to dashboard

### Dashboard
- View summary cards
- Check weekly/monthly charts
- Monitor business metrics

### Orders Management
1. Click "Orders" in sidebar
2. Filter by status if needed
3. Update order status using dropdown
4. Navigate pages using pagination

### Menu Management
1. Click "Menu" in sidebar
2. View all items in table
3. Click "Add Item" to add new
4. Click "Edit" to modify item
5. Click "Delete" to remove item
6. Fill form and submit

---

## 🎨 CSS Architecture

### Modular CSS Files
Each component has its own CSS file:
- `admin.css` - Global admin styles + login
- `dashboard.css` - Dashboard specific
- `table.css` - Table and modal styles
- `sidebar.css` - Sidebar navigation
- `topbar.css` - Top header bar

### CSS Variables
```css
:root {
    --primary-red: #b30000;
    --dark-red: #8b0000;
    --black: #111;
    --dark-gray: #1a1a1a;
    --light-gray: #333;
    --white: #fff;
    --shadow: rgba(0, 0, 0, 0.5);
}
```

### Hover Effects
All interactive elements have smooth hover transitions:
- Cards lift up on hover
- Buttons change color
- Table rows highlight
- Sidebar items animate

---

## 📈 Chart.js Integration

### Installation
Charts are already integrated using Chart.js and react-chartjs-2.

### Chart Types
- **Line Chart**: Weekly revenue trend
- **Bar Chart**: Monthly orders count

### Customization
Charts use Pizza Hut theme colors:
- Border: `#b30000`
- Background: `rgba(179, 0, 0, 0.1)`
- Grid: `rgba(255,255,255,0.1)`
- Text: `#fff` and `#999`

---

## 🐛 Troubleshooting

### Issue: Admin login fails
**Solution**: Ensure admin account exists in database
```bash
cd backend
node createAdmin.js
```

### Issue: Charts not displaying
**Solution**: Charts are already installed, check console for errors

### Issue: Styles not loading
**Solution**: CSS files are imported in components, check import paths

### Issue: 401 Unauthorized
**Solution**: Token expired or invalid, login again

---

## ✨ Key Differences from Previous Version

### What Changed
1. ❌ **Removed**: Tailwind CSS completely
2. ✅ **Added**: Pure CSS with separate files
3. ✅ **Added**: Background images with overlay
4. ✅ **Added**: Traditional admin layout
5. ✅ **Added**: Professional red/black theme
6. ✅ **Added**: Enhanced hover effects
7. ✅ **Added**: Better responsive design
8. ✅ **Added**: Glass effect cards

### File Structure
- Old: `Admin/` folder
- New: `admin/` folder (lowercase)
- Separate CSS files for each component
- Better organization

---

## 🎉 Ready to Use!

Your new traditional admin panel is ready with:
- ✅ Pure CSS (no Tailwind)
- ✅ Professional design
- ✅ Background images
- ✅ Red & black theme
- ✅ Fully responsive
- ✅ All features working

**Access it at**: http://localhost:5173/admin/login

**Login with**:
- Email: admin@pizzahut.com
- Password: Admin@123

---

**Enjoy your new professional Pizza Hut Admin Panel! 🍕**
