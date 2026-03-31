# Admin Login Update Guide

## ✅ Admin Email Updated

The admin email has been changed to: **adminpizzahut@gmail.com**

## 🔄 Steps to Apply Changes:

### 1. Navigate to backend folder:
```bash
cd backend
```

### 2. Run the admin creation script:
```bash
node createAdmin.js
```

This will:
- Connect to MongoDB
- Create/update admin account with new email
- Hash the password securely

### 3. Restart your backend server:
```bash
npm start
```

## 🔐 New Admin Credentials:

- **Email:** `adminpizzahut@gmail.com`
- **Password:** `Admin@123`

## ✅ What Was Changed:

- ✅ Backend: `createAdmin.js` - Email updated to `adminpizzahut@gmail.com`
- ✅ Frontend: Already has correct placeholder in login form
- ✅ Authentication: Works with MongoDB stored credentials
- ✅ All other functionality: Unchanged

## 🧪 Test Login:

1. Go to: `http://localhost:5173/admin/login`
2. Enter email: `adminpizzahut@gmail.com`
3. Enter password: `Admin@123`
4. Click Login

You should be redirected to the admin dashboard!

## 📝 Note:

The system uses MongoDB for authentication, not hardcoded credentials. The `createAdmin.js` script creates the admin account in the database with the hashed password.
