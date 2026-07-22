import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const VehicleCard = ({ vehicle, onEdit, onRestock, onDelete, onPurchaseSuccess }) => {
  const { user } = useContext(AuthContext);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');

  const handlePurchase = async () => {
    setPurchasing(true);
    setPurchaseError('');
    try {
      const res = await api.post(`/vehicles/${vehicle.id}/purchase`);
      if (res.data.status === 'success') {
        onPurchaseSuccess(res.data.data.vehicle);
      }
    } catch (err) {
      setPurchaseError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl group">
      <div>
        {/* Category & Stock Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            {vehicle.category}
          </span>
          {vehicle.quantity > 0 ? (
            <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 rounded-full">
              {vehicle.quantity} In Stock
            </span>
          ) : (
            <span className="text-rose-400 text-xs font-medium bg-rose-500/10 px-3 py-1 border border-rose-500/20 rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Brand & Model */}
        <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors duration-300">
          {vehicle.brand} <span className="font-light text-slate-300">{vehicle.model}</span>
        </h3>

        {/* Price */}
        <div className="mt-2 text-2xl font-extrabold text-white">
          ${vehicle.price.toLocaleString()}
        </div>

        {purchaseError && (
          <p className="mt-2 text-xs text-rose-400 font-medium">{purchaseError}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {isAdmin ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2 px-1 rounded-xl text-xs transition-all duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => onRestock(vehicle)}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 font-semibold py-2 px-1 rounded-xl text-xs transition-all duration-300"
            >
              Restock
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold py-2 px-1 rounded-xl text-xs transition-all duration-300"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={vehicle.quantity <= 0 || purchasing}
            className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md shadow-teal-500/5 disabled:shadow-none text-sm"
          >
            {purchasing ? 'Purchasing...' : vehicle.quantity <= 0 ? 'Out of Stock' : 'Purchase'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
