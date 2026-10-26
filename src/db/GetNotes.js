import { openNotesDB, STORE_NAME } from './openDB'

/**
 * Reads every note saved in the "notes" object store.
 * @returns {Promise<Array<{id: number, text: string, createdAt: string}>>} all notes
 */
export async function getAllNotes() {
  const db = await openNotesDB()

  // getAll returns the notes in id order (oldest first)
  return db.getAll(STORE_NAME)
}
