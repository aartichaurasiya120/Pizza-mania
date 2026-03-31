# 🏗️ Admin Dashboard Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  User Side   │  │  Admin Side  │  │   Shared     │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ • Home       │  │ • Login      │  │ • Context    │          │
│  │ • Menu       │  │ • Dashboard  │  │ • Components │          │
│  │ • Cart       │  │ • Orders     │  │ • Utils      │          │
│  │ • Checkout   │  │ • Menu CRUD  │  │              │          │
│  │ • Auth       │  │ • Analytics  │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ JWT Tokens
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes                             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ /practice/*        │ User routes (existing)              │  │
│  │ /api/admin/*       │ Admin routes (new)                  │  │
│  │ /api/orders/*      │ Order routes (new)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │                    Middleware                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • authMiddleware.js       │ User authentication         │  │
│  │ • adminAuthMiddleware.js  │ Admin authentication        │  │
│  │ • CORS                    │ Cross-origin requests       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────▼──────────────────────────────┐  │
│  │                    Controllers                           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • userController          │ User operations             │  │
│  │ • adminController         │ Admin operations            │  │
│  │ • orderController         │ Order operations            │  │
│  │ • menuControllers         │ Menu operations             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ Mongoose ODM
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Collections  │  │ Collections  │  │ Collections  │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ • users      │  │ • admins     │  │ • pizzas     │          │
│  │ • orders     │  │              │  │ • drinks     │          │
│  │              │  │              │  │ • melts      │          │
│  │              │  │              │  │ • desserts   │          │
│  │              │  │              │  │ • pastas     │          │
│  │              │  │              │  │ • sides      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### User Authentication
```
User Login
    │
    ├─► POST /practice/login
    │       │
    │       ├─► Validate credentials
    │       ├─► Generate JWT (role: user)
    │       └─► Return token
    │
    └─► Store token in localStorage
            │
            └─► Use in Authorization header
                    │
                    └─► Access user routes
```

### Admin Authentication
```
Admin Login
    │
    ├─► POST /api/admin/login
    │       │
    │       ├─► Validate credentials
    │       ├─► Check admin role
    │       ├─► Generate JWT (role: admin)
    │       └─► Return token
    │
    └─► Store token in localStorage
            │
            └─► Use in Authorization header
                    │
                    ├─► adminAuthMiddleware checks role
                    │
                    └─► Access admin routes
```

## Data Flow

### Order Creation Flow
```
User Cart
    │
    ├─► Checkout Page
    │       │
    │       └─► POST /api/orders/create
    │               │
    │               ├─► authMiddleware validates user
    │               ├─► orderController.createOrder
    │               │       │
    │               │       ├─► Get user details
    │               │       ├─► Create order document
    │               │       └─► Save to MongoDB
    │               │
    │               └─► Return order confirmation
    │
    └─► Order appears in Admin Panel
            │
            └─► GET /api/admin/orders
                    │
                    └─► Admin can view & manage
```

### Menu Management Flow
```
Admin Menu Page
    │
    ├─► View Items
    │   └─► GET /api/admin/menu
    │
    ├─► Add Item
    │   └─► POST /api/admin/menu
    │           │
    │           └─► Save to category collection
    │
    ├─► Edit Item
    │   └─► PUT /api/admin/menu/:itemId
    │           │
    │           └─► Update in collection
    │
    └─► Delete Item
        └─► DELETE /api/admin/menu/:category/:itemId
                │
                └─► Remove from collection
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Request from Client             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Layer 1: CORS Middleware             │
│    • Validates origin                   │
│    • Checks headers                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Layer 2: JWT Validation              │
│    • Extracts token                     │
│    • Verifies signature                 │
│    • Checks expiration                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Layer 3: Role Verification           │
│    • Checks user/admin role             │
│    • Validates permissions              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Layer 4: Controller Logic            │
│    • Business logic                     │
│    • Database operations                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Response to Client              │
└─────────────────────────────────────────┘
```

## Component Hierarchy

### Admin Frontend Structure
```
App.jsx
    │
    └─► Admin Routes
            │
            ├─► AdminLogin.jsx
            │       │
            │       └─► Standalone page
            │
            └─► Admin Dashboard Layout
                    │
                    ├─► AdminSidebar.jsx
                    │       │
                    │       ├─► Navigation links
                    │       └─► Logout button
                    │
                    └─► Page Content
                            │
                            ├─► AdminDashboard.jsx
                            │       │
                            │       ├─► Stats cards
                            │       └─► AnalyticsCharts.jsx
                            │               │
                            │               ├─► Line chart
                            │               └─► Bar chart
                            │
                            ├─► OrdersManagement.jsx
                            │       │
                            │       ├─► Filter dropdown
                            │       └─► Orders table
                            │
                            └─► MenuManagement.jsx
                                    │
                                    ├─► Items grid
                                    └─► Add/Edit modal
```

## Database Schema Relationships

```
┌──────────────┐
│    users     │
│──────────────│
│ _id          │◄─────┐
│ userName     │      │
│ email        │      │
│ password     │      │
│ phone        │      │
│ address      │      │
└──────────────┘      │
                      │
                      │ userId (ref)
                      │
┌──────────────┐      │
│   orders     │      │
│──────────────│      │
│ _id          │      │
│ userId       │──────┘
│ items[]      │
│ totalAmount  │
│ status       │
│ customerName │
│ createdAt    │
└──────────────┘

┌──────────────┐
│   admins     │
│──────────────│
│ _id          │
│ email        │
│ password     │
└──────────────┘

┌──────────────┐
│   pizzas     │
│──────────────│
│ _id          │
│ tittle       │
│ description  │
│ img          │
│ prices       │
│ calories     │
└──────────────┘

(Similar for drinks, melts, desserts, pastas, sides)
```

## Technology Stack

```
┌─────────────────────────────────────────┐
│            Frontend Stack               │
├─────────────────────────────────────────┤
│ • React.js         │ UI Framework       │
│ • React Router     │ Navigation         │
│ • Axios            │ HTTP Client        │
│ • Chart.js         │ Data Visualization │
│ • Tailwind CSS     │ Styling            │
│ • Vite             │ Build Tool         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            Backend Stack                │
├─────────────────────────────────────────┤
│ • Node.js          │ Runtime            │
│ • Express.js       │ Web Framework      │
│ • MongoDB          │ Database           │
│ • Mongoose         │ ODM                │
│ • JWT              │ Authentication     │
│ • Bcrypt           │ Password Hashing   │
│ • CORS             │ Cross-Origin       │
│ • Morgan           │ Logging            │
└─────────────────────────────────────────┘
```

## Deployment Considerations

```
Development Environment
    │
    ├─► Backend: localhost:8080
    ├─► Frontend: localhost:5173
    └─► MongoDB: localhost:27017

Production Environment
    │
    ├─► Backend: Heroku/AWS/DigitalOcean
    ├─► Frontend: Vercel/Netlify
    └─► MongoDB: MongoDB Atlas
```

---

**This architecture ensures:**
- ✅ Separation of concerns
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Clear data flow
- ✅ Role-based access control
