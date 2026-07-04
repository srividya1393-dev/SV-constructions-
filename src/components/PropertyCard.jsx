import { ArrowRight, Building, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { business } from '../data/properties';

const statusStyles = {
  Available: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Sold: 'bg-rose-50 text-rose-700 ring-rose-200',
  Completed: 'bg-blue-50 text-blue-700 ring-blue-200',
};

export default function PropertyCard({ property, compact = false, completed = false }) {
  const contactMessage = encodeURIComponent(`I am interested in ${property.name}`);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-card">
      <div className="relative">
        <img src={property.heroImage} alt={property.name} className={`${compact ? 'h-48' : 'h-56'} w-full object-cover`} />
        <span className={`absolute left-4 top-4 rounded px-3 py-1 text-xs font-black ring-1 ${statusStyles[property.status] || statusStyles.Available}`}>
          {property.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-black text-navy">{property.name}</h2>
            <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-slate-600">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> {property.location}
            </p>
          </div>
          <span className="shrink-0 rounded bg-stone p-2 text-navy"><Building size={18} /></span>
        </div>
        {!compact && <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{property.description}</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <p className="font-black text-navy">{completed ? property.completionYear : property.price}</p>
          <p className="text-xs font-bold uppercase text-slate-500">{property.propertyType}</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link to={`/properties/${property.id}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-gold px-3 py-2 text-center text-sm font-black text-navy hover:bg-gold-soft">
            Details <ArrowRight size={16} />
          </Link>
          <a href={`https://wa.me/${business.whatsappNumber}?text=${contactMessage}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-navy px-3 py-2 text-center text-sm font-black text-white hover:bg-navy-soft">
            <MessageCircle size={16} /> Contact
          </a>
        </div>
      </div>
    </article>
  );
}
