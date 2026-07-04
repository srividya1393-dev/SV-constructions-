import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { completedProjects as seedPrevious, properties as seedCurrent } from '../data/properties';

const STORAGE_KEY = 'sri-vidya-property-data-v1';
const PropertyContext = createContext(null);

function readStoredData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function PropertyProvider({ children }) {
  const stored = readStoredData();
  const [currentProperties, setCurrentProperties] = useState(stored?.current || seedCurrent);
  const [previousBuildings, setPreviousBuildings] = useState(stored?.previous || seedPrevious);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ current: currentProperties, previous: previousBuildings }),
      );
      setStorageError('');
    } catch {
      setStorageError('Browser storage is full. Remove a few large images or connect cloud storage before refreshing.');
    }
  }, [currentProperties, previousBuildings]);

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
