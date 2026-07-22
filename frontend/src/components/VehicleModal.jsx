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
      {/* Dark overlay with blur */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal glass panel container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl z-10 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white capitalize">
            {mode === 'add' ? 'Add Vehicle' : mode === 'edit' ? 'Edit Vehicle Details' : 'Restock Vehicle'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors duration-300 text-2xl font-light"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-400">
              {error}
            </div>
          )}

          {mode === 'restock' ? (
            <div>
              <p className="text-slate-400 text-sm mb-4">
                Restock inventory for <span className="font-semibold text-white">{vehicle?.brand} {vehicle?.model}</span>. Current stock is <span className="text-teal-400 font-semibold">{vehicle?.quantity}</span>.
              </p>
              <label htmlFor="restockQty" className="block text-sm font-semibold text-slate-300 mb-2">
                Quantity to Add
              </label>
              <input
                id="restockQty"
                type="number"
                required
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all duration-300"
                placeholder="10"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-semibold text-slate-300 mb-2">
                    Brand (Make)
                  </label>
                  <input
                    id="brand"
                    type="text"
                    required
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all duration-300"
                    placeholder="Toyota"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-semibold text-slate-300 mb-2">
                    Model
                  </label>
                  <input
                    id="model"
                    type="text"
                    required
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all duration-300"
                    placeholder="Camry"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-white outline-none transition-all duration-300"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-950 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-slate-300 mb-2">
                    Price ($)
                  </label>
                  <input
                    id="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all duration-300"
                    placeholder="29999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-semibold text-slate-300 mb-2">
                    Initial Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    required
                    min="0"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all duration-300"
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
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all duration-300 shadow-md shadow-teal-500/10"
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
