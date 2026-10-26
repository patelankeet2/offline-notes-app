# Offline Notes App

A simple Progressive Web App (PWA) built with React and Vite. You can add notes, see all saved notes, and keep using the app when there is no internet connection.

## Features

* Add a note using a simple text box
* View the list of all saved notes
* Notes are stored in IndexedDB (database `NotesDB`, object store `notes`)
* A service worker caches the app files so the app opens offline
* Online / offline badge at the top of the page

## Tech used

* React 19 with Vite 7
* `idb` (small wrapper around the IndexedDB API)
* `vite-plugin-pwa` (injectManifest strategy with a hand written service worker)

## Project structure

```
src/
  main.jsx              starts React and registers the service worker
  App.jsx               the user interface
  service-worker.js     caching logic for offline use
  db/
    openDB.js           opens NotesDB and creates the notes store
    AddNotes.js         addNote(text)
    GetNotes.js         getAllNotes()
vite.config.js          Vite and PWA configuration
```

## How to run

```
npm install
npm run dev        # development server (service worker is not registered here)
npm run build      # production build, also builds the service worker
npm run preview    # serves the build on http://localhost:4173
```

To test offline mode, open the preview in Chrome or Edge, press F12, go to the Network tab, choose **Offline** and reload the page.

## Notes

* The service worker is only registered in the production build, so always test offline mode with `npm run build` and `npm run preview`.
* Notes are stored per browser and per address, so notes added on port 5173 (dev) will not show on port 4173 (preview).
