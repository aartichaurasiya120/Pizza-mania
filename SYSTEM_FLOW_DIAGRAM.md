# 🔄 System Flow Diagram - Pizza Hut Ordering System

## 📊 Complete Order Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER SIDE                                │
└─────────────────────────────────────────────────────────────────┘

1. Browse Menu
   ↓
2. Add Items to Cart
   ↓
3. View Cart
   ↓
4. Go to Checkout
   ↓
5. Fill Form
   - Name
   - Address
   - Phone
   ↓
6. Select Payment Method
   - COD
   - UPI/GPay
   ↓
7. Click "Submit Order"
   ↓
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
└─────────────────────────────────────────────────────────────────┘

8. Receive Order Request
   ↓
9. Validate JWT Token
   ↓
10. Get User Details
   ↓
11. Calculate Profit
    - For each item:
      costPrice = sellingPrice × 0.4
    - totalCostPrice = Σ(costPrice × quantity)
    - netProfit = totalSellingPrice - totalCostPrice
   ↓
12. Save Order to MongoDB
    {
      userId, items, totalSellingPrice,
      totalCostPrice, netProfit,
      paymentMethod, status: "Pending",
      customerDetails, timestamp
    }
   ↓
13. Clear User's Cart
   ↓
14. Return Success Response
   ↓
┌─────────────────────────────────────────────────────────────────┐
│                         USER SIDE                                │
└─────────────────────────────────────────────────────────────────┘

15. Show Success Modal
    "Order Submitted Successfully!"
   ↓
16. Cart Cleared
   ↓
17. Redirect to Menu
   ↓
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN SIDE                               │
└─────────────────────────────────────────────────────────────────┘

18. Dashboard Auto-Refreshes (30s)
   ↓
19. Fetch Analytics from MongoDB
    - Total Orders: COUNT(*)
    - Total Revenue: SUM(totalSellingPrice)
    - Total Cost: SUM(totalCostPrice)
    - Net Profit: SUM(netProfit)
    - Pending: COUNT(status='Pending')
    - Delivered: COUNT(status='Delivered')
    - Recent 5 Orders
   ↓
20. Display Real-time Data
   ↓
21. Admin Views Orders
   ↓
22. Admin Changes Status
    Pending → Delivered
   ↓
23. Update MongoDB
   ↓
24. Dashboard Refreshes
    - Pending count decreases
    - Delivered count increases
   ↓
25. Cycle Continues...
```

---

## 💰 Profit Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORDER RECEIVED                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FOR EACH ITEM                                 │
├─────────────────────────────────────────────────────────────────┤
│  Item: Margherita Pizza                                          │
│  Selling Price: ₹299                                             │
│  Quantity: 2                                                     │
│                                                                   │
│  Calculate Cost:                                                 │
│  costPrice = 299 × 0.4 = ₹119.60                                │
│                                                                   │
│  Item Total:                                                     │
│  Selling: 299 × 2 = ₹598                                        │
│  Cost: 119.60 × 2 = ₹239.20                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SUM ALL ITEMS                                 │
├─────────────────────────────────────────────────────────────────┤
│  Total Selling Price: ₹598                                       │
│  Total Cost Price: ₹239.20                                       │
│                                                                   │
│  Net Profit = 598 - 239.20 = ₹358.80                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SAVE TO DATABASE                              │
├─────────────────────────────────────────────────────────────────┤
│  {                                                               │
│    totalSellingPrice: 598,                                       │
│    totalCostPrice: 239.20,                                       │
│    netProfit: 358.80                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Dashboard Analytics Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN OPENS DASHBOARD                         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FETCH DATA FROM MONGODB                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Query 1: Total Orders                                           │
│  db.orders.countDocuments()                                      │
│  Result: 25                                                      │
│                                                                   │
│  Query 2: Pending Orders                                         │
│  db.orders.countDocuments({status: 'Pending'})                   │
│  Result: 8                                                       │
│                                                                   │
│  Query 3: Delivered Orders                                       │
│  db.orders.countDocuments({status: 'Delivered'})                 │
│  Result: 17                                                      │
│                                                                   │
│  Query 4: Financial Stats (Aggregation)                          │
│  db.orders.aggregate([                                           │
│    {$group: {                                                    │
│      _id: null,                                                  │
│      totalRevenue: {$sum: "$totalSellingPrice"},                 │
│      totalCost: {$sum: "$totalCostPrice"},                       │
│      totalProfit: {$sum: "$netProfit"}                           │
│    }}                                                            │
│  ])                                                              │
│  Result: {                                                       │
│    totalRevenue: 14950,                                          │
│    totalCost: 5980,                                              │
│    totalProfit: 8970                                             │
│  }                                                               │
│                                                                   │
│  Query 5: Recent 5 Orders                                        │
│  db.orders.find().sort({createdAt: -1}).limit(5)                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DISPLAY ON DASHBOARD                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Revenue  │  │  Orders  │  │ Pending  │  │Delivered │       │
│  │ ₹14,950  │  │    25    │  │    8     │  │    17    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
│  ┌──────────┐  ┌──────────┐                                     │
│  │   Cost   │  │  Profit  │                                     │
│  │  ₹5,980  │  │  ₹8,970  │                                     │
│  └──────────┘  └──────────┘                                     │
│                                                                   │
│  Recent Orders:                                                  │
│  1. John Doe - ₹598 - Pending                                   │
│  2. Jane Smith - ₹450 - Delivered                               │
│  3. Bob Wilson - ₹799 - Pending                                 │
│  4. Alice Brown - ₹350 - Delivered                              │
│  5. Charlie Davis - ₹299 - Pending                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    Wait 30 seconds
                            ↓
                    Auto-refresh
                            ↓
                    Fetch data again
                            ↓
                    Update display
```

