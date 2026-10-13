# Moodboard Notes

A minimal, black-and-white notetaking board. Notes live on a bounded canvas that grows when you drag a note toward the screen edges. Everything saves to your browser's localStorage.

## Run it
1. Extract the ZIP and open the folder in VS Code (File > Open Folder).
2. Open `index.html` in a browser, or right-click it and choose "Open with Live Server" if you have that extension.

No build step, no dependencies.

## Files
- `index.html` - page structure
- `style.css` - all styling (black, white and grey only, square corners)
- `script.js` - canvas, notes, links, storage

## Controls
- Double-click empty space: new note
- Drag a note's top bar: move it (drag near a screen edge to extend the board)
- Drag the bottom-right corner: resize; "fit" in the note menu shrinks it back to its text
- Drag the small square on a note's right edge onto another note: connect them
- Grey square in a note's top-right corner: menu with detail +/-, fit, del
- "detail" on: shows "detail ↗" on the note, which opens a wide page for it (Esc or "back" returns)
- Click a line, then Delete: remove a connection
- Ctrl+scroll: zoom, scroll: pan, Ctrl+F: search, Ctrl+Z: undo, Esc: deselect

## Pages
- "+ page" (top-right panel) adds a new page to the list
- The panel lists your pages; the current page is highlighted. Click a page to open it
- Double-click a page name to rename it (Enter to confirm, Esc to cancel)
- "del" removes a page (click twice to confirm); the last page can't be deleted

## Export notes
"export notes" (bottom left) shows your notes as plain text, numbered in reading order, with connections listed. Choose "this page" or "all pages", then "copy" or "save .txt".

## Images
Paste an image (Ctrl+V) while a note is focused to add it to that note, on a note's detail page, or on the board with nothing focused to create a new note for it. Images are shrunk (max 1000 px, JPEG) and stored in the browser's IndexedDB, which allows far more space than localStorage (usually hundreds of MB, depending on free disk space). Hover an image and click x to remove it (Ctrl+Z undoes). Images no longer used by any note are cleaned up automatically after 7 days. "export notes" lists images as a count only.

## Your data
Notes are stored in localStorage under the key `moodboard-v1`. localStorage is separate per browser and per address, so opening `index.html` directly and opening it through Live Server (localhost) show different boards. Use "backup" (bottom left): the text box holds notes and layout only; "save file" downloads a .json with images included, and "load file" (or pasting into "load") restores it, for example to move a board between browsers or between the two addresses.

## Put it on GitHub
```
git init
git add .
git commit -m "Moodboard notes"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```
Create the empty repo on github.com first (no README), then paste its URL above. You can also use VS Code's Source Control panel instead of the terminal.

## Host it
Netlify, GitHub Pages or any static host works: it is plain HTML, CSS and JS with nothing to build.
