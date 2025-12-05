# ONE HEALTH CENTER - Multi-User System Documentation

## Overview

This system implements a comprehensive multi-user platform for **ONE HEALTH CENTER** (a sub-brand of BIOFACTOR) with three distinct user roles:

1. **Admin** - Manages and views information about Dealers and Farmers
2. **Dealer** - Manages products, tracks sales, and views farmer purchases
3. **Farmer** - Views and purchases products

## User Roles & Dashboards

### 👨‍💼 Admin Dashboard (`/admin/dashboard`)

**Access:** `/login/admin`

**Features:**
- View all registered Dealers
- View all registered Farmers
- Search functionality for dealers and farmers
- Statistics showing total dealers, farmers, and users
- User information including:
  - Name
  - Email
  - User Type
  - Registration Date
  - Status

### 🏪 Dealer Dashboard (`/dealer/dashboard`)

**Access:** `/login/dealer`

**Features:**
1. **Sales Overview**
   - Total sales amount
   - Total number of orders
   - Total items sold
   - Detailed sales table

2. **Product Management**
   - Add new products
   - View all products added by dealer
   - Product details (name, price, category, description, image)

3. **Farmer Purchases**
   - View all purchases made by farmers
   - Order details including:
     - Order ID
     - Farmer information
     - Items purchased
     - Total amount
     - Purchase date
     - Order status

### 🌾 Farmer Dashboard (`/farmer/dashboard`)

**Access:** `/login/farmer`

**Features:**
- Browse all available products
- Search products by name or description
- Filter products by category:
  - BIOFERTILIZERS
  - ORGANIC FERTILIZERS
  - CHEMICAL FERTILIZERS
  - WATERSOLUBLES
  - SPECIAL PRODUCTS
  - CIB PRODUCT
- Add products to cart
- View product details and prices

## Login Forms

All login forms are accessible through the main navigation:

- **Admin Login:** `/login/admin`
- **Dealer Login:** `/login/dealer`
- **Farmer Login:** `/login/farmer` (default login)

## Setup Instructions

### 1. Database Migration

Run the following SQL scripts in your Supabase SQL Editor:

1. **Main Migration** (`supabase_migration.sql`)
   - Creates profiles, carts, and orders tables
   - Sets up Row Level Security (RLS)

2. **User Type Migration** (`supabase_user_type_migration.sql`)
   - Adds `user_type` column to profiles table
   - Creates indexes for better performance
   - Updates trigger function to include user_type

### 2. Environment Variables

Make sure your `.env` file includes:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. User Registration

Users can register through the Signup form (`/signup`) and select their user type:
- Farmer (default)
- Dealer
- Admin

### 4. Authentication Flow

1. User signs up with email, password, name, and user type
2. User type is stored in the `profiles` table
3. On login, users are redirected to their respective dashboards:
   - Admin → `/admin/dashboard`
   - Dealer → `/dealer/dashboard`
   - Farmer → `/farmer/dashboard`
   - Others → Home page

## File Structure

```
src/components/
├── AdminLogin.js          # Admin login form
├── AdminDashboard.js      # Admin dashboard with dealer/farmer info
├── DealerLogin.js         # Dealer login form
├── DealerDashboard.js     # Dealer dashboard (sales, products, purchases)
├── FarmerLogin.js         # Farmer login form
├── FarmerDashboard.js     # Farmer dashboard (product browsing)
└── ... (other components)
```

## Database Schema

### Profiles Table
- `id` (UUID) - Primary key, references auth.users
- `name` (TEXT)
- `user_type` (TEXT) - 'admin', 'dealer', or 'farmer' (default)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Orders Table
- `id` (BIGSERIAL) - Primary key
- `user_id` (UUID) - References auth.users
- `order_items` (JSONB) - Array of ordered products
- `total` (DECIMAL) - Total order amount
- `status` (TEXT) - Order status
- `created_at` (TIMESTAMPTZ)

## Features by Role

### Admin
- ✅ View all dealers
- ✅ View all farmers
- ✅ Search users
- ✅ View user statistics

### Dealer
- ✅ View sales statistics
- ✅ Add new products (stored in localStorage, can be migrated to DB)
- ✅ View farmer purchases/orders
- ✅ Track total sales and items sold

### Farmer
- ✅ Browse all products
- ✅ Search and filter products
- ✅ Add products to cart
- ✅ View product details

## Future Enhancements

1. **Database Integration for Products**
   - Move dealer-added products to database
   - Create proper products table with dealer association

2. **Admin Features**
   - User management (activate/deactivate users)
   - Email fetching for users
   - More detailed user statistics

3. **Dealer Features**
   - Edit/delete products
   - Product inventory management
   - Sales reports and analytics

4. **Farmer Features**
   - Order history
   - Favorite products
   - Order tracking

## Notes

- Currently, dealer-added products are stored in `localStorage` for simplicity
- Admin email fetching requires admin API access (configure in production)
- All dashboards include logout functionality
- User authentication is handled by Supabase Auth
- Row Level Security (RLS) ensures users can only access their own data

## Support

For issues or questions, refer to:
- Supabase documentation: https://supabase.com/docs
- React Router documentation: https://reactrouter.com/
- Project README.md

