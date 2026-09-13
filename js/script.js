// ========================================
// LuckyLife 🌿 Home Dashboard
// ========================================

document.addEventListener("DOMContentLoaded", updateDashboard);

function updateDashboard() {

  // Today's date
  const date = document.getElementById("todayDate");

  if (date) {
    date.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  // Get today's date
  const today = getLocalDate();

  // Get today's planner tasks
  const tasks = JSON.parse(
    localStorage.getItem("luckylife-" + today) || "[]"
  );

  // Calculate progress
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;

  const percent = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  // Progress percentage
  const progress = document.getElementById("progressNumber");

  if (progress) {
    progress.textContent = percent + "%";
  }

  // Progress text
  const progressText = document.getElementById("progressText");

  if (progressText) {
    progressText.textContent =
      `${completed} of ${total} tasks completed`;
  }

  // Progress bar
  const progressFill = document.getElementById("progressFill");

  if (progressFill) {
    progressFill.style.width = percent + "%";
  }

  // Find next unfinished task
  const unfinishedTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextTask = unfinishedTasks[0];

  const nextTaskElement = document.getElementById("nextTask");
  const nextTimeElement = document.getElementById("nextTime");

  if (nextTask) {

    if (nextTaskElement) {
      nextTaskElement.textContent = nextTask.name;
    }

    if (nextTimeElement) {
      nextTimeElement.textContent = formatTime(nextTask.time);
    }

  } else {

    if (nextTaskElement) {
      nextTaskElement.textContent =
        total === 0
          ? "Nothing planned"
          : "All tasks completed 🎉";
    }

    if (nextTimeElement) {
      nextTimeElement.textContent =
        total === 0
          ? "Open your planner"
          : "Great job today!";
    }
  }
}


// ========================================
// LOCAL DATE
// ========================================

function getLocalDate() {

  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1)
    .padStart(2, "0");

  const day = String(today.getDate())
    .padStart(2, "0");

  return `${year}-${month}-${day}`;
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