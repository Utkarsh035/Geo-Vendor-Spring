import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import UserLogin from './pages/auth/UserLogin';
import UserRegister from './pages/auth/UserRegister';
import PartnerLogin from './pages/auth/PartnerLogin';
import PartnerRegister from './pages/auth/PartnerRegister';
import AdminLogin from './pages/auth/AdminLogin';
import UserDashboard from './pages/user/UserDashboard';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <>
      <Navbar />
      <main className="main-content" id="mainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/partner-login" element={<PartnerLogin />} />
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/partner-dashboard" element={<PartnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppLayout />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
