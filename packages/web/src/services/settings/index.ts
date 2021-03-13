import { openDB } from 'idb';

const db = await openDB('appSettings', 1);
