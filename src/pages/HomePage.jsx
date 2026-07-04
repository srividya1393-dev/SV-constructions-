import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { business } from '../data/properties';
import { useProperties } from '../context/PropertyContext';

export default function HomePage() {
  const { currentProperties, previousBuildings } = useProperties();

  return (
    <>
      <section className="relative isolate flex min-h-[76vh] items-center overflow-hidden bg-navy">
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80" alt="Sri Vidya construction project" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/35" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex rounded border border-gold/40 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-gold">Construction & Property Sales</p>
            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">SRI VIDYA CONSTRUCTIONS</h1>
            <p className="mt-5 text-lg font-semibold text-slate-100 sm:text-2xl">Trusted Construction & Property Sales</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/properties" className="inline-flex items-center justify-center gap-2 rounded bg-gold px-6 py-3 font-black text-navy hover:bg-gold-soft">View Properties <ArrowRight size={18} /></Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded border border-white/60 bg-white/10 px-6 py-3 font-black text-white hover:bg-white hover:text-navy"><MessageCircle size={18} /> Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">About Us</p>
            <h2 className="mt-3 text-3xl font-black text-navy sm:text-4xl">Built carefully. Handed over confidently.</h2>
          </div>
          <div>
            <p className="text-base leading-8 text-slate-700 sm:text-lg">We build residential spaces with close attention to structure, materials, finishing, and long-term value. Every project is guided by trusted service and clear communication.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {['Quality materials', 'Reliable service', 'Customer satisfaction'].map((item) => <div key={item} className="flex items-center gap-2 rounded border border-slate-200 bg-stone p-4 text-sm font-black text-navy"><CheckCircle2 size={18} className="shrink-0 text-gold" />{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Available Now</p><h2 className="mt-3 text-3xl font-black text-navy sm:text-4xl">Current properties</h2></div>
            <Link to="/properties" className="inline-flex items-center gap-2 font-black text-navy">View all <ArrowRight size={18} /></Link>
          </div>
          <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{currentProperties.slice(0, 3).map((property) => <PropertyCard key={property.id} property={property} compact />)}</div>
        </div>
      </section>

      <section className="bg-navy py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Our Track Record</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">Explore {previousBuildings.length} completed projects.</h2></div>
          <Link to="/previous-buildings" className="inline-flex items-center justify-center gap-2 rounded bg-white px-5 py-3 font-black text-navy">Previous Constructions <ArrowRight size={18} /></Link>
        </div>
      </section>
    </>
  );
}
