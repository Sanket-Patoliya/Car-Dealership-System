import React, { useState, useEffect } from 'react';

const VehicleModal = ({ isOpen, mode, vehicle, onClose, onSubmit }) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const [restockQty, setRestockQty] = useState('');
  const [error, setError] = useState('');

  // Categories allowed by the backend mongoose schema
  const categories = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Electric'];

  useEffect(() => {
    if (vehicle) {
      setBrand(vehicle.brand || '');
      setModel(vehicle.model || '');
      setCategory(vehicle.category || 'Sedan');
      setPrice(vehicle.price || '');
      setQuantity(vehicle.quantity || '');
    } else {
      setBrand('');
      setModel('');
      setCategory('Sedan');
      setPrice('');
      setQuantity('');
    }
    setRestockQty('');
    setError('');
  }, [vehicle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'restock') {
      const qty = Number(restockQty);
      if (!restockQty || isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
        setError('Quantity must be a positive whole number');
        return;
      }
      onSubmit({ quantity: qty });
    } else {
      // Add or Edit mode
      if (!brand.trim() || !model.trim() || !category || price === '' || quantity === '') {
        setError('All fields are required');
        return;
      }

      const p = Number(price);
      const q = Number(quantity);

      if (isNaN(p) || p < 0) {
        setError('Price must be a non-negative number');
        return;
      }

      if (isNaN(q) || q < 0 || !Number.isInteger(q)) {
        setError('Quantity must be a non-negative whole number');
        return;
      }

      onSubmit({ brand, model, category, price: p, quantity: q });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl z-10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 capitalize">
            {mode === 'add' ? 'Add Vehicle' : mode === 'edit' ? 'Edit Vehicle Details' : 'Restock Vehicle'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors duration-300 text-2xl font-light outline-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-250 rounded-xl p-4 text-xs text-rose-600">
              {error}
            </div>
          )}

          {mode === 'restock' ? (
            <div>
              <p className="text-slate-500 text-sm mb-4">
                Restock inventory for <span className="font-semibold text-slate-900">{vehicle?.brand} {vehicle?.model}</span>. Current stock is <span className="text-indigo-600 font-semibold">{vehicle?.quantity}</span>.
              </p>
              <label htmlFor="restockQty" className="block text-sm font-semibold text-slate-700 mb-2">
                Quantity to Add
              </label>
              <input
                id="restockQty"
                type="number"
                required
                className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300"
                placeholder="10"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-semibold text-slate-700 mb-2">
                    Brand (Make)
                  </label>
                  <input
                    id="brand"
                    type="text"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300"
                    placeholder="Toyota"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-semibold text-slate-700 mb-2">
                    Model
                  </label>
                  <input
                    id="model"
                    type="text"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300"
                    placeholder="Camry"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-3 text-slate-900 outline-none transition-all duration-300"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-white text-slate-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300"
                    placeholder="29999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold text-slate-700 mb-2">
                    Initial Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    required
                    min="0"
                    className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all duration-300"
                    placeholder="5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300 shadow-md shadow-indigo-600/10"
            >
              {mode === 'add' ? 'Create' : mode === 'edit' ? 'Save Changes' : 'Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
