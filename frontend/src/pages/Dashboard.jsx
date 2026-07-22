import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import VehicleCard from '../components/VehicleCard';
import VehicleModal from '../components/VehicleModal';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'restock'
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fetch vehicles with optional active filters
  const fetchVehicles = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.make) params.make = filters.make;
      if (filters.model) params.model = filters.model;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const hasFilters = Object.keys(params).length > 0;
      const url = hasFilters ? '/vehicles/search' : '/vehicles';

      const res = await api.get(url, { params });
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
    fetchVehicles({});
  }, []);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    fetchVehicles({ make, model, category, minPrice, maxPrice });
  };

  const handleClearFilters = () => {
    setMake('');
    setModel('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    fetchVehicles({});
  };

  const handlePurchaseSuccess = (updatedVehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  };

  // Admin Actions
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleRestock = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('restock');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from inventory?')) return;
    try {
      const res = await api.delete(`/vehicles/${id}`);
      if (res.data.status === 'success') {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete operation failed');
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === 'add') {
        const res = await api.post('/vehicles', formData);
        if (res.data.status === 'success') {
          setVehicles((prev) => [res.data.data.vehicle, ...prev]);
        }
      } else if (modalMode === 'edit') {
        const res = await api.put(`/vehicles/${selectedVehicle.id}`, formData);
        if (res.data.status === 'success') {
          setVehicles((prev) =>
            prev.map((v) => (v.id === selectedVehicle.id ? res.data.data.vehicle : v))
          );
        }
      } else if (modalMode === 'restock') {
        const res = await api.post(`/vehicles/${selectedVehicle.id}/restock`, {
          quantity: formData.quantity,
        });
        if (res.data.status === 'success') {
          setVehicles((prev) =>
            prev.map((v) => (v.id === selectedVehicle.id ? res.data.data.vehicle : v))
          );
        }
      }
      setIsModalOpen(false);
      setSelectedVehicle(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative">
      {/* Premium Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              CarHub
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
              <div className="text-xs text-indigo-600 font-medium capitalize">{user?.role}</div>
            </div>
            
            <button
              onClick={logout}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold py-2 px-4 rounded-xl border border-slate-350 transition-all duration-300 text-sm shadow-xs"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Dashboard Title & Meta / Admin Add Vehicle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Active Inventory</h2>
            <p className="text-slate-500 mt-1">Explore and manage high-performance vehicles.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                setSelectedVehicle(null);
                setModalMode('add');
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all duration-300 shadow-md shadow-indigo-600/10"
            >
              Add Vehicle
            </button>
          )}
        </div>

        {/* Filter and Search Bar */}
        <form onSubmit={handleApplyFilters} className="bg-white border border-slate-200 rounded-3xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end shadow-sm">
          <div>
            <label htmlFor="make-filter" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Make
            </label>
            <input
              id="make-filter"
              type="text"
              className="w-full bg-white border border-slate-350 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none text-sm transition-all duration-300"
              placeholder="Toyota"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="model-filter" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Model
            </label>
            <input
              id="model-filter"
              type="text"
              className="w-full bg-white border border-slate-355 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none text-sm transition-all duration-300"
              placeholder="Camry"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="category-filter" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              id="category-filter"
              className="w-full bg-white border border-slate-360 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-2.5 text-slate-900 outline-none text-sm transition-all duration-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Price Range ($)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                aria-label="Minimum Price"
                className="w-1/2 bg-white border border-slate-350 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none text-sm transition-all duration-300"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                aria-label="Maximum Price"
                className="w-1/2 bg-white border border-slate-350 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none text-sm transition-all duration-300"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-md shadow-indigo-600/10"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-3 rounded-xl text-sm transition-all duration-300 border border-slate-200"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Dynamic States */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-700 mb-8 max-w-lg shadow-sm">
            <h4 className="font-bold mb-1">Error Loading Inventory</h4>
            <p className="text-sm">{error}</p>
            <button
              onClick={handleApplyFilters}
              className="mt-4 bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold py-1.5 px-4 rounded-xl text-xs transition-all duration-300 border border-rose-200"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          /* Loading State Grid Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200 rounded-2xl p-6 h-64 animate-pulse flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="h-6 w-40 bg-slate-200 rounded mb-2"></div>
                  <div className="h-8 w-28 bg-slate-200 rounded"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto mt-12 shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-slate-400 mb-4"
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Vehicles Found</h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your search criteria or clearing active filters.
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

      {/* Admin Modification Modals */}
      <VehicleModal
        isOpen={isModalOpen}
        mode={modalMode}
        vehicle={selectedVehicle}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
        onSubmit={handleModalSubmit}
      />

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 mt-20 py-8 bg-white relative z-10 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} CarHub Dealership. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
