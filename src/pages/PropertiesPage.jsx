import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import PropertyCard from '../components/PropertyCard';
import { useProperties } from '../context/PropertyContext';

export default function PropertiesPage() {
  const { currentProperties } = useProperties();
  return (
    <>
      <PageHeader eyebrow="Current Buildings" title="Properties available for sale." description="Browse current apartments, villas, and residential projects from SRI VIDYA CONSTRUCTIONS." />
      <section className="bg-stone py-14 sm:py-18"><div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 xl:grid-cols-3 lg:px-8">{currentProperties.length ? currentProperties.map((property) => <PropertyCard key={property.id} property={property} />) : <EmptyState title="No current properties" message="New property listings will appear here." />}</div></section>
    </>
  );
}
