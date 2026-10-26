import { openDB } from 'idb'

// Database settings
export const DB_NAME = 'NotesDB'
export const STORE_NAME = 'notes'
const DB_VERSION = 1

/**
 * Opens (or creates) the NotesDB IndexedDB database.
 * The "notes" object store is created the first time the app runs.
 * @returns {Promise<IDBPDatabase>} the open database connection
 */
export function openNotesDB() {
  return openDB(DB_NAME, DB_VERSION, {
    // upgrade only runs when the database is new or the version changes
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Each note gets an automatic number as its id
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })
      }
    },
  })
}
