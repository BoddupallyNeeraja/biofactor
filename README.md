# 🌿 One Health Center - Organic Products Ecommerce Store

A modern, responsive ecommerce website for organic products built with React.

## Features

- 🛍️ **Product Catalog** - Browse through a wide range of organic products
- 🔐 **User Authentication** - Sign up and login functionality with localStorage
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- 🔍 **Product Search** - Search and filter products by category
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🛒 **Product Details** - Detailed product pages with related products

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
one-health-center-project/
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
│   ├── utils/
│   │   └── storage.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## User Data Storage

The application uses **localStorage** to store user registration and login data:
- User accounts are stored in `onehealthcenter_users` key
- Current logged-in user is stored in `onehealthcenter_currentUser` key
- Data persists across browser sessions

### To view stored data:
1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Check `onehealthcenter_users` for all registered users

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- CSS3 (Custom styling)
- localStorage (Data persistence)

## Features Breakdown

### Authentication
- User signup with validation
- User login with authentication
- Session management with localStorage
- Protected routes (ready for implementation)

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

- This is a **frontend-only** application
- User data is stored in browser localStorage
- Product data is static (can be connected to a backend API)
- Cart functionality is UI-only (can be extended)

## Future Enhancements

- Backend API integration
- Shopping cart functionality
- Payment gateway integration
- User profile management
- Order history
- Product reviews and ratings


