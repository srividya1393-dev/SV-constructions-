import { Building2 } from 'lucide-react';

export default function EmptyState({ title, message }) {
  return (
    <div className="col-span-full rounded-md border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <Building2 className="mx-auto text-gold" size={34} />
      <h3 className="mt-4 text-lg font-black text-navy">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  );
}
