# Supabase Storage for Farmer Data

All farmer-related data is now stored in Supabase instead of localStorage. This ensures data persistence, security, and scalability.

## Database Tables

### 1. **profiles** Table
Stores user profile information for all users (Farmers, Dealers, Admins).

**Columns:**
- `id` (UUID) - Primary key, references `auth.users(id)`
- `name` (TEXT) - User's name
- `user_type` (TEXT) - Type of user: 'farmer', 'dealer', or 'admin'
- `created_at` (TIMESTAMPTZ) - Account creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Location:** All farmer profiles are stored here with `user_type = 'farmer'`

### 2. **orders** Table
Stores all orders placed by farmers (and other users).

**Columns:**
- `id` (BIGSERIAL) - Primary key
- `user_id` (UUID) - References `auth.users(id)` - The farmer who placed the order
- `order_items` (JSONB) - Array of items in the order
- `subtotal` (DECIMAL) - Order subtotal
- `discount` (DECIMAL) - Discount applied
- `total` (DECIMAL) - Final total amount
- `shipping_address` (JSONB) - Shipping address information
- `payment_method` (TEXT) - Payment method used
- `status` (TEXT) - Order status (pending, completed, etc.)
- `created_at` (TIMESTAMPTZ) - Order creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Location:** All farmer orders are stored here with `user_id` pointing to the farmer's user ID

### 3. **products** Table
Stores products managed by dealers.

**Columns:**
- `id` (BIGSERIAL) - Primary key
- `dealer_id` (UUID) - References `auth.users(id)` - The dealer who owns the product
- `name` (TEXT) - Product name
- `price` (DECIMAL) - Product price
- `category` (TEXT) - Product category
- `description` (TEXT) - Product description
- `image` (TEXT) - Product image URL
- `in_stock` (BOOLEAN) - Stock availability
- `created_at` (TIMESTAMPTZ) - Product creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Location:** All dealer products are stored here

## Migration Scripts

### Step 1: Run Main Migration
Run `supabase_migration.sql` in your Supabase SQL Editor to create:
- `profiles` table
- `orders` table
- `carts` table
- RLS policies

### Step 2: Run User Type Migration
Run `supabase_user_type_migration.sql` to add:
- `user_type` column to `profiles` table
- Updated trigger function

### Step 3: Run Products Migration
Run `supabase_products_migration.sql` to create:
- `products` table for dealers
- RLS policies for products

## Data Flow

### Farmer Registration
1. Farmer signs up via `AuthContext.signUp()`
2. Supabase Auth creates user in `auth.users`
3. Trigger automatically creates profile in `profiles` table with `user_type = 'farmer'`

### Farmer Orders
1. Farmer adds items to cart (stored in `carts` table or sessionStorage)
2. Farmer completes checkout via `Checkout.js`
3. Order is created in `orders` table with `user_id` = farmer's ID
4. Order items include product details in JSONB format

### Dealer Products
1. Dealer adds product via `DealerDashboard.js`
2. Product is saved to `products` table with `dealer_id` = dealer's ID
3. Products are fetched from Supabase when dealer logs in

### Viewing Farmer Data
- **Admin Dashboard:** Fetches all profiles with `user_type = 'farmer'` from `profiles` table
- **Dealer Dashboard:** Fetches all orders from `orders` table (shows farmer purchases)
- **Farmer Dashboard:** Fetches farmer's own orders from `orders` table filtered by `user_id`

## Security (RLS Policies)

### Profiles Table
- Users can view their own profile
- Users can update their own profile
- Admins can view all profiles (if configured)

### Orders Table
- Users can view their own orders
- Users can create their own orders
- Dealers can view all orders (for sales tracking)
- Admins can view all orders

### Products Table
- Anyone can view products (for browsing)
- Dealers can create/update/delete their own products

## Benefits of Supabase Storage

1. **Persistence:** Data survives browser refresh and device changes
2. **Security:** Row Level Security (RLS) ensures users only access their own data
3. **Scalability:** Can handle large amounts of data efficiently
4. **Real-time:** Can implement real-time updates if needed
5. **Backup:** Supabase automatically backs up your data
6. **Multi-device:** Farmers can access their data from any device

## No More localStorage

All data that was previously stored in localStorage has been migrated to Supabase:
- ❌ `dealer_products` (localStorage) → ✅ `products` table (Supabase)
- ✅ `profiles` table (Supabase) - Always was in Supabase
- ✅ `orders` table (Supabase) - Always was in Supabase

## Testing

After running the migration scripts:
1. Create a farmer account
2. Place an order
3. Verify the order appears in Supabase `orders` table
4. Login as dealer and verify you can see farmer orders
5. Login as admin and verify you can see farmer profiles

