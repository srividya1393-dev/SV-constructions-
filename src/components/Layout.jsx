import { useState } from 'react';
import { Building2, LayoutDashboard, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { business } from '../data/properties';

const links = [
  { label: 'Home',                   to: '/' },
  { label: 'About',                  to: '/about' },
  { label: 'Properties',             to: '/properties' },
  { label: 'Previous Constructions', to: '/previous-buildings' },
  { label: 'Contact',                to: '/contact' },
];

function NavItem({ link, onClick }) {
  return (
    <NavLink
      to={link.to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded px-2 py-2 text-sm font-bold transition ${
          isActive ? 'text-gold' : 'text-slate-700 hover:text-navy'
        }`
      }
    >
      {link.label}
    </NavLink>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* brand */}
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMobile}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-navy text-gold">
              <Building2 size={22} />
            </span>
            <span className="min-w-0 text-sm font-black leading-tight text-navy sm:text-base">
              SRI VIDYA
              <span className="block text-[10px] tracking-[0.16em] text-gold sm:text-xs">CONSTRUCTIONS</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden items-center gap-2 xl:flex">
            {links.map((link) => <NavItem key={link.to} link={link} />)}

            {/* go to dashboard */}
            <NavLink
              to="/dashboard"
              className="ml-2 inline-flex items-center gap-2 rounded bg-navy px-3 py-2 text-sm font-bold text-white hover:bg-navy-soft"
            >
              <LayoutDashboard size={16} /> User Dashboard
            </NavLink>

            {/* admin — always visible */}
            <NavLink
              to="/admin"
              className="inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-bold text-navy hover:bg-stone"
            >
              <ShieldCheck size={16} /> Admin
            </NavLink>
          </div>

          {/* hamburger */}
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded border border-slate-300 text-navy xl:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 xl:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {links.map((link) => <NavItem key={link.to} link={link} onClick={closeMobile} />)}

              <NavItem link={{ label: 'User Dashboard', to: '/dashboard' }} onClick={closeMobile} />
              <NavItem link={{ label: 'Admin Dashboard', to: '/admin' }} onClick={closeMobile} />

              <a
                href={`tel:+91${business.phone}`}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded bg-gold px-4 py-3 text-sm font-black text-navy"
              >
                <Phone size={16} /> Call {business.phone}
              </a>
            </div>
          </div>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-black">{business.name}</p>
            <p className="mt-2 text-sm text-slate-300">{business.tagline}</p>
          </div>
          <div>
            <p className="font-black text-gold">Quick Links</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {links.slice(0, 4).map((link) => (
                <Link key={link.to} to={link.to} className="text-slate-300 hover:text-white">{link.label}</Link>
              ))}
            </div>
          </div>
          <div className="md:text-right">
            <p className="font-black text-gold">Contact</p>
            <a href={`tel:+91${business.phone}`} className="mt-3 block text-sm text-slate-300">{business.phone}</a>
            <p className="mt-5 text-xs text-slate-400">© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
