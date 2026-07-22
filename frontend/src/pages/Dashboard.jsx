import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import VehicleCard from '../components/VehicleCard';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all vehicles from the database on component mount
  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/vehicles');
      if (res.data.status === 'success') {
        setVehicles(res.data.data.vehicles || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handlePurchaseSuccess = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  };

  // Mock admin callbacks for now
  const handleEdit = (vehicle) => {
    console.log('Edit clicked for:', vehicle);
  };

  const handleRestock = (vehicle) => {
    console.log('Restock clicked for:', vehicle);
  };

  const handleDelete = async (id) => {
    console.log('Delete clicked for ID:', id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Premium Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
              AUTOmata
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-200">{user?.name}</div>
              <div className="text-xs text-teal-400 capitalize">{user?.role}</div>
            </div>
            
            <button
              onClick={logout}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-xl border border-slate-800 transition-all duration-300 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Dashboard Title & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Active Inventory</h2>
            <p className="text-slate-400 mt-1">Explore and manage high-performance vehicles.</p>
          </div>
        </div>

        {/* Dynamic States */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 mb-8 max-w-lg">
            <h4 className="font-bold mb-1">Error Loading Inventory</h4>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchVehicles}
              className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-1.5 px-4 rounded-xl text-xs transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          /* Loading State Grid Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900/20 border border-slate-900 rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
                    <div className="h-6 w-24 bg-slate-800 rounded-full"></div>
                  </div>
                  <div className="h-6 w-40 bg-slate-800 rounded mb-2"></div>
                  <div className="h-8 w-28 bg-slate-800 rounded"></div>
                </div>
                <div className="h-10 bg-slate-800 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-12 text-center max-w-xl mx-auto mt-12 shadow-2xl">
            <svg
              className="mx-auto h-12 w-12 text-slate-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No Vehicles Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              The dealership inventory is currently empty.
            </p>
          </div>
        ) : (
          /* Render Vehicles Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEdit}
                onRestock={handleRestock}
                onDelete={handleDelete}
                onPurchaseSuccess={handlePurchaseSuccess}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
