import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import CustomerProtectedRoute from './components/CustomerProtectedRoute';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { PropertyProvider } from './context/PropertyContext';
import AboutPage from './pages/AboutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ContactPage from './pages/ContactPage';
import CustomerLoginPage from './pages/CustomerLoginPage';
import HomePage from './pages/HomePage';
import PreviousBuildingsPage from './pages/PreviousBuildingsPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import UserDashboardPage from './pages/UserDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <section className="grid min-h-[65vh] place-items-center bg-stone px-4 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">404</p>
        <h1 className="mt-3 text-4xl font-black text-navy">Page not found</h1>
        <Link to="/" className="mt-7 inline-flex rounded bg-gold px-5 py-3 font-black text-navy">Return Home</Link>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomerAuthProvider>
        <PropertyProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="properties/:id" element={<PropertyDetailsPage />} />
              <Route path="previous-buildings" element={<PreviousBuildingsPage />} />
              <Route path="contact" element={<ContactPage />} />

              {/* ── Customer login (public) ── */}
              <Route path="login" element={<CustomerLoginPage />} />

              {/* ── User dashboard (protected: customers only) ── */}
              <Route
                path="dashboard"
                element={
                  <CustomerProtectedRoute>
                    <UserDashboardPage />
                  </CustomerProtectedRoute>
                }
              />

              {/* ── Admin (has its own internal login guard) ── */}
              <Route path="admin" element={<AdminDashboardPage />} />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </PropertyProvider>
      </CustomerAuthProvider>
    </BrowserRouter>
  );
}
