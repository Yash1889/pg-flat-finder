import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
// Import required styles
import '../../styles/reset.css';

const MainLayout = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      color: '#333'
    }}>
      <Header />
      <main style={{
        flex: '1 0 auto',
        paddingTop: '5rem' // Give space for fixed header
      }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
