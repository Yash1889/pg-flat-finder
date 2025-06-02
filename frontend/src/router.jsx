import React from 'react';
import { Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import NotFound from './pages/NotFound';

// Routes configuration
export const router = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search', element: <Search /> },
      { path: '/property/:id', element: <PropertyDetail /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/add-property', element: <AddProperty /> },
      { path: '/edit-property/:id', element: <AddProperty /> },
      { path: '/404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];
