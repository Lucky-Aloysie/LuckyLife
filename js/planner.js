// ========================================
// LuckyLife 🌿 Planner
// ========================================

let tasks = [];
let currentDate = "";

document.addEventListener("DOMContentLoaded", initPlanner);

function initPlanner() {
  const picker = document.getElementById("planner-date");

  if (!picker) return;

  // Use the user's local date
  currentDate = getLocalDate();

  picker.value = currentDate;

  loadTasks();

  picker.addEventListener("change", () => {
    currentDate = picker.value;
    loadTasks();
  });
}


// ========================================
// GET LOCAL DATE
// ========================================

function getLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// ========================================
// ADD TASK
// ========================================

function addTask() {
  const time = document.getElementById("task-time");
  const name = document.getElementById("task-name");

  if (time.value === "" || name.value.trim() === "") {
    alert("Please enter both a time and task.");
    return;
  }

  tasks.push({
    id: Date.now(),
    time: time.value,
    name: name.value.trim(),
    completed: false
  });

  // Sort tasks by time
  tasks.sort((a, b) => a.time.localeCompare(b.time));

  saveTasks();

  time.value = "";
  name.value = "";

  displayTasks();
}


// ========================================
// DISPLAY TASKS
// ========================================

function displayTasks() {
  const list = document.getElementById("task-list");

  if (!list) return;

  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = `
      <div class="empty">
        No tasks yet 🌿
      </div>
    `;

    return;
  }

  tasks.forEach(task => {
    const div = document.createElement("div");

    div.className = task.completed
      ? "task done"
      : "task";

    div.innerHTML = `
      <div class="task-info">

        <div class="task-time">
          ${escapeHTML(formatTime(task.time))}
        </div>

        <div class="task-name">
          ${escapeHTML(task.name)}
        </div>

      </div>

      <div class="task-buttons">

        <button onclick="toggleTask(${task.id})">
          ${task.completed ? "↩️" : "✓"}
        </button>

        <button onclick="deleteTask(${task.id})">
          🗑
        </button>

      </div>
    `;

    list.appendChild(div);
  });
}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(
    parseInt(hours),
    parseInt(minutes),
    0,
    0
  );

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}


// ========================================
// COMPLETE / UNCOMPLETE TASK
// ========================================

function toggleTask(id) {
  tasks = tasks.map(task => {

    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();

  displayTasks();
}


// ========================================
// DELETE TASK
// ========================================

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  saveTasks();

  displayTasks();
}


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {
  localStorage.setItem(
    "luckylife-" + currentDate,
    JSON.stringify(tasks)
  );
}


// ========================================
// LOAD TASKS
// ========================================

function loadTasks() {
  tasks = JSON.parse(
    localStorage.getItem(
      "luckylife-" + currentDate
    ) || "[]"
  );

  // Make sure tasks are sorted
  tasks.sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  displayTasks();
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
}