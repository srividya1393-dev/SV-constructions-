import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, Lock, LogIn, Mail, Phone, User, UserPlus } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerLoginPage() {
  const { loginCustomer, registerCustomer, isLoggedIn } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle between 'login' and 'register'
  const [mode, setMode] = useState('login');

  const from = location.state?.from?.pathname || '/dashboard';
  if (isLoggedIn) return <Navigate to={from} replace />;

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-br from-slate-900 via-navy to-slate-800">
      {/* decorative blobs */}
      <span className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md sm:p-10">

            {/* Brand header */}
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold text-navy shadow-lg">
                <Building2 size={24} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">Sri Vidya Constructions</p>
                <p className="text-xs text-slate-400">Customer Portal</p>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="mt-8 flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-black transition ${
                  mode === 'login'
                    ? 'bg-gold text-navy shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn size={15} /> Sign In
              </button>
              <button
                type="button"
                id="create-account-btn"
                onClick={() => setMode('register')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-black transition ${
                  mode === 'register'
                    ? 'bg-gold text-navy shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus size={15} /> Create Account
              </button>
            </div>

            {/* Forms */}
            {mode === 'login' ? (
              <LoginForm onSuccess={() => navigate(from, { replace: true })} from={from} />
            ) : (
              <RegisterForm onSuccess={() => navigate('/dashboard', { replace: true })} />
            )}

            {/* Admin link */}
            <p className="mt-6 text-center text-xs text-slate-500">
              Are you an admin?{' '}
              <Link to="/admin" className="font-bold text-gold hover:underline">
                Admin Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Login form ──────────────────────────────────────────────────────── */
function LoginForm({ onSuccess }) {
  const { loginCustomer } = useCustomerAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginCustomer({ email: email.trim(), password });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
      <h2 className="text-2xl font-black text-white">Welcome back</h2>
      <p className="text-sm text-slate-400">Sign in to view properties and connect with our team.</p>

      {/* Email */}
      <Field
        id="login-email" label="Email address" type="email"
        autoComplete="email" required placeholder="you@example.com"
        icon={<Mail size={17} />} value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-bold text-slate-300">Password</label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={17} /></span>
          <input
            id="login-password" type={show ? 'text' : 'password'}
            autoComplete="current-password" required value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Your password"
            className="w-full rounded-lg border border-white/10 bg-white/10 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <button type="button" onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold">
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      <button id="customer-login-btn" type="submit" disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3.5 text-sm font-black text-navy shadow-lg transition hover:brightness-110 disabled:opacity-60">
        {loading ? <Spinner /> : <LogIn size={17} />}
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      {/* Demo hint */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-4 text-xs leading-6 text-amber-300">
        <p className="font-black">Sample credentials (demo only)</p>
        <p className="mt-1">Email: <strong>demo@svc.com</strong></p>
        <p>Password: <strong>Demo@2026</strong></p>
        <p className="mt-1 text-amber-400/70">Connect a real backend before going live.</p>
      </div>
    </form>
  );
}

/* ── Register form ───────────────────────────────────────────────────── */
function RegisterForm({ onSuccess }) {
  const { registerCustomer } = useCustomerAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [showCfm, setShowCfm]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim())              return setError('Please enter your full name.');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Please enter a valid email address.');
    if (phone && !/^\d{7,15}$/.test(phone.replace(/[\s\-\+]/g, '')))
                                   return setError('Please enter a valid phone number.');
    if (password.length < 6)      return setError('Password must be at least 6 characters.');
    if (password !== confirm)      return setError('Passwords do not match.');

    setLoading(true);
    try {
      await registerCustomer({ name, email: email.trim(), phone: phone.trim(), password });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
      <h2 className="text-2xl font-black text-white">Create account</h2>
      <p className="text-sm text-slate-400">Join us to track properties and enquiries.</p>

      {/* Full Name */}
      <Field
        id="reg-name" label="Full Name" type="text"
        autoComplete="name" required placeholder="Your full name"
        icon={<User size={17} />} value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Email */}
      <Field
        id="reg-email" label="Email Address" type="email"
        autoComplete="email" required placeholder="you@example.com"
        icon={<Mail size={17} />} value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Phone */}
      <Field
        id="reg-phone" label="Phone Number" type="tel"
        autoComplete="tel" placeholder="e.g. 9876543210 (optional)"
        icon={<Phone size={17} />} value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Password */}
      <div>
        <label htmlFor="reg-password" className="block text-sm font-bold text-slate-300">Create Password</label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={17} /></span>
          <input
            id="reg-password" type={showPwd ? 'text' : 'password'}
            autoComplete="new-password" required value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
            className="w-full rounded-lg border border-white/10 bg-white/10 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <button type="button" onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold">
            {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-bold text-slate-300">Confirm Password</label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={17} /></span>
          <input
            id="reg-confirm" type={showCfm ? 'text' : 'password'}
            autoComplete="new-password" required value={confirm}
            onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password"
            className="w-full rounded-lg border border-white/10 bg-white/10 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <button type="button" onClick={() => setShowCfm((v) => !v)}
            aria-label={showCfm ? 'Hide confirm password' : 'Show confirm password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold">
            {showCfm ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      {/* Password match indicator */}
      {confirm.length > 0 && (
        <p className={`text-xs font-bold ${password === confirm ? 'text-emerald-400' : 'text-rose-400'}`}>
          {password === confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
        </p>
      )}

      {error && <ErrorBox message={error} />}

      <button
        id="register-submit-btn"
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3.5 text-sm font-black text-navy shadow-lg transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? <Spinner /> : <UserPlus size={17} />}
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-center text-xs text-slate-500">
        By registering, you agree to be contacted by our team regarding your property enquiries.
      </p>
    </form>
  );
}

/* ── Shared helpers ──────────────────────────────────────────────────── */
function Field({ id, label, icon, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-slate-300">{label}</label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
        <input
          id={id}
          {...inputProps}
          className="w-full rounded-lg border border-white/10 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </div>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300">
      {message}
    </p>
  );
}

function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />;
}
