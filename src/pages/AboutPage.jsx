import { Award, Handshake, HardHat, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const values = [
  { icon: HardHat, title: 'Construction Quality', text: 'Reliable materials, practical engineering, and careful finishing at every stage.' },
  { icon: Handshake, title: 'Trusted Service', text: 'Straightforward guidance, regular communication, and responsible project handling.' },
  { icon: ShieldCheck, title: 'Buying Confidence', text: 'Clear property information and support from first enquiry through handover.' },
  { icon: Award, title: 'Customer Satisfaction', text: 'Homes planned around comfort, lasting value, and the needs of real families.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About Us" title="Homes built on quality and trust." description="SRI VIDYA CONSTRUCTIONS brings dependable construction and thoughtful property guidance together under one roof." />
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <img src="https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=1200&q=80" alt="Construction team reviewing a project" className="h-full min-h-80 w-full rounded-md object-cover" />
          <div className="self-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Our Approach</p>
            <h2 className="mt-3 text-3xl font-black text-navy">Practical planning. Dependable delivery.</h2>
            <p className="mt-5 leading-8 text-slate-700">Our work begins with a clear understanding of the site, budget, and people who will use the space. We focus on structural integrity, sensible layouts, quality finishes, and transparent service.</p>
            <p className="mt-4 leading-8 text-slate-700">Whether we are constructing a family home or helping a buyer choose a property, the goal is the same: a confident decision and a result that lasts.</p>
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {values.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-md border border-slate-200 bg-stone p-5"><Icon className="text-gold" size={28} /><h3 className="mt-4 font-black text-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}
        </div>
      </section>
    </>
  );
}
