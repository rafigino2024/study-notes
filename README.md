# Study notes

A small browser app for saving study notes on this computer. Each note has a title and a body. New notes appear at the top. Deleting a note removes it from the list.

Notes are stored in `localStorage` under the key `study-notes`. Closing the tab does not erase them. They stay in this browser until you delete them.

## Run it

From this folder:

```bash
python -m http.server 8765
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

## Files

- `index.html` — the page
- `styles.css` — layout and color
- `app.js` — the note list, and loading and saving it
