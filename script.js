```javascript
// ========================================
// LuckyLife 🌿
// Complete Script
// Home • Planner • Goals • Memories • Journal
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  initPlanner();
  loadGoals();
  initMemories();
  initJournal();
});


// ========================================
// HOME DASHBOARD
// ========================================

function updateDashboard() {

  const date = document.getElementById("todayDate");

  if (date) {
    date.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  const progress = document.getElementById("progressNumber");

  if (!progress) return;

  const today = new Date().toISOString().split("T")[0];

  const tasks = JSON.parse(
    localStorage.getItem("luckylife-" + today) || "[]"
  );

  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;

  const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  progress.textContent = percent + "%";

  const progressText =
    document.getElementById("progressText");

  const progressFill =
    document.getElementById("progressFill");

  if (progressText) {
    progressText.textContent =
      `${completed} of ${total} tasks completed`;
  }

  if (progressFill) {
    progressFill.style.width = percent + "%";
  }

  const next = tasks
    .filter(task => !task.completed)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  const nextTask =
    document.getElementById("nextTask");

  const nextTime =
    document.getElementById("nextTime");

  if (next) {

    if (nextTask) {
      nextTask.textContent = next.name;
    }

    if (nextTime) {
      nextTime.textContent = next.time;
    }

  } else {

    if (nextTask) {
      nextTask.textContent = "Nothing planned";
    }

    if (nextTime) {
      nextTime.textContent = "Open your planner";
    }
  }
}


// ========================================
// PLANNER
// ========================================

let tasks = [];
let currentDate = "";

function initPlanner() {

  const picker =
    document.getElementById("planner-date");

  if (!picker) return;

  currentDate =
    new Date().toISOString().split("T")[0];

  picker.value = currentDate;

  loadTasks();

  picker.addEventListener("change", () => {

    currentDate = picker.value;

    loadTasks();

  });
}


function addTask() {

  const time =
    document.getElementById("task-time");

  const name =
    document.getElementById("task-name");

  if (!time || !name) return;

  if (
    time.value === "" ||
    name.value.trim() === ""
  ) {

    alert("Please enter both a time and a task.");

    return;
  }

  tasks.push({
    id: Date.now(),
    time: time.value,
    name: name.value.trim(),
    completed: false
  });

  tasks.sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  saveTasks();

  time.value = "";
  name.value = "";

  displayTasks();

  updateDashboard();
}


function displayTasks() {

  const list =
    document.getElementById("task-list");

  if (!list) return;

  list.innerHTML = "";

  if (tasks.length === 0) {

    list.innerHTML =
      `<div class="empty">No tasks yet 🌿</div>`;

    return;
  }

  tasks.forEach(task => {

    const div =
      document.createElement("div");

    div.className =
      task.completed ? "task done" : "task";

    div.innerHTML = `
      <div class="task-info">

        <div class="task-time">
          ${escapeHTML(task.time)}
        </div>

        <div class="task-name">
          ${escapeHTML(task.name)}
        </div>

      </div>

      <div style="display:flex;gap:8px;">

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


function toggleTask(id) {

  tasks = tasks.map(task => {

    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;

  });

  saveTasks();

  displayTasks();

  updateDashboard();
}


function deleteTask(id) {

  tasks =
    tasks.filter(task => task.id !== id);

  saveTasks();

  displayTasks();

  updateDashboard();
}


function saveTasks() {

  if (!currentDate) return;

  localStorage.setItem(
    "luckylife-" + currentDate,
    JSON.stringify(tasks)
  );
}


function loadTasks() {

  if (!currentDate) return;

  tasks = JSON.parse(
    localStorage.getItem(
      "luckylife-" + currentDate
    ) || "[]"
  );

  displayTasks();
}


// ========================================
// GOALS
// ========================================

