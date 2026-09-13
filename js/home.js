// ========================================
// LuckyLife 🌿 Home Dashboard
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  updateDashboard
);


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

  // ------------------------------
  // TODAY'S DATE
  // ------------------------------

  const date = document.getElementById("todayDate");

  if (date) {
    date.textContent = new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
  }


  // ------------------------------
  // GET PROGRESS ELEMENT
  // ------------------------------

  const progress =
    document.getElementById("progressNumber");

  if (!progress) return;


  // ------------------------------
  // GET TODAY'S DATE
  // ------------------------------

  const today = getLocalDate();

  const storageKey =
    "luckylife-" + today;


  // ------------------------------
  // GET PLANNER TASKS
  // ------------------------------

  const tasks = JSON.parse(
    localStorage.getItem(storageKey) || "[]"
  );


  // ------------------------------
  // CALCULATE PROGRESS
  // ------------------------------

  const completed = tasks.filter(
    task => task.completed
  ).length;

  const total = tasks.length;

  const percent =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );


  // ------------------------------
  // SHOW PERCENTAGE
  // ------------------------------

  progress.textContent =
    percent + "%";


  // ------------------------------
  // SHOW TASK COUNT
  // ------------------------------

  const progressText =
    document.getElementById("progressText");

  if (progressText) {
    progressText.textContent =
      `${completed} of ${total} tasks completed`;
  }


  // ------------------------------
  // UPDATE PROGRESS BAR
  // ------------------------------

  const progressFill =
    document.getElementById("progressFill");

  if (progressFill) {
    progressFill.style.width =
      percent + "%";
  }


  // ------------------------------
  // FIND NEXT TASK
  // ------------------------------

  const unfinishedTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {

      return convertTimeToMinutes(a.time) -
             convertTimeToMinutes(b.time);

    });


  const nextTask =
    unfinishedTasks[0];


  // ------------------------------
  // SHOW NEXT TASK
  // ------------------------------

  const nextTaskElement =
    document.getElementById("nextTask");

  const nextTimeElement =
    document.getElementById("nextTime");


  if (nextTask) {

    if (nextTaskElement) {
      nextTaskElement.textContent =
        nextTask.name;
    }

    if (nextTimeElement) {
      nextTimeElement.textContent =
        formatTime(nextTask.time);
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

  const year =
    today.getFullYear();

  const month =
    String(today.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(today.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// ========================================
// TIME → MINUTES
// ========================================

function convertTimeToMinutes(time) {

  if (!time) return 9999;

  const parts =
    time.split(":");

  const hours =
    parseInt(parts[0], 10);

  const minutes =
    parseInt(parts[1], 10);

  return hours * 60 + minutes;
}


// ========================================
// FORMAT TIME
// ========================================

function formatTime(time) {

  if (!time) return "";

  const [hours, minutes] =
    time.split(":");

  const date = new Date();

  date.setHours(
    parseInt(hours),
    parseInt(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );
}