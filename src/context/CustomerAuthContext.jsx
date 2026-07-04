/**
 * CustomerAuthContext
 *
 * Provides customer authentication + registration state to the app.
 * - Sample accounts are hard-coded in SAMPLE_CUSTOMERS.
 * - User-registered accounts are stored in localStorage (REGISTERED_KEY)
 *   so they survive page refresh.
 * - Login checks both sample accounts AND localStorage-registered accounts.
 *
 * ── Future backend integration ──────────────────────────────────────
 * Replace loginCustomer() and registerCustomer() with real API calls.
 * ────────────────────────────────────────────────────────────────────
 */

import { createContext, useContext, useState } from 'react';

// ── Built-in demo credentials ─────────────────────────────────────────
const SAMPLE_CUSTOMERS = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@example.com', phone: '', password: 'Customer@123' },
  { id: 'c2', name: 'Ravi Kumar',   email: 'ravi@example.com',  phone: '', password: 'Customer@123' },
  { id: 'c3', name: 'Demo User',    email: 'demo@svc.com',      phone: '', password: 'Demo@2026'    },
];

const SESSION_KEY    = 'sri-vidya-customer-session';
const REGISTERED_KEY = 'sri-vidya-registered-customers';

// ── Helpers ───────────────────────────────────────────────────────────
function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function readRegistered() {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRegistered(list) {
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(list));
}

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => readSession());

  // ── LOGIN ──────────────────────────────────────────────────────────
  async function loginCustomer({ email, password }) {
    // Check sample accounts first, then localStorage-registered accounts
    const all = [...SAMPLE_CUSTOMERS, ...readRegistered()];
    const found = all.find(
      (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password,
    );
    if (!found) throw new Error('Incorrect email or password. Please try again.');

    const user = { id: found.id, name: found.name, email: found.email, phone: found.phone || '' };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setCustomer(user);
    return { success: true };
  }

  // ── REGISTER ───────────────────────────────────────────────────────
  async function registerCustomer({ name, email, phone, password }) {
    const all = [...SAMPLE_CUSTOMERS, ...readRegistered()];

    // Duplicate email check
    const exists = all.find((c) => c.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('An account with this email already exists. Please sign in.');

    const newUser = {
      id: `reg-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,          // plain-text for local demo; hash on real backend
    };

    const registered = readRegistered();
    registered.push(newUser);
    saveRegistered(registered);

    // Auto-login after registration
    const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setCustomer(sessionUser);
    return { success: true };
  }

  // ── LOGOUT ────────────────────────────────────────────────────────
  function logoutCustomer() {
    sessionStorage.removeItem(SESSION_KEY);
    setCustomer(null);
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, loginCustomer, registerCustomer, logoutCustomer, isLoggedIn: !!customer }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used inside CustomerAuthProvider');
  return ctx;
}