function addGoal() {

  const title =
    document.getElementById("goalTitle");

  const category =
    document.getElementById("goalCategory");

  const progress =
    document.getElementById("goalProgress");

  if (!title || !category || !progress) return;

  if (title.value.trim() === "") {

    alert("Please enter a goal.");

    return;
  }

  const goals = JSON.parse(
    localStorage.getItem("luckylife-goals") || "[]"
  );

  goals.unshift({
    id: Date.now(),
    title: title.value.trim(),
    category: category.value,
    progress: Number(progress.value)
  });

  localStorage.setItem(
    "luckylife-goals",
    JSON.stringify(goals)
  );

  title.value = "";

  progress.value = 0;

  loadGoals();
}


function loadGoals() {

  const grid =
    document.getElementById("goalGrid");

  if (!grid) return;

  const goals = JSON.parse(
    localStorage.getItem("luckylife-goals") || "[]"
  );

  grid.innerHTML = "";

  if (goals.length === 0) {

    grid.innerHTML =
      `<div class="empty">No goals yet 🌿</div>`;

    return;
  }

  goals.forEach(goal => {

    const card =
      document.createElement("div");

    card.className = "goal-card";

    card.innerHTML = `
      <div class="goal-category">
        ${escapeHTML(goal.category)}
      </div>

      <h3>
        ${escapeHTML(goal.title)}
      </h3>

      <div class="goal-progress">

        <div
          class="goal-fill"
          style="width:${goal.progress}%">
        </div>

      </div>

      <div class="goal-percent">
        ${goal.progress}% completed
      </div>

      <button
        class="delete-btn"
        onclick="deleteGoal(${goal.id})">

        Delete Goal

      </button>
    `;

    grid.appendChild(card);

  });
}


function deleteGoal(id) {

  const goals = JSON.parse(
    localStorage.getItem("luckylife-goals") || "[]"
  );

  const updated =
    goals.filter(goal => goal.id !== id);

  localStorage.setItem(
    "luckylife-goals",
    JSON.stringify(updated)
  );

  loadGoals();
}


// ========================================
// MEMORIES
// ========================================

let selectedMemoryImage = "";

function initMemories() {

  const input =
    document.getElementById("memoryImage");

  if (!input) return;

  loadMemories();

  input.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = e => {

      selectedMemoryImage =
        e.target.result;

    };

    reader.readAsDataURL(file);

  });
}


function saveMemory() {

  const title =
    document.getElementById("memoryTitle");

  const date =
    document.getElementById("memoryDate");

  const story =
    document.getElementById("memoryStory");

  if (!title || !date || !story) return;

  if (
    title.value.trim() === "" ||
    date.value === "" ||
    story.value.trim() === "" ||
    selectedMemoryImage === ""
  ) {

    alert(
      "Please complete all fields and choose a photo."
    );

    return;
  }

  const memories = JSON.parse(
    localStorage.getItem(
      "luckylife-memories"
    ) || "[]"
  );

  memories.unshift({

    id: Date.now(),

    title:
      title.value.trim(),

    date:
      date.value,

    story:
      story.value.trim(),

    image:
      selectedMemoryImage

  });

  localStorage.setItem(
    "luckylife-memories",
    JSON.stringify(memories)
  );

  title.value = "";
  date.value = "";
  story.value = "";

  const imageInput =
    document.getElementById("memoryImage");

  if (imageInput) {
    imageInput.value = "";
  }

  selectedMemoryImage = "";

  loadMemories();
}