---

## 🔄 Status Change Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ADMIN VIEWS ORDERS MANAGEMENT                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ORDERS TABLE                                  │
├─────────────────────────────────────────────────────────────────┤
│  ID    Customer    Amount   Cost    Profit   Status             │
│  ─────────────────────────────────────────────────────────      │
│  #123  John Doe    ₹598    ₹239    ₹359     [Pending ▼]        │
│  #124  Jane Smith  ₹450    ₹180    ₹270     [Delivered ▼]      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                  Admin clicks dropdown
                            ↓
                  Selects "Delivered"
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SEND UPDATE REQUEST                           │
├─────────────────────────────────────────────────────────────────┤
│  PUT /api/admin/orders/123                                       │
│  Body: { status: "Delivered" }                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    UPDATE MONGODB                                │
├─────────────────────────────────────────────────────────────────┤
│  db.orders.updateOne(                                            │
│    { _id: "123" },                                               │
│    { $set: { status: "Delivered" } }                             │
│  )                                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    IMMEDIATE EFFECTS                             │
├─────────────────────────────────────────────────────────────────┤
│  1. Order table updates                                          │
│     Status badge changes to "Delivered"                          │
│                                                                   │
│  2. Dashboard auto-refresh (within 30s)                          │
│     - Pending count: 8 → 7                                       │
│     - Delivered count: 17 → 18                                   │
│                                                                   │
│  3. Recent orders list updates                                   │
│     Shows new status                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Data Flow Summary

```
USER ACTION → BACKEND PROCESSING → DATABASE UPDATE → ADMIN VIEW

Place Order → Calculate Profit → Save to MongoDB → Dashboard Updates
    ↓              ↓                    ↓                  ↓
  Cart         Cost = 40%          Order Doc          Real-time
  Items        of Selling          Created            Analytics
    ↓              ↓                    ↓                  ↓
  Submit       Profit =             Status:            Auto-refresh
  Form         Selling-Cost         "Pending"          Every 30s
    ↓              ↓                    ↓                  ↓
  Success      Stored in            Cart              Admin Sees
  Message      Database             Cleared           New Order
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CHECK JWT TOKEN                               │
├─────────────────────────────────────────────────────────────────┤
│  Authorization: Bearer <token>                                   │
│                                                                   │
│  Valid? → Continue                                               │
│  Invalid? → 401 Unauthorized                                     │
│  Expired? → 401 Token Expired                                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTRACT USER ID                               │
├─────────────────────────────────────────────────────────────────┤
│  Decode token → Get userId                                       │
│  Attach to request                                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESS REQUEST                               │
├─────────────────────────────────────────────────────────────────┤
│  Use userId for database operations                              │
│  Ensure user can only access their data                          │
└─────────────────────────────────────────────────────────────────┘
```

---

**This visual flow shows exactly how your Pizza Hut ordering system works from start to finish! 🍕**
