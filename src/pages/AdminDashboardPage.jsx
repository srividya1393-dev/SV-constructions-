import { useMemo, useState } from 'react';
import { Building2, CheckCircle2, Edit3, ImagePlus, Images, LogOut, Plus, RotateCcw, Save, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { useProperties } from '../context/PropertyContext';
import { imageFilesToDataUrls } from '../services/imageUpload';

const SESSION_KEY = 'sri-vidya-admin-session';
const DEMO_USER = 'admin';
const DEMO_PASSWORD = 'SVC@2026';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

const emptyForm = {
  name: '', location: '', price: '', description: '', propertyType: 'Apartment',
  status: 'Available', area: '', floorsRooms: '', availability: '', completionYear: '', gallery: [],
};

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'active');
  if (!authenticated) return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  return <AdminWorkspace onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthenticated(false); }} />;
}

function AdminLogin({ onSuccess }) {
  const [error, setError] = useState('');
  const login = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('username') === DEMO_USER && data.get('password') === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'active');
      onSuccess();
    } else setError('Incorrect username or password.');
  };

  return (
    <section className="grid min-h-[72vh] place-items-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-card sm:p-8">
        <span className="grid h-12 w-12 place-items-center rounded bg-navy text-gold"><ShieldCheck size={25} /></span>
        <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-gold">Protected Area</p>
        <h1 className="mt-2 text-3xl font-black text-navy">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Manage current properties and previous construction projects.</p>
        <form onSubmit={login} className="mt-7 space-y-5">
          <AdminField label="Username" name="username" required />
          <AdminField label="Password" name="password" type="password" required />
          {error && <p role="alert" className="rounded border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
          <button type="submit" className="w-full rounded bg-gold px-5 py-3 font-black text-navy">Sign In</button>
        </form>
        <div className="mt-6 rounded border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
          <p className="font-black">Static demo access</p>
          <p>Username: <strong>{DEMO_USER}</strong> | Password: <strong>{DEMO_PASSWORD}</strong></p>
          <p className="mt-1">Connect server authentication before accepting real production data.</p>
        </div>
      </div>
    </section>
  );
}