function loadMemories() {

  const grid =
    document.getElementById("memoryGrid");

  if (!grid) return;

  const memories = JSON.parse(
    localStorage.getItem(
      "luckylife-memories"
    ) || "[]"
  );

  grid.innerHTML = "";

  if (memories.length === 0) {

    grid.innerHTML =
      `<div class="empty">
        No memories yet 🤍
      </div>`;

    return;
  }

  memories.forEach(memory => {

    const card =
      document.createElement("div");

    card.className =
      "memory-card";

    card.innerHTML = `

      <img
        src="${memory.image}"
        alt="${escapeHTML(memory.title)}">

      <div class="memory-content">

        <div class="memory-date">
          ${escapeHTML(memory.date)}
        </div>

        <h3>
          ${escapeHTML(memory.title)}
        </h3>

        <p>
          ${escapeHTML(memory.story)}
        </p>

        <button
          class="delete-btn"
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
    localStorage.getItem(
      "luckylife-memories"
    ) || "[]"
  );

  const updated =
    memories.filter(
      memory => memory.id !== id
    );

  localStorage.setItem(
    "luckylife-memories",
    JSON.stringify(updated)
  );

  loadMemories();
}


// ========================================
// JOURNAL 📖
// ========================================

let selectedMood = "";

function initJournal() {

  const date =
    document.getElementById("journalDate");

  // This means we are NOT on the Journal page.
  if (!date) return;


  // ----------------------------------------
  // Today's date
  // ----------------------------------------

  const today =
    new Date();

  date.textContent =
    today.toLocaleDateString("en-US", {

      weekday: "long",

      month: "long",

      day: "numeric",

      year: "numeric"

    });


  // ----------------------------------------
  // Mood buttons
  // ----------------------------------------

  const moodButtons =
    document.querySelectorAll(".mood-btn");

  moodButtons.forEach(button => {

    button.addEventListener("click", () => {

      moodButtons.forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");

      selectedMood =
        button.getAttribute("data-mood");

      const moodText =
        document.getElementById("selectedMood");

      if (moodText) {

        moodText.textContent =
          `Today's mood: ${selectedMood}`;

      }

    });

  });


  // ----------------------------------------
  // Save button
  // ----------------------------------------

  const saveButton =
    document.getElementById("saveJournal");

  if (saveButton) {

    saveButton.addEventListener(
      "click",
      saveJournal
    );

  }


  // ----------------------------------------
  // Load previous entries
  // ----------------------------------------

  loadJournal();

}


// ========================================
// SAVE JOURNAL
// ========================================

function saveJournal() {

  const gratitude1 =
    document.getElementById("gratitude1");

  const gratitude2 =
    document.getElementById("gratitude2");

  const gratitude3 =
    document.getElementById("gratitude3");

  const reflection =
    document.getElementById("reflection");

  const prayer =
    document.getElementById("prayer");


  if (
    !gratitude1 ||
    !gratitude2 ||
    !gratitude3 ||
    !reflection ||
    !prayer
  ) {

    console.error(
      "Journal fields could not be found."
    );

    return;
  }


  const g1 =
    gratitude1.value.trim();

  const g2 =
    gratitude2.value.trim();

  const g3 =
    gratitude3.value.trim();

  const reflectionText =
    reflection.value.trim();

  const prayerText =
    prayer.value.trim();


  // ----------------------------------------
  // Validation
  // ----------------------------------------

  if (
    g1 === "" &&
    g2 === "" &&
    g3 === "" &&
    reflectionText === "" &&
    prayerText === "" &&
    selectedMood === ""
  ) {

    alert(
      "Please write something in your journal before saving. 🤍"
    );

    return;
  }


  // ----------------------------------------
  // Get existing entries
  // ----------------------------------------

  let entries = JSON.parse(
    localStorage.getItem(
      "luckylife-journal"
    ) || "[]"
  );


  // ----------------------------------------
  // Create entry
  // ----------------------------------------

  const entry = {

    id: Date.now(),

    date:
      new Date().toISOString(),

    gratitude: [
      g1,
      g2,
      g3
    ],

    reflection:
      reflectionText,

    prayer:
      prayerText,

    mood:
      selectedMood

  };


  // ----------------------------------------
  // Save entry
  // ----------------------------------------

  entries.unshift(entry);

  localStorage.setItem(
    "luckylife-journal",
    JSON.stringify(entries)
  );


  // ----------------------------------------
  // Clear form
  // ----------------------------------------

  gratitude1.value = "";
  gratitude2.value = "";
  gratitude3.value = "";
  reflection.value = "";
  prayer.value = "";


  // Clear mood

  selectedMood = "";

  document.querySelectorAll(".mood-btn")
    .forEach(button => {
      button.classList.remove("selected");
    });


  const moodText =
    document.getElementById("selectedMood");

  if (moodText) {
    moodText.textContent =
      "No mood selected";
  }


  // ----------------------------------------
  // Success message
  // ----------------------------------------

  const message =
    document.getElementById("saveMessage");

  if (message) {

    message.textContent =
      "Your journal has been saved successfully 🌿";

    setTimeout(() => {

      message.textContent = "";

    }, 3000);

  }


  // ----------------------------------------
  // Show updated entries
  // ----------------------------------------

  loadJournal();

}


