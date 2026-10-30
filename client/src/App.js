import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader } from './components/Common';
import { useAuth } from './context/AuthContext';

// Code-splitting: each page is loaded on demand
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Farms = lazy(() => import('./pages/Farms'));
const Crops = lazy(() => import('./pages/Crops'));
const CropDetail = lazy(() => import('./pages/CropDetail'));
const Weather = lazy(() => import('./pages/Weather'));
const PestAlerts = lazy(() => import('./pages/PestAlerts'));
const Market = lazy(() => import('./pages/Market'));
const Orders = lazy(() => import('./pages/Orders'));
const Consultations = lazy(() => import('./pages/Consultations'));
const Forum = lazy(() => import('./pages/Forum'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  const { user } = useAuth();
  const guard = (el, roles) => <ProtectedRoute roles={roles}>{el}</ProtectedRoute>;

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            <Route path="/" element={guard(<Dashboard />)} />
            <Route path="/farms" element={guard(<Farms />)} />
            <Route path="/crops" element={guard(<Crops />)} />
            <Route path="/crops/:id" element={guard(<CropDetail />)} />
            <Route path="/weather" element={guard(<Weather />)} />
            <Route path="/alerts" element={guard(<PestAlerts />)} />
            <Route path="/market" element={guard(<Market />)} />
            <Route path="/orders" element={guard(<Orders />)} />
            <Route path="/consult" element={guard(<Consultations />)} />
            <Route path="/forum" element={guard(<Forum />)} />
            <Route path="/admin" element={guard(<Admin />, ['admin'])} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
