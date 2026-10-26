import { useCallback, useEffect, useState } from 'react'
import { addNote } from './db/AddNotes'
import { getAllNotes } from './db/GetNotes'
import './App.css'

/**
 * Main UI of the Offline Notes App.
 * Shows a text box to add a note and a list of all saved notes.
 */
function App() {
  // Text currently typed in the input box
  const [noteText, setNoteText] = useState('')
  // All notes loaded from IndexedDB
  const [notes, setNotes] = useState([])
  // Message shown when something goes wrong
  const [error, setError] = useState('')
  // Tracks if the browser has an internet connection
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Reads all notes from IndexedDB and puts them on screen
  // (useCallback keeps the same function between renders)
  const loadNotes = useCallback(async () => {
    try {
      const savedNotes = await getAllNotes()
      setNotes(savedNotes)
    } catch (err) {
      console.error('Could not load notes:', err)
      setError('Could not load notes.')
    }
  }, [])

  // Load the saved notes once when the app starts
  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  // Listen for the browser going online or offline
  useEffect(() => {
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    // Remove the listeners when the component is removed
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Runs when the Add button is clicked or Enter is pressed
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!noteText.trim()) {
      setError('Please type a note first.')
      return
    }

    try {
      await addNote(noteText)
      setNoteText('')
      setError('')
      // Reload the list so the new note shows up
      await loadNotes()
    } catch (err) {
      console.error('Could not save note:', err)
      setError('Could not save the note.')
    }
  }

  return (
    <main className="app">
      <h1>Offline Notes App</h1>

      {/* Small badge that shows the connection status */}
      <p className={isOnline ? 'status online' : 'status offline'}>
        {isOnline ? 'Online' : 'Offline (notes are still saved on this device)'}
      </p>

      {/* Form to add a new note */}
      <form className="note-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="Write a note..."
          aria-label="New note"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* List of all saved notes */}
      {notes.length === 0 ? (
        <p className="empty">No notes yet. Add your first note above.</p>
      ) : (
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id}>{note.text}</li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
