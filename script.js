let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function toast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

function displayNotes() {
  const container = document.getElementById("notesContainer");
  const search = document.getElementById("searchInput").value.toLowerCase();
  container.innerHTML = "";

  const sortedNotes = [...notes].sort((a, b) => b.pinned - a.pinned);

  sortedNotes.forEach((note, index) => {
    if (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    ) {
      const noteEl = document.createElement("div");
      noteEl.className = `note ${note.pinned ? "pinned" : ""}`;
      noteEl.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <small>${note.date}</small>
        <div class="btn-group">
          <button onclick="editNote(${index})">✏️ Edit</button>
          <button onclick="deleteNote(${index})">🗑 Delete</button>
          <button onclick="togglePin(${index})">${note.pinned ? "📌 Unpin" : "📌 Pin"}</button>
        </div>
      `;
      container.appendChild(noteEl);
    }
  });
}

function addOrUpdateNote() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const editingId = document.getElementById("editingId").value;

  if (!title || !content) {
    alert("Please enter both title and content.");
    return;
  }

  if (editingId) {
    notes[editingId].title = title;
    notes[editingId].content = content;
    notes[editingId].date = new Date().toLocaleString();
    document.getElementById("editingId").value = "";
    toast("Note updated!");
  } else {
    const newNote = {
      title,
      content,
      date: new Date().toLocaleString(),
      pinned: false,
    };
    notes.unshift(newNote);
    toast("Note added!");
  }

  saveNotes();
  displayNotes();

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}

function deleteNote(index) {
  if (confirm("Delete this note?")) {
    notes.splice(index, 1);
    saveNotes();
    displayNotes();
    toast("Note deleted!");
  }
}

function editNote(index) {
  document.getElementById("title").value = notes[index].title;
  document.getElementById("content").value = notes[index].content;
  document.getElementById("editingId").value = index;
}

function togglePin(index) {
  notes[index].pinned = !notes[index].pinned;
  saveNotes();
  displayNotes();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

// Init
loadTheme();
displayNotes();