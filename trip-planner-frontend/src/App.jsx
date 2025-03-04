import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TripsPage from './pages/TripsPage';
import NotFoundPage from './pages/NotFoundPage';
import { GoogleMapsProvider } from './components/map/GoogleMapsProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trips" element={
              <PrivateRoute>
                <GoogleMapsProvider>
                  <TripsPage />
                </GoogleMapsProvider>
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;