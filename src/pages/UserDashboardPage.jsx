import { Building2, CheckCircle2, Clock3, Home, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import EmptyState from '../components/EmptyState';
import PreviousConstructionCard from '../components/PreviousConstructionCard';
import PropertyCard from '../components/PropertyCard';
import { business } from '../data/properties';
import { useProperties } from '../context/PropertyContext';
import { CalendarDays, ChevronLeft, ChevronRight, Images, MapPin, X } from 'lucide-react';

export default function UserDashboardPage() {
  const { currentProperties, previousBuildings } = useProperties();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const available = currentProperties.filter((item) => item.status === 'Available').length;

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const openGallery = (project) => {
    setSelectedProject(project);
    setActiveImage(0);
  };

  return (
    <>
      <div className="bg-slate-50 pb-16">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <section className="border-b border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">User Dashboard</p>

            <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-black text-navy sm:text-4xl">Find your next property.</h1>
                <p className="mt-2 text-slate-600">View live listings, completed work, and contact our team directly.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${business.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded bg-[#18864b] px-5 py-3 text-sm font-black text-white hover:bg-[#146f3f]"
                >
                  <MessageCircle size={18} /> WhatsApp {business.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="grid gap-4 py-8 sm:grid-cols-3">
            <Stat icon={Home}         value={currentProperties.length}   label="Current listings"   />
            <Stat icon={Clock3}       value={available}                   label="Available now"      />
            <Stat icon={CheckCircle2} value={previousBuildings.length}    label="Completed projects" />
          </section>

          {/* ── Current properties ─────────────────────────────────── */}
          <section className="py-6">
            <div className="flex items-center gap-3">
              <Building2 className="text-gold" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">For Sale</p>
                <h2 className="text-2xl font-black text-navy">Available buildings</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {currentProperties.length
                ? currentProperties.map((p) => <PropertyCard key={p.id} property={p} />)
                : <EmptyState title="No available properties" message="Please check again soon or contact our team." />}
            </div>
          </section>

          {/* ── Previous constructions ─────────────────────────────── */}
          <section className="mt-8 border-t border-slate-200 py-10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-gold" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Our Work</p>
                <h2 className="text-2xl font-black text-navy">Previous constructions</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {previousBuildings.length
                ? previousBuildings.map((p) => (
                    <PreviousConstructionCard key={p.id} project={p} onOpenGallery={openGallery} />
                  ))
                : <EmptyState title="No completed projects" message="Previous work will appear here." />}
            </div>
          </section>
        </div>
      </div>

      {/* Gallery lightbox (same as PreviousBuildingsPage) */}
      {selectedProject && (
        <DashboardGalleryModal
          project={selectedProject}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-slate-200 bg-white p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-gold/20 text-navy">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-2xl font-black text-navy">{value}</p>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function DashboardGalleryModal({ project, activeImage, setActiveImage, onClose }) {
  const images = project.gallery?.length ? project.gallery : [project.heroImage];
  const prev = () => setActiveImage((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveImage((i) => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-navy/97 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`${project.name} gallery`}>
      <div className="mx-auto flex w-full min-h-full max-w-6xl flex-col justify-center">
        <div className="mb-4 flex items-start justify-between gap-4 text-white">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Previous Construction</p>
            <h2 className="mt-1 break-words text-xl font-black sm:text-2xl">{project.name}</h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{project.location}</span>
              {project.completionYear && <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{project.completionYear}</span>}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close gallery" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/20 text-white hover:bg-white/10"><X size={22} /></button>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-black">
          <img src={images[activeImage]} alt={`${project.name} photo ${activeImage + 1}`} className="h-[52vh] min-h-72 w-full object-contain sm:h-[62vh]" />
          {images.length > 1 && (
            <>
              <button type="button" onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg bg-white/90 text-navy shadow-lg hover:bg-white"><ChevronLeft size={24} /></button>
              <button type="button" onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg bg-white/90 text-navy shadow-lg hover:bg-white"><ChevronRight size={24} /></button>
            </>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white">{activeImage + 1} / {images.length}</span>
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button key={`${img.slice(0, 36)}-${i}`} type="button" onClick={() => setActiveImage(i)} aria-label={`Show photo ${i + 1}`} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${activeImage === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <p className="mt-4 text-sm leading-7 text-slate-300"><Images size={15} className="mr-2 inline text-gold" />{project.description}</p>
      </div>
    </div>
  );
}
