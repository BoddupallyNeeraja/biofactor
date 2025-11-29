# 🌿 BIOFACTOR - Organic Products Ecommerce Store

A modern, responsive ecommerce website for organic products built with React.

## Features

- 🛍️ **Product Catalog** - Browse through a wide range of organic products
- 🔐 **User Authentication** - Sign up and login functionality with Supabase
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔍 **Product Search** - Search and filter products by category
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🛒 **Shopping Cart** - Add products to cart with quantity management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier works fine)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a project at [https://app.supabase.com](https://app.supabase.com)
   - Get your project URL and anon key from Settings → API
   - Create a `.env` file in the root directory:
     ```env
     REACT_APP_SUPABASE_URL=your_supabase_project_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
biofactor-project/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Home.js
│   │   ├── Products.js
│   │   ├── ProductDetail.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── *.css
│   ├── data/
│   │   └── products.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── lib/
│   │   └── supabase.js
│   ├── utils/
│   │   └── storage.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Authentication & Data Storage

The application uses **Supabase** for user authentication:
- User accounts are securely stored in Supabase Auth
- Sessions are automatically managed by Supabase
- Cart data is stored in browser localStorage (can be synced to Supabase)
- All authentication is handled securely through Supabase's infrastructure

### Supabase Setup
See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed setup instructions.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- Supabase (Authentication & Backend)
- @supabase/supabase-js 2.39.0
- CSS3 (Custom styling)
- localStorage (Cart persistence)

## Features Breakdown

### Authentication
- User signup with email validation
- User login with Supabase Auth
- Secure session management
- Email verification support
- Automatic session persistence

### Products
- Product listing page with search and filter
- Product detail pages
- Related products suggestions
- Category-based filtering

### Design
- Modern gradient designs
- Smooth animations and transitions
- Mobile-first responsive layout
- Accessible color schemes

## Notes

- Authentication is handled by **Supabase** (backend-as-a-service)
- User data is securely stored in Supabase Auth
- Product data is static (can be moved to Supabase database)
- Cart data is stored in localStorage (can be synced to Supabase)
- Requires `.env` file with Supabase credentials to run

## Future Enhancements

- Backend API integration
- Shopping cart functionality
- Payment gateway integration
- User profile management
- Order history
- Product reviews and ratings


