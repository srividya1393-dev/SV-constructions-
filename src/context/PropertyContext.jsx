import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { completedProjects as seedPrevious, properties as seedCurrent } from '../data/properties';

const PropertyContext = createContext(null);

function readStoredCurrent() {
  try {
    const saved = localStorage.getItem('projectImages');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function readStoredPrevious() {
  try {
    const saved = localStorage.getItem('previousProjects');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function PropertyProvider({ children }) {
  const [currentProperties, setCurrentProperties] = useState(() => {
    const stored = readStoredCurrent();
    return stored && stored.length > 0 ? stored : seedCurrent;
  });

  const [previousBuildings, setPreviousBuildings] = useState(() => {
    const stored = readStoredPrevious();
    return stored && stored.length > 0 ? stored : seedPrevious;
  });

  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('projectImages', JSON.stringify(currentProperties));
      setStorageError('');
    } catch {
      setStorageError('Browser storage is full. Remove a few large images before refreshing.');
    }
  }, [currentProperties]);

  useEffect(() => {
    try {
      localStorage.setItem('previousProjects', JSON.stringify(previousBuildings));
      setStorageError('');
    } catch {
      setStorageError('Browser storage is full. Remove a few large images before refreshing.');
    }
  }, [previousBuildings]);

  const actions = useMemo(() => ({
    saveItem(section, item) {
      const setter = section === 'current' ? setCurrentProperties : setPreviousBuildings;
      setter((items) => {
        const exists = items.some((existing) => existing.id === item.id);
        return exists
          ? items.map((existing) => (existing.id === item.id ? item : existing))
          : [item, ...items];
      });
    },
    deleteItem(section, id) {
      const setter = section === 'current' ? setCurrentProperties : setPreviousBuildings;
      setter((items) => items.filter((item) => item.id !== id));
    },
    resetSampleData() {
      setCurrentProperties(seedCurrent);
      setPreviousBuildings(seedPrevious);
    },
  }), []);

  return (
    <PropertyContext.Provider value={{ currentProperties, previousBuildings, storageError, ...actions }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) throw new Error('useProperties must be used inside PropertyProvider');
  return context;
}
