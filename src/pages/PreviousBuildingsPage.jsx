import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Images, MapPin, X } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import PreviousConstructionCard from '../components/PreviousConstructionCard';
import { useProperties } from '../context/PropertyContext';

const ALL = 'All';

export default function PreviousBuildingsPage() {
  const { previousBuildings } = useProperties();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [filter, setFilter] = useState(ALL);

  // Collect unique property types for the filter bar
  const types = useMemo(() => {
    const unique = [...new Set(previousBuildings.map((p) => p.propertyType).filter(Boolean))];
    return [ALL, ...unique];
  }, [previousBuildings]);

  const filtered = filter === ALL
    ? previousBuildings
    : previousBuildings.filter((p) => p.propertyType === filter);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const openGallery = (project) => {
    setSelectedProject(project);
    setActiveImage(0);
  };

  // Aggregate stats
  const totalPhotos = previousBuildings.reduce((sum, p) => sum + (p.gallery?.length || 1), 0);
  const years = previousBuildings.map((p) => Number(p.completionYear)).filter(Boolean);
  const yearRange = years.length
    ? years.length > 1 ? `${Math.min(...years)} – ${Math.max(...years)}` : String(years[0])
    : '—';

  return (
    <>
      <PageHeader
        eyebrow="Our Completed Work"
        title="Previous Constructions"
        description="Explore real images from residential and commercial projects delivered by SRI VIDYA CONSTRUCTIONS."
      />

      {/* ── Stats row ────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-slate-200 px-4 sm:px-6 lg:px-8">
          <Stat value={previousBuildings.length} label="Projects delivered" />
          <Stat value={totalPhotos} label="Project photos" />
          <Stat value={yearRange} label="Active years" />
        </div>
      </div>

      {/* ── Gallery section ──────────────────────────────────────────── */}
      <section className="bg-stone py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* section heading + filter bar */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-gold">Project Gallery</p>
              <h2 className="mt-2 text-2xl font-black text-navy sm:text-3xl">Buildings we have delivered</h2>
            </div>

            {types.length > 1 && (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by project type">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <Filter size={14} /> Filter:
                </span>
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilter(type)}
                    className={`rounded-full px-4 py-1.5 text-xs font-black transition ${
                      filter === type
                        ? 'bg-navy text-white shadow'
                        : 'border border-slate-300 bg-white text-navy hover:bg-stone'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* result count */}
          <p className="mt-4 text-sm text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            {filter !== ALL ? ` · ${filter}` : ''}
          </p>

          {/* card grid */}
          <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filtered.length ? (
              filtered.map((project) => (
                <PreviousConstructionCard
                  key={project.id}
                  project={project}
                  onOpenGallery={openGallery}
                />
              ))
            ) : (
              <EmptyState
                title="No projects in this category"
                message="Try selecting a different filter or check back after the admin adds more projects."
              />
            )}
          </div>
        </div>
      </section>

      {/* ── Full-screen lightbox ─────────────────────────────────────── */}
      {selectedProject && (
        <ProjectGalleryModal
          project={selectedProject}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

// ── Stat chip ────────────────────────────────────────────────────────────
function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <p className="text-2xl font-black text-navy sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

// ── Gallery lightbox modal ───────────────────────────────────────────────
function ProjectGalleryModal({ project, activeImage, setActiveImage, onClose }) {
  const images = project.gallery?.length ? project.gallery : [project.heroImage];
  const prev = () => setActiveImage((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveImage((i) => (i + 1) % images.length);

  // Keyboard navigation
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
    <div
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-navy/97 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} gallery`}
    >
      <div className="mx-auto flex w-full min-h-full max-w-6xl flex-col justify-center">

        {/* header */}
        <div className="mb-4 flex items-start justify-between gap-4 text-white">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Previous Construction</p>
            <h2 className="mt-1 break-words text-xl font-black sm:text-2xl">{project.name}</h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{project.location}</span>
              {project.completionYear && (
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{project.completionYear}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/20 text-white hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* main image */}
        <div className="relative overflow-hidden rounded-xl bg-black">
          <img
            src={images[activeImage]}
            alt={`${project.name} – photo ${activeImage + 1} of ${images.length}`}
            className="h-[52vh] min-h-72 w-full object-contain sm:h-[62vh]"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg bg-white/90 text-navy shadow-lg hover:bg-white"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg bg-white/90 text-navy shadow-lg hover:bg-white"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white">
            {activeImage + 1} / {images.length}
          </span>
        </div>

        {/* thumbnail strip */}
        {images.length > 1 && (
          <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={`${img.slice(0, 36)}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  activeImage === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* description */}
        <p className="mt-4 text-sm leading-7 text-slate-300">
          <Images size={15} className="mr-2 inline text-gold" />
          {project.description}
        </p>
      </div>
    </div>
  );
}
