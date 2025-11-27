# BIOFACTOR Backend Server

Backend API server for BIOFACTOR ecommerce website.

## Features

- RESTful API endpoints
- MongoDB database integration
- User authentication (JWT)
- Order management
- Payment integration (Razorpay)
- Product management

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- MongoDB connection string
- Razorpay API keys
- JWT secret

### 3. Setup MongoDB

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# Then update MONGODB_URI in .env
MONGODB_URI=mongodb://localhost:27017/biofactor
```

**Option 2: MongoDB Atlas (Cloud)**
```bash
# Get connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/biofactor
```

### 4. Setup Razorpay

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from the dashboard
3. Add them to `.env`:
```
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=rzp_test_your_key_secret
```

### 5. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create/Update product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:orderId/status` - Update order status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment
- `POST /api/payments/cod-confirm` - Confirm COD order

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Health Check
- `GET /api/health` - Check server status

## Database Models

### Order
- orderId (unique)
- items (array)
- customerInfo
- payment
- totals
- status

### Product
- id (unique)
- name
- price
- image
- description
- category
- inStock

### User
- name
- email (unique)
- password (hashed)
- addresses
- orders

## Notes

- For production, add authentication middleware to protect routes
- Add rate limiting for API endpoints
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Add proper error handling and logging

