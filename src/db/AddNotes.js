import { openNotesDB, STORE_NAME } from './openDB'

/**
 * Saves a new note in the "notes" object store.
 * @param {string} text the note entered by the user
 * @returns {Promise<number>} the id given to the new note
 */
export async function addNote(text) {
  const cleanText = text.trim()

  // Do not save empty notes
  if (!cleanText) {
    throw new Error('Note cannot be empty')
  }

  const db = await openNotesDB()

  // The id is added automatically by IndexedDB (autoIncrement)
  return db.add(STORE_NAME, {
    text: cleanText,
    createdAt: new Date().toISOString(),
  })
}