// ========================================
// LOAD JOURNAL
// ========================================

function loadJournal() {

  const main =
    document.querySelector("main");

  if (!main) return;


  // Create history section if needed

  let history =
    document.getElementById("journalHistory");


  if (!history) {

    history =
      document.createElement("section");

    history.id =
      "journalHistory";

    history.className =
      "journal-history";

    main.appendChild(history);

  }


  const entries = JSON.parse(
    localStorage.getItem(
      "luckylife-journal"
    ) || "[]"
  );


  history.innerHTML = "";


  // ----------------------------------------
  // No entries
  // ----------------------------------------

  if (entries.length === 0) {

    history.innerHTML = `

      <div class="card journal-empty">

        <span class="label">
          MY JOURNAL
        </span>

        <h2>
          Your journal is waiting for you 🤍
        </h2>

        <p>
          Write your first entry above and
          it will appear here.
        </p>

      </div>

    `;

    return;
  }


  // ----------------------------------------
  // History heading
  // ----------------------------------------

  const heading =
    document.createElement("div");

  heading.className =
    "section-title";

  heading.innerHTML = `

    <h2>
      Previous Entries
    </h2>

    <p>
      Your thoughts, prayers and memories.
    </p>

  `;

  history.appendChild(heading);


  // ----------------------------------------
  // Display entries
  // ----------------------------------------

  entries.forEach(entry => {

    const card =
      document.createElement("div");

    card.className =
      "card journal-entry";


    const entryDate =
      new Date(entry.date);


    const formattedDate =
      entryDate.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      );


    // Mood

    const moodHTML =
      entry.mood
        ? `
          <div class="entry-mood">
            ${escapeHTML(entry.mood)}
          </div>
        `
        : "";


    // Gratitude

    let gratitudeHTML = "";

    if (
      entry.gratitude &&
      entry.gratitude.some(item => item)
    ) {

      const items =
        entry.gratitude
          .filter(item => item)
          .map(
            item =>
              `<li>${escapeHTML(item)}</li>`
          )
          .join("");

      gratitudeHTML = `

        <div class="journal-entry-section">

          <span class="label">
            GRATITUDE
          </span>

          <ul>
            ${items}
          </ul>

        </div>

      `;
    }


    // Reflection

    let reflectionHTML = "";

    if (entry.reflection) {

      reflectionHTML = `

        <div class="journal-entry-section">

          <span class="label">
            REFLECTION
          </span>

          <p>
            ${escapeHTML(entry.reflection)}
          </p>

        </div>

      `;
    }


    // Prayer

    let prayerHTML = "";

    if (entry.prayer) {

      prayerHTML = `

        <div class="journal-entry-section prayer-entry">

          <span class="label">
            PRAYER 🙏
          </span>

          <p>
            ${escapeHTML(entry.prayer)}
          </p>

        </div>

      `;
    }


    card.innerHTML = `

      <div class="journal-entry-header">

        <div>

          <span class="label">
            JOURNAL ENTRY
          </span>

          <div class="journal-entry-date">
            ${formattedDate}
          </div>

        </div>

        ${moodHTML}

      </div>


      ${gratitudeHTML}

      ${reflectionHTML}

      ${prayerHTML}


      <button
        class="delete-btn"
        onclick="deleteJournal(${entry.id})">

        Delete Entry

      </button>

    `;


    history.appendChild(card);

  });

}


// ========================================
// DELETE JOURNAL
// ========================================

function deleteJournal(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this journal entry?"
    );

  if (!confirmed) return;


  let entries = JSON.parse(
    localStorage.getItem(
      "luckylife-journal"
    ) || "[]"
  );


  entries =
    entries.filter(
      entry => entry.id !== id
    );


  localStorage.setItem(
    "luckylife-journal",
    JSON.stringify(entries)
  );


  loadJournal();

}


// ========================================
// SECURITY
// ========================================

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value ?? "";

  return div.innerHTML;
}
``