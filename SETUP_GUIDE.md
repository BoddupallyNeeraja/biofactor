# BIOFACTOR Ecommerce Setup Guide

Complete guide to set up and run the BIOFACTOR ecommerce website with backend and database.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Razorpay account (for payments) - optional for testing

## Project Structure

```
biofactor-project/
├── public/
├── src/                    # Frontend React app
├── server/                 # Backend Express server
├── package.json           # Frontend dependencies
└── server/package.json    # Backend dependencies
```

## Step 1: Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Step 2: Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install backend dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/biofactor
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=rzp_test_your_secret
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Step 3: Database Setup

### Option A: Local MongoDB

1. Install MongoDB locally:
   - Windows: Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   mongod
   ```

3. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/biofactor
   ```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/biofactor
   ```

## Step 4: Payment Gateway Setup (Optional)

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Dashboard → Settings → API Keys
3. Copy Test Key ID and Test Key Secret
4. Add to `server/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

Note: For production, use Live keys instead of Test keys.

## Step 5: Running the Application

### Terminal 1 - Frontend:
```bash
npm start
```

### Terminal 2 - Backend:
```bash
cd server
npm run dev
```

Both servers should be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Features

### ✅ Completed Features

1. **Product Catalog**
   - Browse 68 products
   - Category filtering
   - Search functionality
   - Product detail pages

2. **Shopping Cart**
   - Add to cart
   - Update quantities
   - Remove items
   - Price calculations with discounts

3. **Checkout Process**
   - Shipping information form
   - Payment method selection
   - Order summary
   - Order confirmation

4. **Backend API**
   - RESTful endpoints
   - MongoDB database
   - Order management
   - Payment integration structure

5. **User Authentication**
   - Sign up
   - Login
   - localStorage persistence

### 🔄 Quantity & Price Display

When you click on a product:
- Quantity selector with +/- buttons
- Real-time price calculation
- Price breakdown showing:
  - Unit price
  - Quantity
  - Subtotal
  - Discounts (5% for 5+, 10% for 10+)
  - Total price

### 💳 Payment Flow

1. Add products to cart
2. Click "Proceed to Checkout" in cart
3. Fill shipping information
4. Select payment method (Card/UPI/COD)
5. Place order
6. Get order confirmation

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order by ID

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify-payment` - Verify payment
- `POST /api/payments/cod-confirm` - Confirm COD order

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user

## Troubleshooting

### Backend not connecting to MongoDB
- Check if MongoDB is running
- Verify MONGODB_URI in `.env`
- Check MongoDB connection logs

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in `server.js`
- Verify API endpoint URLs in frontend

### Payment errors
- Verify Razorpay keys in `.env`
- Check Razorpay dashboard for logs
- Ensure keys are for correct environment (test/production)

## Next Steps

1. **Add Product Images**: Place product images in `public/images/products/` directory
2. **Configure Payment**: Add real Razorpay keys for production
3. **Add Email Notifications**: Configure nodemailer for order confirmations
4. **Deploy**: Deploy frontend and backend to hosting services
5. **Add Admin Panel**: Create admin interface for order management

## Support

For issues or questions, check the code comments or server logs for detailed error messages.

