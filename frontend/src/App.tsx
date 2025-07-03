import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constants';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Notification from './components/common/Notification';
import Landing from './pages/Landing';
import TourBooking from './pages/TourBooking';
import Payment from './pages/Payment';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path={ROUTES.HOME} element={<Landing />} />
            <Route path="/book/:id" element={<TourBooking />} />
            <Route path={ROUTES.PAYMENT} element={<Payment />} />
            <Route path="/payment/success" element={<Payment />} />
            <Route path="/payment/cancel" element={<Payment />} />
          </Routes>
        </main>
        <Footer />
        <Notification />
      </div>
    </Router>
  );
};

export default App;
