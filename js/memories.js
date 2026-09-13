// ========================================
// LuckyLife 🌿 Memories
// ========================================

let selectedMemoryImage = "";

document.addEventListener("DOMContentLoaded", initMemories);

function initMemories() {
  const input = document.getElementById("memoryImage");
  if (!input) return;

  loadMemories();

  input.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {
      selectedMemoryImage = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

function saveMemory() {
  const title = document.getElementById("memoryTitle");
  const date = document.getElementById("memoryDate");
  const story = document.getElementById("memoryStory");

  if (
    title.value.trim() === "" ||
    date.value === "" ||
    story.value.trim() === "" ||
    selectedMemoryImage === ""
  ) {
    alert("Please complete every field.");
    return;
  }

  const memories = JSON.parse(
    localStorage.getItem("luckylife-memories") || "[]"
  );

  memories.unshift({
    id: Date.now(),
    title: title.value.trim(),
    date: date.value,
    story: story.value.trim(),
    image: selectedMemoryImage
  });

  localStorage.setItem(
    "luckylife-memories",
    JSON.stringify(memories)
  );

  title.value = "";
  date.value = "";
  story.value = "";
  document.getElementById("memoryImage").value = "";
  selectedMemoryImage = "";

  loadMemories();
}

function loadMemories() {
  const grid = document.getElementById("memoryGrid");
  if (!grid) return;

  const memories = JSON.parse(
    localStorage.getItem("luckylife-memories") || "[]"
  );

  grid.innerHTML = "";

  if (memories.length === 0) {
    grid.innerHTML = `<div class="empty">No memories yet 🤍</div>`;
    return;
  }

  memories.forEach(memory => {
    const card = document.createElement("div");
    card.className = "memory-card";

    card.innerHTML = `
      <img src="${memory.image}" alt="${escapeHTML(memory.title)}">

      <div class="memory-content">
        <div class="memory-date">${memory.date}</div>

        <h3>${escapeHTML(memory.title)}</h3>

        <p>${escapeHTML(memory.story)}</p>

        <button class="delete-btn"
          onclick="deleteMemory(${memory.id})">
          Delete Memory
        </button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function deleteMemory(id) {
  const memories = JSON.parse(
    localStorage.getItem("luckylife-memories") || "[]"
  );

  const updated = memories.filter(
    memory => memory.id !== id
  );

  localStorage.setItem(
    "luckylife-memories",
    JSON.stringify(updated)
  );

  loadMemories();
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}