import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import BackButton from './BackButton';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dealers, setDealers] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dealers');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login/admin');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Fetch all profiles with user_type
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Separate dealers and farmers from profiles
      // Note: Email fetching requires admin API or a custom endpoint
      // For now, we'll use the profiles data
      const dealersList = [];
      const farmersList = [];

      profiles.forEach(profile => {
        const userData = {
          id: profile.id,
          name: profile.name || 'N/A',
          email: 'user@example.com', // In production, fetch from auth.users via admin API
            user_type: profile.user_type || 'farmer',
          created_at: profile.created_at,
          updated_at: profile.updated_at
        };

        if (profile.user_type === 'dealer') {
          dealersList.push(userData);
        } else if (profile.user_type === 'farmer') {
          farmersList.push(userData);
        }
      });

      setDealers(dealersList);
      setFarmers(farmersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredDealers = dealers.filter(dealer =>
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dealer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Admin';

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <BackButton className="admin" customPath="/" customLabel="Back to Home" />
        <div className="header-content">
          <h1>👨‍💼 Admin Dashboard</h1>
          <p className="sub-title">One Health Center - User Management</p>
        </div>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {userName}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'dealers' ? 'active' : ''}`}
            onClick={() => setActiveTab('dealers')}
          >
            Dealers ({dealers.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'farmers' ? 'active' : ''}`}
            onClick={() => setActiveTab('farmers')}
          >
            Farmers ({farmers.length})
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="data-section">
          {activeTab === 'dealers' ? (
            <div className="users-table">
              <h2>Dealer Information</h2>
              {filteredDealers.length === 0 ? (
                <div className="no-data">
                  <p>No dealers found.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>User Type</th>
                      <th>Registered Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDealers.map(dealer => (
                      <tr key={dealer.id}>
                        <td>{dealer.name}</td>
                        <td>{dealer.email}</td>
                        <td>
                          <span className="badge badge-dealer">{dealer.user_type}</span>
                        </td>
                        <td>{new Date(dealer.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className="badge badge-active">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="users-table">
              <h2>Farmer Information</h2>
              {filteredFarmers.length === 0 ? (
                <div className="no-data">
                  <p>No farmers found.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>User Type</th>
                      <th>Registered Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFarmers.map(farmer => (
                      <tr key={farmer.id}>
                        <td>{farmer.name}</td>
                        <td>{farmer.email}</td>
                        <td>
                          <span className="badge badge-farmer">{farmer.user_type}</span>
                        </td>
                        <td>{new Date(farmer.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className="badge badge-active">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Dealers</h3>
            <p className="stat-number">{dealers.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Farmers</h3>
            <p className="stat-number">{farmers.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{dealers.length + farmers.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

