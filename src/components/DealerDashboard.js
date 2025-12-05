import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import BackButton from './BackButton';
import './DealerDashboard.css';

const DealerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  // Start with sold-products tab to show sales details immediately after login
  const [activeTab, setActiveTab] = useState('sold-products');
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'BIOFERTILIZERS',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login/dealer');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load orders (sales) from database
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ordersError && ordersData) {
        setSales(ordersData);
      }

      // Load products - In a real app, this would come from a products table
      // For now, we'll use a static list that can be extended
      loadProducts();
      
      // Calculate sold products from orders
      calculateSoldProducts(ordersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSoldProducts = (orders) => {
    const productMap = {};
    
    orders.forEach(order => {
      const items = order.order_items || [];
      items.forEach(item => {
        const productName = item.name || item.productName || 'Unknown Product';
        const productId = item.id || productName;
        const quantity = item.quantity || 0;
        const price = parseFloat(item.price || item.productPrice || 0);
        const total = quantity * price;
        
        if (productMap[productId]) {
          productMap[productId].quantity += quantity;
          productMap[productId].totalSales += total;
          productMap[productId].orderCount += 1;
        } else {
          productMap[productId] = {
            id: productId,
            name: productName,
            price: price,
            quantity: quantity,
            totalSales: total,
            orderCount: 1
          };
        }
      });
    });
    
    const soldProductsList = Object.values(productMap).sort((a, b) => b.totalSales - a.totalSales);
    setSoldProducts(soldProductsList);
  };

  const loadProducts = async () => {
    try {
      // Load products from Supabase for the current dealer
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('dealer_id', user?.id)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error loading products:', productsError);
        // Fallback to empty array if error
        setProducts([]);
      } else {
        setProducts(productsData || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product in Supabase
        const { data, error } = await supabase
          .from('products')
          .update({
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            category: newProduct.category,
            description: newProduct.description,
            image: newProduct.image || '/images/placeholder.jpg',
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)
          .eq('dealer_id', user?.id)
          .select()
          .single();

        if (error) throw error;

        // Update local state
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? data : p
        );
        setProducts(updatedProducts);
        setEditingProduct(null);
        setShowAddProduct(false);
        setNewProduct({
          name: '',
          price: '',
          category: 'BIOFERTILIZERS',
          description: '',
          image: ''
        });
      } else {
        // Add new product to Supabase
        const { data, error } = await supabase
          .from('products')
          .insert([{
            dealer_id: user?.id,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            category: newProduct.category,
            description: newProduct.description,
            image: newProduct.image || '/images/placeholder.jpg',
            in_stock: true
          }])
          .select()
          .single();

        if (error) throw error;

        // Update local state
        setProducts([...products, data]);
        setShowAddProduct(false);
        setNewProduct({
          name: '',
          price: '',
          category: 'BIOFERTILIZERS',
          description: '',
          image: ''
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      image: product.image || ''
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Delete product from Supabase
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)
          .eq('dealer_id', user?.id);

        if (error) throw error;

        // Update local state
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product: ' + error.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      price: '',
      category: 'BIOFERTILIZERS',
      description: '',
      image: ''
    });
    setShowAddProduct(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Calculate sales statistics
  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
  const totalOrders = sales.length;
  const totalItemsSold = sales.reduce((sum, sale) => {
    const items = sale.order_items || [];
    return sum + items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0);
  }, 0);
  
  // Additional statistics
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  }).reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
  
  const thisMonthSales = sales.filter(sale => {
    const saleDate = new Date(sale.created_at);
    const today = new Date();
    return saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear();
  }).reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
  
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Dealer';

  // Get farmer purchases (orders)
  const farmerPurchases = sales.map(order => ({
    id: order.id,
    farmerEmail: order.user_id ? 'Farmer ID: ' + order.user_id.substring(0, 8) : 'Guest',
    items: order.order_items || [],
    total: order.total,
    date: order.created_at,
    status: order.status
  }));

  if (loading) {
    return (
      <div className="dealer-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dealer-dashboard">
      <div className="dashboard-header">
        <BackButton className="orange" customPath="/dealer" customLabel="Back to Dashboard" />
        <div className="header-content">
          <h1>🏪 Dealer Dashboard</h1>
          <p className="sub-title">One Health Center - Sales & Product Management</p>
        </div>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {userName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p className="stat-number">₹{totalSales.toFixed(2)}</p>
            <p className="stat-label">All Time</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{totalOrders}</p>
            <p className="stat-label">Completed Orders</p>
          </div>
          <div className="stat-card">
            <h3>Items Sold</h3>
            <p className="stat-number">{totalItemsSold}</p>
            <p className="stat-label">Total Units</p>
          </div>
          <div className="stat-card">
            <h3>Today's Sales</h3>
            <p className="stat-number">₹{todaySales.toFixed(2)}</p>
            <p className="stat-label">Today</p>
          </div>
          <div className="stat-card">
            <h3>This Month</h3>
            <p className="stat-number">₹{thisMonthSales.toFixed(2)}</p>
            <p className="stat-label">Current Month</p>
          </div>
          <div className="stat-card">
            <h3>Avg Order Value</h3>
            <p className="stat-number">₹{averageOrderValue.toFixed(2)}</p>
            <p className="stat-label">Per Order</p>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dealer Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'sold-products' ? 'active' : ''}`}
            onClick={() => setActiveTab('sold-products')}
          >
            Sold Products ({soldProducts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales ({totalOrders})
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({farmerPurchases.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Manage Products ({products.length})
          </button>
        </div>

        <div className="content-section">
          {activeTab === 'dashboard' && (
            <div className="data-section">
              <div className="section-header-with-info">
                <div>
                  <h2>Dealer Dashboard Overview</h2>
                  <p className="section-description">
                    Welcome to your dealer dashboard. Manage your products, track sales, and view detailed information about all products sold.
                  </p>
                </div>
                <div className="info-icon-wrapper" title="View detailed information about all products sold by this dealer, including product names, quantities sold, buyers (farmers), sale dates, and revenue generated.">
                  <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <div className="info-tooltip">
                    View detailed information about all products sold by this dealer, including product names, quantities sold, buyers (farmers), sale dates, and revenue generated.
                  </div>
                </div>
              </div>
              
              <div className="dashboard-overview">
                <div className="overview-section">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions-grid">
                    <button 
                      className="action-card"
                      onClick={() => setActiveTab('products')}
                    >
                      <div className="action-icon">➕</div>
                      <h4>Add Product</h4>
                      <p>Add a new product to your inventory</p>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => setActiveTab('sold-products')}
                    >
                      <div className="action-icon">📊</div>
                      <h4>View Sold Products</h4>
                      <p>See all products that have been sold</p>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => setActiveTab('sales')}
                    >
                      <div className="action-icon">💰</div>
                      <h4>Sales Overview</h4>
                      <p>View detailed sales information</p>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => setActiveTab('orders')}
                    >
                      <div className="action-icon">📦</div>
                      <h4>View Orders</h4>
                      <p>See all farmer purchases and orders</p>
                    </button>
                  </div>
                </div>

                <div className="overview-section">
                  <h3>Product Management</h3>
                  <div className="products-preview">
                    <div className="preview-header">
                      <span>Your Products ({products.length})</span>
                      <button 
                        className="view-all-btn"
                        onClick={() => setActiveTab('products')}
                      >
                        Manage All →
                      </button>
                    </div>
                    {products.length === 0 ? (
                      <div className="no-data-small">
                        <p>No products added yet. Click "Add Product" to get started!</p>
                      </div>
                    ) : (
                      <div className="products-preview-grid">
                        {products.slice(0, 4).map(product => (
                          <div key={product.id} className="preview-product-card">
                            <div className="preview-product-image">
                              <img src={product.image || '/images/placeholder.jpg'} alt={product.name} />
                            </div>
                            <div className="preview-product-info">
                              <h4>{product.name}</h4>
                              <p className="preview-price">₹{parseFloat(product.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="data-section">
              <h2>Sales Overview</h2>
              {sales.length === 0 ? (
                <div className="no-data">
                  <p>No sales data available yet.</p>
                </div>
              ) : (
                <>
                  <div className="sales-summary-info">
                    <p><strong>Total Revenue:</strong> ₹{totalSales.toFixed(2)}</p>
                    <p><strong>Total Orders:</strong> {totalOrders}</p>
                    <p><strong>Average Order Value:</strong> ₹{averageOrderValue.toFixed(2)}</p>
                  </div>
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date & Time</th>
                        <th>Items</th>
                        <th>Subtotal</th>
                        <th>Discount</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map(sale => (
                        <tr key={sale.id}>
                          <td><strong>#{sale.id}</strong></td>
                          <td>
                            <div>{new Date(sale.created_at).toLocaleDateString()}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                              {new Date(sale.created_at).toLocaleTimeString()}
                            </div>
                          </td>
                          <td>
                            {(sale.order_items || []).length} item(s)
                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                              {sale.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} units
                            </div>
                          </td>
                          <td>₹{parseFloat(sale.subtotal || 0).toFixed(2)}</td>
                          <td>
                            {parseFloat(sale.discount || 0) > 0 ? (
                              <span style={{ color: '#4caf50' }}>-₹{parseFloat(sale.discount || 0).toFixed(2)}</span>
                            ) : (
                              <span style={{ color: '#999' }}>₹0.00</span>
                            )}
                          </td>
                          <td><strong>₹{parseFloat(sale.total || 0).toFixed(2)}</strong></td>
                          <td>{sale.payment_method || 'cash'}</td>
                          <td>
                            <span className={`badge badge-${sale.status || 'pending'}`}>
                              {sale.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="data-section">
              <div className="section-header">
                <h2>Manage Products</h2>
                <button
                  className="add-product-btn"
                  onClick={() => setShowAddProduct(!showAddProduct)}
                >
                  {showAddProduct ? 'Cancel' : '+ Add New Product'}
                </button>
              </div>

              {showAddProduct && (
                <form onSubmit={handleAddProduct} className="add-product-form">
                  <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Name</label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        required
                      >
                        <option value="BIOFERTILIZERS">Biofertilizers</option>
                        <option value="ORGANIC FERTILIZERS">Organic Fertilizers</option>
                        <option value="CHEMICAL FERTILIZERS">Chemical Fertilizers</option>
                        <option value="WATERSOLUBLES">Water Solubles</option>
                        <option value="SPECIAL PRODUCTS">Special Products</option>
                        <option value="CIB PRODUCT">CIB Product</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows="3"
                      placeholder="Enter product description..."
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="products-grid">
                {products.length === 0 ? (
                  <div className="no-data">
                    <p>No products added yet. Add your first product!</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img src={product.image || '/images/placeholder.jpg'} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <p className="product-price">₹{parseFloat(product.price).toFixed(2)}</p>
                        {product.description && (
                          <p className="product-description">{product.description.substring(0, 50)}...</p>
                        )}
                      </div>
                      <div className="product-actions">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="data-section">
              <h2>Orders - Farmer Purchases</h2>
              {farmerPurchases.length === 0 ? (
                <div className="no-data">
                  <p>No purchases by farmers yet.</p>
                </div>
              ) : (
                <div className="purchases-list">
                  {farmerPurchases.map(purchase => (
                    <div key={purchase.id} className="purchase-card">
                      <div className="purchase-header">
                        <div>
                          <h3>Order #{purchase.id}</h3>
                          <p className="farmer-info">{purchase.farmerEmail}</p>
                          <p className="purchase-date">{new Date(purchase.date).toLocaleDateString()}</p>
                        </div>
                        <div className="purchase-total">
                          <p className="total-amount">₹{parseFloat(purchase.total).toFixed(2)}</p>
                          <span className={`badge badge-${purchase.status}`}>
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                      <div className="purchase-items">
                        <h4>Items Purchased:</h4>
                        <ul>
                          {purchase.items.map((item, idx) => (
                            <li key={idx}>
                              {item.name || item.productName} - Qty: {item.quantity} × ₹{item.price || item.productPrice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sold-products' && (
            <div className="data-section">
              <div className="section-header-with-info">
                <div>
                  <h2>📊 Product Sales Details</h2>
                  <p className="section-description">
                    View detailed information about all products sold, including product names, quantities sold, buyers (farmers), sale dates, and revenue generated.
                  </p>
                </div>
                <div className="info-icon-wrapper" title="View detailed information about all products sold by this dealer, including product names, quantities sold, buyers (farmers), sale dates, and revenue generated.">
                  <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <div className="info-tooltip">
                    View detailed information about all products sold by this dealer, including product names, quantities sold, buyers (farmers), sale dates, and revenue generated.
                  </div>
                </div>
              </div>
              {soldProducts.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">📦</div>
                  <h3>No Products Sold Yet</h3>
                  <p>Start selling products to see detailed sales information here.</p>
                  <button 
                    className="action-button"
                    onClick={() => setActiveTab('products')}
                  >
                    Add Products to Sell
                  </button>
                </div>
              ) : (
                <>
                  <div className="sold-products-summary">
                    <div className="summary-card">
                      <div className="summary-icon">📦</div>
                      <div>
                        <h3>Total Products Sold</h3>
                        <p className="summary-value">{soldProducts.length}</p>
                        <p className="summary-label">Unique Products</p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon">💰</div>
                      <div>
                        <h3>Total Revenue</h3>
                        <p className="summary-value">₹{soldProducts.reduce((sum, p) => sum + p.totalSales, 0).toFixed(2)}</p>
                        <p className="summary-label">From All Sales</p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon">📊</div>
                      <div>
                        <h3>Total Units Sold</h3>
                        <p className="summary-value">{soldProducts.reduce((sum, p) => sum + p.quantity, 0)}</p>
                        <p className="summary-label">Items Sold</p>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon">📋</div>
                      <div>
                        <h3>Total Orders</h3>
                        <p className="summary-value">{totalOrders}</p>
                        <p className="summary-label">Completed Orders</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sales-details-section">
                    <h3>Product Sales Breakdown</h3>
                    <table className="sold-products-table">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Unit Price</th>
                          <th>Quantity Sold</th>
                          <th>Total Sales</th>
                          <th># of Orders</th>
                          <th>Avg per Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {soldProducts.map(product => {
                          const avgPerOrder = product.orderCount > 0 ? (product.totalSales / product.orderCount).toFixed(2) : '0.00';
                          return (
                            <tr key={product.id}>
                              <td><strong>{product.name}</strong></td>
                              <td>₹{product.price.toFixed(2)}</td>
                              <td>
                                <span className="quantity-badge">{product.quantity}</span>
                              </td>
                              <td className="sales-amount">₹{product.totalSales.toFixed(2)}</td>
                              <td>
                                <span className="order-badge">{product.orderCount}</span>
                              </td>
                              <td>₹{avgPerOrder}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td><strong>Grand Total</strong></td>
                          <td>-</td>
                          <td><strong>{soldProducts.reduce((sum, p) => sum + p.quantity, 0)}</strong></td>
                          <td className="sales-amount"><strong>₹{soldProducts.reduce((sum, p) => sum + p.totalSales, 0).toFixed(2)}</strong></td>
                          <td><strong>{totalOrders}</strong></td>
                          <td>
                            <strong>
                              ₹{totalOrders > 0 ? (soldProducts.reduce((sum, p) => sum + p.totalSales, 0) / totalOrders).toFixed(2) : '0.00'}
                            </strong>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Recent Sales Activity */}
                  <div className="recent-sales-section">
                    <h3>Recent Sales Activity</h3>
                    {sales.length > 0 ? (
                      <div className="recent-sales-list">
                        {sales.slice(0, 5).map(sale => (
                          <div key={sale.id} className="recent-sale-card">
                            <div className="sale-date">
                              <div className="date-day">{new Date(sale.created_at).getDate()}</div>
                              <div className="date-month">{new Date(sale.created_at).toLocaleDateString('en-US', { month: 'short' })}</div>
                            </div>
                            <div className="sale-details">
                              <h4>Order #{sale.id}</h4>
                              <p>
                                {sale.order_items?.length || 0} item(s) • 
                                {sale.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} units
                              </p>
                              <div className="sale-items-preview">
                                {sale.order_items?.slice(0, 3).map((item, idx) => (
                                  <span key={idx} className="item-tag">
                                    {item.name || item.productName} (x{item.quantity})
                                  </span>
                                ))}
                                {sale.order_items?.length > 3 && (
                                  <span className="item-tag more">+{sale.order_items.length - 3} more</span>
                                )}
                              </div>
                            </div>
                            <div className="sale-amount">
                              <div className="amount-value">₹{parseFloat(sale.total || 0).toFixed(2)}</div>
                              <div className="amount-status">
                                <span className={`badge badge-${sale.status || 'pending'}`}>
                                  {sale.status || 'pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {sales.length > 5 && (
                          <button 
                            className="view-all-sales-btn"
                            onClick={() => setActiveTab('sales')}
                          >
                            View All Sales ({sales.length})
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="no-recent-sales">
                        <p>No recent sales activity</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;

