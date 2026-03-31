# 🧪 Testing Guide - Pizza Hut Ordering System

## 🚀 Quick Test Steps

### 1. Test User Order Flow

#### Step 1: Add Items to Cart
```
1. Go to http://localhost:5173/order/Pizza
2. Add 2-3 pizza items to cart
3. Verify items appear in cart
```

#### Step 2: Checkout
```
1. Go to checkout page
2. Fill form:
   - Name: Test User
   - Address: 123 Test Street, Test City
   - Phone: 1234567890
3. Select payment method: Cash on Delivery
4. Click "Submit Order"
```

#### Step 3: Verify Success
```
✅ Success modal should appear
✅ Message: "Order Submitted Successfully!"
✅ Cart should be empty
✅ Redirected to menu page
```

---

### 2. Test Admin Dashboard

#### Step 1: Login to Admin
```
1. Go to http://localhost:5173/admin/login
2. Email: admin@pizzahut.com
3. Password: Admin@123
4. Click Login
```

#### Step 2: Check Dashboard
```
✅ Total Orders should show count
✅ Total Revenue should show amount
✅ Total Cost should show amount
✅ Net Profit should show (Revenue - Cost)
✅ Pending Orders should show count
✅ Delivered Orders should show count
✅ Recent 5 orders should display
✅ Charts should render
```

#### Step 3: Verify Auto-Refresh
```
1. Keep dashboard open
2. Place a new order from user side
3. Wait 30 seconds
✅ Dashboard should update automatically
✅ Total Orders should increase
✅ Revenue should increase
✅ New order should appear in recent orders
```

---

### 3. Test Order Management

#### Step 1: View Orders
```
1. Click "Orders" in sidebar
2. Verify table shows:
   - Order ID
   - Customer Name
   - Total Amount
   - Total Cost
   - Net Profit (green if positive)
   - Payment Method
   - Status
   - Date
```

#### Step 2: Change Order Status
```
1. Find a "Pending" order
2. Click status dropdown
3. Select "Delivered"
✅ Status should update immediately
✅ Status badge should change color
```

#### Step 3: Verify Dashboard Update
```
1. Go back to Dashboard
✅ Pending Orders count should decrease
✅ Delivered Orders count should increase
✅ All other stats remain correct
```

---

## 🔍 Detailed Testing Scenarios

### Scenario 1: COD Payment
```
Test: Place order with Cash on Delivery
Expected:
- Order saved with paymentMethod: "COD"
- Status: "Pending"
- Profit calculated correctly
- Cart cleared
```

### Scenario 2: UPI Payment
```
Test: Place order with UPI/GPay
Expected:
- QR code displayed
- Order saved with paymentMethod: "UPI"
- Status: "Pending"
- Profit calculated correctly
- Cart cleared
```

### Scenario 3: Multiple Orders
```
Test: Place 3 orders in sequence
Expected:
- All 3 orders saved
- Dashboard shows correct total
- All orders visible in admin panel
- Profit calculated for each
```

### Scenario 4: Status Change
```
Test: Change order from Pending to Delivered
Expected:
- Status updates in database
- Dashboard stats update
- Order table reflects change
- Auto-refresh works
```

---

## 📊 Profit Calculation Test

### Test Case 1: Single Item Order
```
Item: Margherita Pizza
Selling Price: ₹299
Cost Price: ₹119.60 (40% of selling)
Quantity: 1

Expected:
- Total Selling Price: ₹299
- Total Cost Price: ₹119.60
- Net Profit: ₹179.40
```

### Test Case 2: Multiple Items Order
```
Item 1: Pizza - ₹299 × 2 = ₹598
Item 2: Drink - ₹99 × 1 = ₹99
Total Selling: ₹697

Cost 1: ₹119.60 × 2 = ₹239.20
Cost 2: ₹39.60 × 1 = ₹39.60
Total Cost: ₹278.80

Expected Net Profit: ₹418.20
```

---

## 🔄 Auto-Refresh Test

### Dashboard Auto-Refresh
```
1. Open admin dashboard
2. Note current stats
3. Place new order from user side
4. Wait 30 seconds
✅ Stats should update automatically
✅ New order in recent orders
✅ Charts should update
```

### Orders Page Auto-Refresh
```
1. Open orders management
2. Place new order from user side
3. Wait 30 seconds
✅ New order should appear in table
✅ No page refresh needed
```

---

## 🐛 Error Handling Tests

### Test 1: Invalid Phone Number
```
Input: 123 (less than 10 digits)
Expected: Alert "Please provide a valid phone number"
```

### Test 2: Invalid Address
```
Input: "Test" (less than 10 characters)
Expected: Alert "Please provide a valid address"
```

### Test 3: Empty Cart
```
Action: Try to checkout with empty cart
Expected: Alert "Please select any thing to order"
```

### Test 4: Unauthorized Admin Access
```
Action: Access /admin/dashboard without login
Expected: Redirect to /admin/login
```

---

## 📈 Performance Tests

### Load Test
```
1. Place 10 orders quickly
2. Check admin dashboard
✅ All orders should appear
✅ Calculations should be correct
✅ No performance issues
```

### Concurrent Test
```
1. Open 2 browser windows
2. Place orders simultaneously
✅ Both orders should save
✅ No data loss
✅ Dashboard shows both
```

---

## ✅ Final Verification Checklist

### User Side
- [ ] Can add items to cart
- [ ] Can view cart
- [ ] Can proceed to checkout
- [ ] Form validation works
- [ ] Can select payment method
- [ ] Order submits successfully
- [ ] Success message appears
- [ ] Cart clears automatically

### Admin Side
- [ ] Can login to admin panel
- [ ] Dashboard loads with real data
- [ ] All cards show correct values
- [ ] Charts render properly
- [ ] Recent orders display
- [ ] Can view all orders
- [ ] Can filter orders
- [ ] Can change order status
- [ ] Profit calculations correct
- [ ] Auto-refresh works

### Database
- [ ] Orders saved correctly
- [ ] Profit calculated automatically
- [ ] Status updates persist
- [ ] Timestamps recorded
- [ ] User data linked correctly

---

## 🎯 Expected Results Summary

### After Placing Order
```
✅ Order in MongoDB with:
   - Customer details
   - Items with quantities
   - Selling price
   - Cost price
   - Net profit (auto-calculated)
   - Payment method
   - Status: "Pending"
   - Timestamp

✅ User sees:
   - Success modal
   - Empty cart
   - Redirected to menu

✅ Admin sees:
   - New order in table
   - Updated dashboard stats
   - Order in recent orders
```

### After Status Change
```
✅ Database updated
✅ Dashboard stats updated
✅ Order table reflects change
✅ Status badge color changed
```

---

## 🔧 Troubleshooting

### Issue: Order not appearing in admin
**Solution**: Check if auto-refresh is working (wait 30 seconds) or manually refresh

### Issue: Profit showing as 0
**Solution**: Ensure costPrice is set or defaults to 40% of selling price

### Issue: Cart not clearing
**Solution**: Check if DELETE /api/practice/addcart endpoint is working

### Issue: Dashboard not updating
**Solution**: Check if auto-refresh interval is running (30 seconds)

---

## 🎉 Success Criteria

Your system is working correctly if:
- ✅ Users can place orders smoothly
- ✅ Orders appear in admin immediately
- ✅ Profit is calculated automatically
- ✅ Dashboard shows real-time data
- ✅ Status changes work
- ✅ Auto-refresh functions
- ✅ No errors in console
- ✅ All calculations are accurate

**Happy Testing! 🍕**
