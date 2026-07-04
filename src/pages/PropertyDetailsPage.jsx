import { ArrowLeft, Check, MapPin, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { business } from '../data/properties';
import { useProperties } from '../context/PropertyContext';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const { currentProperties, previousBuildings } = useProperties();
  const property = [...currentProperties, ...previousBuildings].find((item) => item.id === id);

  if (!property) return <div className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-black text-navy">Property not found</h1><Link to="/properties" className="mt-6 inline-flex rounded bg-gold px-5 py-3 font-black text-navy">Back to properties</Link></div>;

  const gallery = property.gallery?.length ? property.gallery : [property.heroImage];
  return (
    <section className="bg-stone py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to={property.status === 'Completed' ? '/previous-buildings' : '/properties'} className="inline-flex items-center gap-2 text-sm font-black text-navy"><ArrowLeft size={17} /> Back</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="min-w-0">
            <img src={gallery[0]} alt={`${property.name} main view`} className="h-72 w-full rounded-md object-cover sm:h-[460px]" />
            {gallery.length > 1 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{gallery.slice(1).map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${property.name} view ${index + 2}`} className="h-28 w-full rounded-md object-cover sm:h-36" />)}</div>}
          </div>
          <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 sm:p-7">
            <span className="rounded bg-gold/20 px-3 py-1 text-xs font-black text-navy">{property.status}</span>
            <h1 className="mt-4 break-words text-3xl font-black text-navy">{property.name}</h1>
            <p className="mt-3 flex items-center gap-2 font-semibold text-slate-600"><MapPin size={18} className="text-gold" />{property.location}</p>
            <p className="mt-6 text-2xl font-black text-navy">{property.price}</p>
            <p className="mt-5 leading-7 text-slate-700">{property.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Detail label="Property type" value={property.propertyType} />
              <Detail label="Area" value={property.area || 'Contact us'} />
              <Detail label="Floors / Rooms" value={property.floorsRooms || 'Contact us'} />
              <Detail label="Availability" value={property.availability || property.status} />
            </dl>
            {property.features?.length > 0 && <div className="mt-6"><h2 className="font-black text-navy">Features</h2><ul className="mt-3 space-y-2">{property.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-700"><Check size={17} className="shrink-0 text-gold" />{feature}</li>)}</ul></div>}
            <a href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(`I am interested in ${property.name}`)}`} target="_blank" rel="noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded bg-navy px-5 py-3 font-black text-white"><MessageCircle size={18} /> Enquire Now</a>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }) {
  return <div className="min-w-0 rounded border border-slate-200 bg-stone p-3"><dt className="text-xs font-black uppercase text-slate-500">{label}</dt><dd className="mt-1 break-words font-bold text-navy">{value}</dd></div>;
}