function AdminWorkspace({ onLogout }) {
  const { currentProperties, previousBuildings, storageError, saveItem, deleteItem, resetSampleData } = useProperties();
  const [section, setSection] = useState('current');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState(null);
  const items = section === 'current' ? currentProperties : previousBuildings;
  const availableCount = useMemo(() => currentProperties.filter((item) => item.status === 'Available').length, [currentProperties]);

  const startAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, status: section === 'previous' ? 'Completed' : 'Available' });
    setShowForm(true);
    setNotice(null);
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setForm({ ...emptyForm, ...item, gallery: item.gallery || [item.heroImage] });
    setShowForm(true);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImages = async (event) => {
    const input = event.target;
    const files = event.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      if (form.gallery.length + files.length > 10) {
        throw new Error('Upload up to 10 images per project.');
      }
      const images = await imageFilesToDataUrls(files);
      setForm((value) => ({ ...value, gallery: [...value.gallery, ...images] }));
      setNotice(null);
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'The selected images could not be prepared.' });
    } finally {
      setUploading(false);
      input.value = '';
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (section === 'previous' && form.gallery.length === 0) {
      setNotice({ type: 'error', text: 'Please upload at least one real project image.' });
      return;
    }
    const id = editing || `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
    const gallery = form.gallery.length ? form.gallery : [DEFAULT_IMAGE];
    const projectData = section === 'previous'
      ? { ...form, price: 'Project completed', propertyType: 'Construction Project' }
      : form;
    saveItem(section, { ...projectData, id, heroImage: gallery[0], gallery });
    setNotice({ type: 'success', text: editing ? 'Project updated successfully.' : 'New project added successfully.' });
    setShowForm(false);
    setEditing(null);
  };

  const remove = (id, name) => {
    if (window.confirm(`Delete ${name}? This removes it from the browser data.`)) {
      deleteItem(section, id);
      setNotice({ type: 'success', text: `${name} was deleted.` });
    }
  };

  const switchSection = (next) => { setSection(next); setShowForm(false); setEditing(null); setNotice(null); };

  return (
    <div className="min-h-[75vh] bg-slate-100 pb-16">
      <section className="border-b border-slate-200 bg-white py-7">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div><p className="text-sm font-black uppercase tracking-[0.16em] text-gold">Admin Dashboard</p><h1 className="mt-1 text-3xl font-black text-navy">Property management</h1></div>
          <div className="flex flex-wrap gap-2">
            <button onClick={resetSampleData} type="button" className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-black text-navy"><RotateCcw size={16} /> Reset samples</button>
            <button onClick={onLogout} type="button" className="inline-flex items-center gap-2 rounded bg-navy px-4 py-2 text-sm font-black text-white"><LogOut size={16} /> Sign out</button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid gap-4 py-7 sm:grid-cols-3">
          <AdminStat icon={Building2} value={currentProperties.length} label="Current properties" />
          <AdminStat icon={CheckCircle2} value={availableCount} label="Available now" />
          <AdminStat icon={ImagePlus} value={previousBuildings.length} label="Previous constructions" />
        </section>

        <div className="flex max-w-full overflow-x-auto border-b border-slate-300" role="tablist">
          <Tab active={section === 'current'} onClick={() => switchSection('current')}>Current Properties ({currentProperties.length})</Tab>
          <Tab active={section === 'previous'} onClick={() => switchSection('previous')}>Previous Constructions ({previousBuildings.length})</Tab>
        </div>
        {storageError && <p className="mt-5 rounded border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">{storageError}</p>}

        <section className="py-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><h2 className="text-2xl font-black text-navy">{section === 'current' ? 'Current selling buildings' : 'Previous constructions'}</h2><p className="mt-1 text-sm text-slate-600">Add, edit, and remove records in this section.</p></div>
            <button onClick={startAdd} type="button" className="inline-flex items-center justify-center gap-2 rounded bg-gold px-5 py-3 text-sm font-black text-navy"><Plus size={18} /> Add {section === 'current' ? 'Property' : 'Previous Construction'}</button>
          </div>

          {notice && <p className={`mt-5 rounded border p-3 text-sm font-bold ${notice.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{notice.text}</p>}
          {showForm && <BuildingForm form={form} setForm={setForm} editing={editing} section={section} uploading={uploading} onImages={handleImages} onSubmit={submit} onClose={() => setShowForm(false)} />}

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {items.length ? items.map((item) => <AdminItem key={item.id} item={item} onEdit={() => startEdit(item)} onDelete={() => remove(item.id, item.name)} />) : <EmptyState title="No buildings in this section" message="Use the add button to create the first record." />}
          </div>
        </section>
      </div>
    </div>
  );
}

