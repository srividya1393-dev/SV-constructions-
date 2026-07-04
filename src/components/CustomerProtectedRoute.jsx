/**
 * CustomerProtectedRoute
 *
 * Wraps any route that requires a logged-in customer.
 * Un-authenticated visitors are redirected to /login with the
 * original URL saved as `?from=...` so we can return them after login.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerProtectedRoute({ children }) {
  const { isLoggedIn } = useCustomerAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
