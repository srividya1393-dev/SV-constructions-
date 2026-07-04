import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { business } from '../data/properties';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event) => { event.preventDefault(); setSent(true); event.currentTarget.reset(); };
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let’s discuss your property needs." description="Speak with SRI VIDYA CONSTRUCTIONS about available properties, completed work, or a new construction project." />
      <section className="py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div><h2 className="text-2xl font-black text-navy">Contact information</h2><div className="mt-7 space-y-4"><ContactItem icon={Phone} label="Phone" value={business.phone} href={`tel:+91${business.phone}`} /><ContactItem icon={MessageCircle} label="WhatsApp" value={business.phone} href={`https://wa.me/${business.whatsappNumber}`} /><ContactItem icon={MapPin} label="Address" value={business.address} /></div></div>
        <form onSubmit={submit} className="rounded-md border border-slate-200 bg-stone p-5 sm:p-7"><div className="grid gap-5 sm:grid-cols-2"><Field label="Name" type="text" required /><Field label="Phone" type="tel" required /></div><div className="mt-5"><Field label="Property interested in" type="text" /></div><label className="mt-5 block"><span className="text-sm font-black text-navy">Message</span><textarea rows="5" required className="mt-2 w-full rounded border border-slate-300 bg-white px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" /></label><button className="mt-6 w-full rounded bg-gold px-5 py-3 font-black text-navy" type="submit">Send Enquiry</button>{sent && <p className="mt-4 rounded border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">Thank you. We will contact you shortly.</p>}</form>
      </div></section>
    </>
  );
}

function ContactItem({ icon: Icon, label, value, href }) { const content = <><Icon size={20} className="shrink-0 text-gold" /><div><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="mt-1 break-words font-bold text-navy">{value}</p></div></>; return href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex gap-3 rounded border border-slate-200 p-4 hover:bg-stone">{content}</a> : <div className="flex gap-3 rounded border border-slate-200 p-4">{content}</div>; }
function Field({ label, type, required }) { return <label className="block"><span className="text-sm font-black text-navy">{label}</span><input type={type} required={required} className="mt-2 w-full rounded border border-slate-300 bg-white px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" /></label>; }