function BuildingForm({ form, setForm, editing, section, uploading, onImages, onSubmit, onClose }) {
  const change = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const removeImage = (index) => setForm((value) => ({ ...value, gallery: value.gallery.filter((_, i) => i !== index) }));
  return (
    <form onSubmit={onSubmit} className="mt-7 rounded-md border border-slate-200 bg-white p-5 shadow-card sm:p-7">
      <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-gold">Upload Section</p><h3 className="mt-1 text-xl font-black text-navy">{editing ? 'Edit project details' : `Add ${section === 'current' ? 'current property' : 'previous construction'}`}</h3></div><button type="button" onClick={onClose} title="Close form" className="grid h-10 w-10 place-items-center rounded border border-slate-300 text-navy"><X size={19} /></button></div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <AdminField label={section === 'previous' ? 'Project name' : 'Building name / title'} name="name" value={form.name} onChange={change} required />
        <AdminField label="Location" name="location" value={form.location} onChange={change} required />
        {section === 'current' ? (
          <>
            <AdminField label="Price" name="price" value={form.price} onChange={change} required />
            <SelectField label="Property type" name="propertyType" value={form.propertyType} onChange={change} options={['Apartment', 'Villa', 'Independent House', 'Commercial', 'Plot']} />
            <SelectField label="Status" name="status" value={form.status} onChange={change} options={['Available', 'Sold', 'Completed']} />
            <AdminField label="Area" name="area" value={form.area} onChange={change} placeholder="Example: 1,450 sq.ft" />
            <AdminField label="Floors / rooms" name="floorsRooms" value={form.floorsRooms} onChange={change} placeholder="Example: G+5, 3 BHK" />
            <AdminField label="Availability note" name="availability" value={form.availability} onChange={change} placeholder="Example: Ready to move" />
          </>
        ) : (
          <>
            <AdminField label="Completion year" name="completionYear" value={form.completionYear} onChange={change} placeholder="Example: 2025" required />
            <SelectField label="Completion status" name="status" value={form.status} onChange={change} options={['Completed', 'In Progress']} />
          </>
        )}
      </div>
      <label className="mt-5 block"><span className="text-sm font-black text-navy">Description</span><textarea name="description" value={form.description} onChange={change} rows="4" required className="mt-2 w-full rounded border border-slate-300 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" /></label>
      <div className="mt-5"><p className="text-sm font-black text-navy">{section === 'previous' ? 'Project images' : 'Building images'}</p><label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-stone px-5 py-8 text-center hover:border-gold"><Upload className="text-gold" size={28} /><span className="mt-2 text-sm font-black text-navy">{uploading ? 'Preparing images...' : 'Choose multiple images'}</span><span className="mt-1 text-xs text-slate-500">JPG, PNG, or WEBP. First image becomes the cover.</span><input type="file" accept="image/*" multiple onChange={onImages} className="sr-only" /></label></div>
      {form.gallery.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.gallery.map((image, index) => <div key={`${image.slice(0, 30)}-${index}`} className="relative"><img src={image} alt={`Upload preview ${index + 1}`} className="h-28 w-full rounded object-cover" /><button type="button" title="Remove image" onClick={() => removeImage(index)} className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded bg-white text-rose-700 shadow"><X size={16} /></button></div>)}</div>}
      <button type="submit" disabled={uploading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-navy px-5 py-3 font-black text-white disabled:opacity-60 sm:w-auto"><Save size={18} /> {editing ? 'Save Changes' : section === 'previous' ? 'Add Project' : 'Add Building'}</button>
    </form>
  );
}

function AdminItem({ item, onEdit, onDelete }) {
  const imageCount = item.gallery?.length || 1;
  return <article className="flex min-w-0 flex-col overflow-hidden rounded-md border border-slate-200 bg-white sm:flex-row"><img src={item.heroImage} alt={item.name} className="h-48 w-full object-cover sm:h-auto sm:w-44" /><div className="flex min-w-0 flex-1 flex-col p-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="break-words text-lg font-black text-navy">{item.name}</h3><span className="h-fit rounded bg-stone px-2 py-1 text-xs font-black text-slate-600">{item.status}</span></div><p className="mt-1 text-sm font-semibold text-slate-500">{item.location}{item.completionYear ? ` | ${item.completionYear}` : ''}</p><p className="mt-2 inline-flex items-center gap-2 text-xs font-black text-slate-500"><Images size={15} className="text-gold" />{imageCount} {imageCount === 1 ? 'image' : 'images'}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-4 flex flex-wrap gap-2 sm:mt-auto sm:pt-4"><button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm font-black text-navy"><Edit3 size={16} /> Edit</button><button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded border border-rose-200 px-3 py-2 text-sm font-black text-rose-700"><Trash2 size={16} /> Delete</button></div></div></article>;
}

function AdminStat({ icon: Icon, value, label }) { return <div className="flex items-center gap-4 rounded-md border border-slate-200 bg-white p-5"><span className="grid h-11 w-11 place-items-center rounded bg-gold/20 text-navy"><Icon size={22} /></span><div><p className="text-2xl font-black text-navy">{value}</p><p className="text-sm font-semibold text-slate-500">{label}</p></div></div>; }
function Tab({ active, onClick, children }) { return <button role="tab" aria-selected={active} type="button" onClick={onClick} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-black ${active ? 'border-gold text-navy' : 'border-transparent text-slate-500'}`}>{children}</button>; }
function AdminField({ label, name, type = 'text', ...props }) { return <label className="block"><span className="text-sm font-black text-navy">{label}</span><input name={name} type={type} {...props} className="mt-2 w-full rounded border border-slate-300 px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30" /></label>; }
function SelectField({ label, name, value, onChange, options }) { return <label className="block"><span className="text-sm font-black text-navy">{label}</span><select name={name} value={value} onChange={onChange} className="mt-2 w-full rounded border border-slate-300 bg-white px-4 py-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
