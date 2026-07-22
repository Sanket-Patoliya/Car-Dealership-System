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

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md group">
      <div>
        {/* Category & Stock Badges */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-150 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            {vehicle.category}
          </span>
          {vehicle.quantity > 0 ? (
            <span className="text-emerald-700 text-xs font-medium bg-emerald-50 px-3 py-1 border border-emerald-150 rounded-full">
              {vehicle.quantity} In Stock
            </span>
          ) : (
            <span className="text-rose-700 text-xs font-medium bg-rose-50 px-3 py-1 border border-rose-150 rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Brand & Model */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
          {vehicle.brand} <span className="font-light text-slate-500">{vehicle.model}</span>
        </h3>

        {/* Price */}
        <div className="mt-2 text-2xl font-extrabold text-slate-900">
          ${vehicle.price.toLocaleString()}
        </div>

        {purchaseError && (
          <p className="mt-2 text-xs text-rose-600 font-medium">{purchaseError}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {isAdmin ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold py-2 px-1 rounded-xl text-xs transition-all duration-300"
            >
              Edit
            </button>
            <button
              onClick={() => onRestock(vehicle)}
              className="bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-100 font-semibold py-2 px-1 rounded-xl text-xs transition-all duration-300"
            >
              Restock
            </button>
            <button
              onClick={() => onDelete(vehicle.id)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-150 font-semibold py-2 px-1 rounded-xl text-xs transition-all duration-300"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={vehicle.quantity <= 0 || purchasing}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-sm shadow-indigo-600/10 disabled:shadow-none text-sm animate-in fade-in duration-300"
          >
            {purchasing ? 'Purchasing...' : vehicle.quantity <= 0 ? 'Out of Stock' : 'Purchase'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
