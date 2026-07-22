import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Temporary placeholder route for the Dashboard page */}
          <Route 
            path="/" 
            element={
              <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans">
                <h1 className="text-3xl font-bold mb-4">Dashboard (Authenticated placeholder)</h1>
                <p className="text-slate-400">Login and Register pages are successfully implemented!</p>
              </div>
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
