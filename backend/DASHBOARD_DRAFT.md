# Shop Dashboard MVP Draft (Quickest Value)

## Scope
This draft is **shop dashboard only** (no admin view) and excludes logistics.

MVP metrics:
- Overview cards
- Revenue trend
- Payment split
- Top products by revenue

---

## Data Sources (Current Project)
- Payment: `amount`, `status`, `provider`, `paid_at`, `orderId[]`
- Order: `shopId`, `orderItemsId[]`, `createdAt`
- OrderItem: `quantity`, `unit_price`, `productId`
- Product: `name`

---

## KPI Definitions (Simple)

### 1) Overview Cards
Return these 4 cards:
1. `revenue`
   - `SUM(payment.amount)` for successful payments in date range
2. `orders`
   - `COUNT(distinct order._id)` linked to those payments
3. `aov`
   - `revenue / orders` (0 if orders=0)
4. `successfulPaymentRate`
   - `COUNT(successful payments) / COUNT(all payments)`

Default successful status: `completed`

### 2) Revenue Trend
- Group successful payment revenue by bucket (`day|week|month`)
- Date source: `paid_at` fallback `createdAt`

### 3) Payment Split
- Group payments by `provider`
- Return `count` + `percentage`

### 4) Top Products by Revenue
- From shop orders -> orderItems
- Product revenue formula: `SUM(quantity * unit_price)` grouped by `productId`
- Return top N (default 5)

---

## Shop-Only Filtering Rule (Important)
Always scope data to authenticated shop owner:
1. Find all shops of current user (`Shop.userId = authUserId`)
2. Find orders where `Order.shopId IN shopIds`
3. Use those order IDs when querying payments/items

Do not return anything outside these order IDs.

---

## Minimal API Draft

## Endpoint: GET /dashboard/shop/overview
Purpose: one endpoint for quick MVP dashboard.

Query params:
- `from` (ISO date, optional)
- `to` (ISO date, optional)
- `granularity` = day | week | month (default: day)
- `topN` (default: 5)

Response:
```json
{
  "cards": {
    "revenue": 0,
    "orders": 0,
    "aov": 0,
    "successfulPaymentRate": 0
  },
  "revenueTrend": [
    { "bucket": "2026-03-01", "value": 0 }
  ],
  "paymentSplit": [
    { "provider": "esewa", "count": 0, "percentage": 0 }
  ],
  "topProductsByRevenue": [
    { "productId": "", "name": "", "revenue": 0, "qty": 0 }
  ]
}
```

---

## Fast Implementation Plan
1. `dashboard.repository.ts`
   - Add aggregate helpers for cards/trend/split/top-products
2. `dashboard.service.ts`
   - Compose response and defaults (`from`, `to`, `granularity`, `topN`)
3. `dashboard.controller.ts` + `dashboard.routes.ts`
   - Add `GET /dashboard/shop/overview` with auth middleware

---

## MVP Notes
- Keep statuses configurable, but default to `completed`.
- Use UTC boundaries for date filters.
- If no shops/orders/payments, return zeros and empty arrays (not errors).
