import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SmartphonesPage from './pages/SmartphonesPage';
import TVPage from './pages/TVPage';
import LaptopsPage from './pages/LaptopsPage';
import ComputersPage from './pages/ComputersPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/smartphones" element={<SmartphonesPage />} />
            <Route path="/tv" element={<TVPage />} />
            <Route path="/laptops" element={<LaptopsPage />} />
            <Route path="/computers" element={<ComputersPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;