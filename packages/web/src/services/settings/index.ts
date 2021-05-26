import { DBSchema, openDB } from 'idb';
import type { ThemeType } from '../theme';

export const DB_NAME = 'appDB';
const DB_VERSION = 1;

interface AppDB extends DBSchema {
  theme: {
    key: string;
    value: ThemeType;
  };
}

export async function getSettings() {
  const db = await openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade: (db) => {
      db.createObjectStore('theme');
    },
  });
  const settings = { theme: db.get('theme', 'app') };
  return settings;
}

export async function setTheme(theme: ThemeType) {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction('theme', 'readwrite');
  await tx.objectStore('theme').put(theme, 'app');
}
export async function getTheme(): Promise<ThemeType> {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction('theme', 'readonly');
  return await tx.objectStore('theme').get('app');
}
