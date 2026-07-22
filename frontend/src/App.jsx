import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Main Route */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans p-6">
                  <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                  <p className="text-slate-400">Welcome to the authenticated member dashboard!</p>
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Route */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans p-6">
                  <h1 className="text-3xl font-bold mb-4 text-teal-400">Admin Control Panel</h1>
                  <p className="text-slate-400">Welcome, Administrator. You have permission to access this page.</p>
                </div>
              </AdminRoute>
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
