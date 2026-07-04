import { CalendarDays, Images, MapPin, CheckCircle } from 'lucide-react';

/**
 * PreviousConstructionCard
 *
 * Displays a completed construction project in a rich card layout.
 * Clicking the image area or the "View Gallery" button opens the full-screen
 * gallery modal managed by the parent PreviousBuildingsPage.
 */
export default function PreviousConstructionCard({ project, onOpenGallery }) {
  const images = project.gallery?.length ? project.gallery : [project.heroImage];
  const extraCount = images.length - 3;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(11,31,58,0.16)]">

      {/* ── Hero image with photo-count badge ─────────────────────── */}
      <button
        type="button"
        onClick={() => onOpenGallery(project)}
        className="relative block h-60 w-full overflow-hidden bg-slate-200 text-left sm:h-64"
        aria-label={`Open ${project.name} gallery`}
      >
        <img
          src={images[0]}
          alt={`${project.name} – completed project`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* status badge */}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-black text-white backdrop-blur-sm">
          <CheckCircle size={13} />
          {project.status || 'Completed'}
        </span>

        {/* photo count */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-black text-white backdrop-blur-sm">
          <Images size={14} />
          {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
        </span>
      </button>

      {/* ── Thumbnail strip (when multiple images) ────────────────── */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-1 bg-slate-100 px-1 pb-1">
          {images.slice(0, 3).map((img, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => onOpenGallery(project)}
              aria-label={`View image ${i + 1}`}
              className="relative overflow-hidden"
            >
              <img src={img} alt="" className="h-16 w-full object-cover transition hover:opacity-80" />
              {/* "+N more" overlay on last visible thumb */}
              {i === 2 && extraCount > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-black text-white">
                  +{extraCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Card body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        {/* title */}
        <h2 className="break-words text-xl font-black text-navy">{project.name}</h2>

        {/* meta row */}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} className="shrink-0 text-gold" />
            {project.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} className="shrink-0 text-gold" />
            {project.completionYear || 'Year not added'}
          </span>
        </div>

        {/* description */}
        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-7 text-slate-600">{project.description}</p>

        {/* action */}
        <button
          type="button"
          onClick={() => onOpenGallery(project)}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-black text-white transition hover:bg-navy-soft"
        >
          <Images size={17} /> View Project Gallery
        </button>
      </div>
    </article>
  );
}
