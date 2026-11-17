const STORAGE_KEY = "study-notes";

const form = document.querySelector("#note-form");
const titleInput = document.querySelector("#title");
const bodyInput = document.querySelector("#body");
const list = document.querySelector("#notes");
const empty = document.querySelector("#empty");

// The array is the source of truth. The page is only a drawing of it.
let notes = loadNotes();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title || !body) return;

  notes.unshift({
    id: createId(),
    title,
    body,
    createdAt: new Date().toISOString(),
  });

  saveNotes();
  form.reset();
  titleInput.focus();
  render();
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;

  notes = notes.filter((note) => note.id !== button.dataset.delete);
  saveNotes();
  render();
});

function loadNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isNote);
  } catch {
    // Storage can hold a truncated or hand-edited value. Start fresh
    // instead of crashing the page on JSON.parse.
    return [];
  }
}

function isNote(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.body === "string"
  );
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render() {
  empty.hidden = notes.length > 0;
  list.replaceChildren();

  for (const note of notes) {
    const item = document.createElement("li");
    item.className = "note";

    const heading = document.createElement("h2");
    heading.textContent = note.title;

    const body = document.createElement("p");
    body.textContent = note.body;

    const meta = document.createElement("div");
    meta.className = "note-meta";

    const time = document.createElement("time");
    if (note.createdAt) time.dateTime = note.createdAt;
    time.textContent = formatTime(note.createdAt);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.delete = note.id;
    remove.textContent = "Delete";

    meta.append(time, remove);
    item.append(heading, body, meta);
    list.append(item);
  }
}

function formatTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function createId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

render();
