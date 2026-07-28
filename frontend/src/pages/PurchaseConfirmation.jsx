import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const PurchaseConfirmation = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [loading, setLoading] = useState(!location.state?.vehicle);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch vehicle details if not passed via location state
  useEffect(() => {
    if (!vehicle && vehicleId) {
      const fetchVehicle = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await api.get('/vehicles');
          if (res.data.status === 'success') {
            const found = (res.data.data.vehicles || []).find((v) => v.id === vehicleId);
            if (found) {
              setVehicle(found);
            } else {
              setError('Vehicle not found in active inventory.');
            }
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch vehicle details.');
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [vehicleId, vehicle]);

  const handleConfirmPurchase = async () => {
    if (!vehicle) return;
    setPurchasing(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await api.post(`/vehicles/${vehicle.id}/purchase`);
      if (res.data.status === 'success') {
        const updated = res.data.data.vehicle;
        setVehicle(updated);
        setSuccessMessage(`Success! You have purchased the ${updated.brand} ${updated.model}.`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  // Category badge styling helper
  const getCategoryGradient = (cat) => {
    switch (cat) {
      case 'Electric':
        return 'from-emerald-500 to-teal-700';
      case 'Luxury':
        return 'from-amber-500 to-amber-700';
      case 'SUV':
        return 'from-indigo-600 to-blue-700';
      case 'Sedan':
        return 'from-slate-700 to-slate-900';
      default:
        return 'from-indigo-600 to-indigo-800';
    }
  };

  const getFuelType = (cat) => {
    if (cat === 'Electric') return '100% Electric (EV)';
    if (cat === 'Luxury') return 'Premium Gasoline';
    if (cat === 'Hybrid') return 'Plug-in Hybrid';
    return 'Gasoline / Hybrid';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative flex flex-col justify-between">
      {/* Header Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              CarHub
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
              <div className="text-xs text-indigo-600 font-medium capitalize">{user?.role}</div>
            </div>

            <button
              onClick={logout}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold py-2 px-4 rounded-xl border border-slate-300 transition-all duration-300 text-sm shadow-xs"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Back Link */}
        <button
          onClick={handleCancel}
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-indigo-600 mb-6 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Inventory
        </button>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-pulse space-y-6">
            <div className="h-48 bg-slate-200 rounded-2xl w-full"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-slate-200 rounded-xl"></div>
              <div className="h-12 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ) : error && !vehicle ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
            <div className="text-rose-600 font-bold text-lg mb-2">Error Loading Vehicle</div>
            <p className="text-slate-600 text-sm mb-6">{error}</p>
            <button
              onClick={handleCancel}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        ) : vehicle ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all duration-300">
            {/* Visual Vehicle Banner Card */}
            <div className={`bg-gradient-to-br ${getCategoryGradient(vehicle.category)} p-8 text-white relative overflow-hidden`}>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase px-3 py-1 rounded-full tracking-wider">
                    {vehicle.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 tracking-tight">
                    {vehicle.brand} <span className="font-light">{vehicle.model}</span>
                  </h1>
                  <p className="text-white/80 text-sm mt-1">Model Year: 2024</p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs uppercase text-white/70 font-medium">Vehicle Price</div>
                  <div className="text-3xl font-extrabold">${vehicle.price.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Detailed Specifications Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Complete Vehicle Specifications
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                    <div className="text-xs text-slate-500 font-medium">Brand</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{vehicle.brand}</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                    <div className="text-xs text-slate-500 font-medium">Model</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{vehicle.model}</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                    <div className="text-xs text-slate-500 font-medium">Fuel Type</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{getFuelType(vehicle.category)}</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                    <div className="text-xs text-slate-500 font-medium">Transmission</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">Automatic</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                    <div className="text-xs text-slate-500 font-medium">Model Year</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">2024</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
                    <div className="text-xs text-slate-500 font-medium">Available Stock</div>
                    <div className="text-sm font-bold mt-0.5">
                      {vehicle.quantity > 0 ? (
                        <span className="text-emerald-700">{vehicle.quantity} In Stock</span>
                      ) : (
                        <span className="text-rose-600">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl col-span-2">
                    <div className="text-xs text-slate-500 font-medium">Price</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">${vehicle.price.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Purchase Prompt / Success State / Error Banner */}
              {successMessage ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">{successMessage}</h3>
                  <p className="text-xs text-emerald-700">
                    Remaining inventory: {vehicle.quantity} vehicle(s) available.
                  </p>
                  <button
                    onClick={handleCancel}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all duration-200"
                  >
                    Back to Inventory List
                  </button>
                </div>
              ) : (
                <div className="border-t border-slate-200 pt-6 space-y-6">
                  {/* Prompt Message */}
                  <div className="bg-indigo-50/80 border border-indigo-150 rounded-2xl p-5 text-center">
                    <h2 className="text-xl font-bold text-indigo-950">
                      Are you sure you want to purchase this vehicle?
                    </h2>
                    <p className="text-xs text-indigo-700 mt-1">
                      Confirming will process your order for ${vehicle.price.toLocaleString()}.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  {/* Confirm & Cancel Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleConfirmPurchase}
                      disabled={vehicle.quantity <= 0 || purchasing}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10"
                    >
                      {purchasing ? 'Processing Purchase...' : vehicle.quantity <= 0 ? 'Out of Stock' : 'Confirm Purchase'}
                    </button>

                    <button
                      onClick={handleCancel}
                      disabled={purchasing}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl text-sm transition-all border border-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} CarHub Dealership. All rights reserved.
      </footer>
    </div>
  );
};

export default PurchaseConfirmation;
