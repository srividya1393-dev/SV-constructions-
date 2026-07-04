export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="bg-navy py-12 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>}
      </div>
    </section>
  );
}
