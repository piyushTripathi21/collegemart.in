# Complete Feature Testing Guide

## ✅ Feature: Seller Wallet & Coins Reward System

### Overview
Sellers earn 10 coins each time they mark a product as sold. Coins are displayed in the user's wallet on the profile page.

## Test Scenarios

### Scenario 1: Mark Product as Sold
**Prerequisites:**
- User is logged in
- User has a product they are selling
- Product is marked as available (not sold)

**Steps:**
1. Navigate to the product details page for your product
2. Look for the **"✓ Mark Sold"** button (only visible to the seller)
3. Click the **"✓ Mark Sold"** button
4. Wait for the confirmation alert

**Expected Results:**
- ✅ Alert shows: "Product marked as sold! You earned 10 coins. Total coins: [X]"
- ✅ "✓ Mark Sold" button disappears
- ✅ Product shows "SOLD" badge instead of "AVAILABLE"
- ✅ Product no longer appears in search results as available

### Scenario 2: View Wallet in Profile
**Prerequisites:**
- User has marked at least one product as sold (has coins > 0)
- User is logged in

**Steps:**
1. Click on **Profile** in the navigation
2. Look at the page

**Expected Results:**
- ✅ Beautiful gradient wallet section appears prominently
- ✅ Wallet displays: "💰 My Wallet" heading
- ✅ Coin count is displayed (e.g., "10 coins")
- ✅ Message: "Earn coins by marking products as sold"
- ✅ Coin count matches total earned

### Scenario 3: Multiple Products Marked as Sold
**Prerequisites:**
- User has multiple products

**Steps:**
1. Mark first product as sold → should see alert with 10 coins
2. Go to profile → should see 10 coins in wallet
3. Go back and mark another product as sold → should see alert with 20 coins total
4. Go to profile → should see 20 coins in wallet

**Expected Results:**
- ✅ Coins accumulate correctly
- ✅ Each product mark adds exactly 10 coins
- ✅ Wallet updates automatically

### Scenario 4: Prevent Duplicate Marking
**Prerequisites:**
- Product is already marked as sold

**Steps:**
1. Try to access the product details
2. Look for "✓ Mark Sold" button

**Expected Results:**
- ✅ "✓ Mark Sold" button is not visible
- ✅ Product shows "SOLD" badge

### Scenario 5: Session Persistence
**Prerequisites:**
- User has coins from marking products as sold
- Session will be closed and reopened

**Steps:**
1. Note coin count in wallet (e.g., 30 coins)
2. Logout from profile
3. Clear browser cache (optional)
4. Login again
5. Go to profile

**Expected Results:**
- ✅ Coins are still there (30 coins)
- ✅ Data persists across sessions

## UI Elements

### Mark Sold Button
- Location: Product details page
- Label: "✓ Mark Sold"
- Color: Purple (#8b5cf6)
- Visible to: Product seller only
- Hidden from: Other users and after product is sold
- Hover effect: Darker purple

### Wallet Section
- Location: Top of profile page (after greeting)
- Background: Pink to red gradient
- Icon: 💰 (coin emoji)
- Displays: Current coin count
- Helper text: "Earn coins by marking products as sold"

## API Endpoints

### Mark Product as Sold
```
POST /api/products/:id/mark-sold
Headers: Authorization: Bearer {token}
Response: {
  message: "Product marked as sold successfully",
  coins_earned: 10,
  total_coins: {new_total}
}
```

### Get User Info (includes coins)
```
GET /api/users/me
GET /api/users/login
POST /api/users/register
PUT /api/users/:id
Response includes: coins field
```

## Database Changes

### Users Table
- New column: `coins INT DEFAULT 0`
- Migration script: `migrate-wallet.js`
- Status: ✅ Successfully migrated

## File Changes

### Backend
- `server.js` - Updated all user endpoints to include coins field

### Frontend
- `ProfilePage.jsx` - Added wallet section with real-time updates
- `ProductDetailsPage.jsx` - Updated mark-sold handler to sync coins

### Database
- Added `coins` column to users table
- Default value: 0 for all users

## Success Criteria

✅ All test scenarios pass
✅ Coins are awarded correctly (10 per product)
✅ Wallet displays in profile
✅ Coins persist across sessions
✅ Mark sold button appears only for seller
✅ No duplicate marking allowed
✅ Product shows sold badge after marking
✅ Real-time updates work correctly
