import React from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="app-container">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">PG & Flat Finder</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/about" className="hover:underline">About</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      
      <footer className="bg-gray-100 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 PG & Flat Finder | Using OpenStreetMap data</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
