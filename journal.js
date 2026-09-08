// ========================================
// LuckyLife 🌿
// Journal
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  showJournalDate();
  setupMoodButtons();
  loadJournal();

  const saveButton = document.getElementById("saveJournal");

  if (saveButton) {
    saveButton.addEventListener("click", saveJournal);
  }
});


// ========================================
// TODAY'S DATE
// ========================================

function showJournalDate() {
  const dateElement = document.getElementById("journalDate");

  if (!dateElement) return;

  const today = new Date();

  dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}


// ========================================
// MOOD
// ========================================

let selectedMood = "";

function setupMoodButtons() {
  const buttons = document.querySelectorAll(".mood-btn");
  const moodText = document.getElementById("selectedMood");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {

      // Remove selection from every button
      buttons.forEach((btn) => {
        btn.classList.remove("selected");
      });

      // Select clicked button
      button.classList.add("selected");

      selectedMood = button.dataset.mood || "";

      if (moodText) {
        moodText.textContent =
          "Today's mood: " + selectedMood;
      }
    });
  });
}


// ========================================
// SAVE JOURNAL
// ========================================

function saveJournal() {

  const gratitude1 = getValue("gratitude1");
  const gratitude2 = getValue("gratitude2");
  const gratitude3 = getValue("gratitude3");
  const reflection = getValue("reflection");
  const prayer = getValue("prayer");

  // Make sure the user wrote something
  if (
    gratitude1 === "" &&
    gratitude2 === "" &&
    gratitude3 === "" &&
    reflection === "" &&
    prayer === "" &&
    selectedMood === ""
  ) {
    alert("Please write something in your journal before saving. 🤍");
    return;
  }

  // Get existing entries
  let entries = [];

  try {
    entries = JSON.parse(
      localStorage.getItem("luckylife-journal") || "[]"
    );

    if (!Array.isArray(entries)) {
      entries = [];
    }

  } catch (error) {
    console.error("Could not read journal entries:", error);
    entries = [];
  }


  // Create new entry
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),

    gratitude: [
      gratitude1,
      gratitude2,
      gratitude3
    ],

    reflection: reflection,
    prayer: prayer,
    mood: selectedMood
  };


  // Newest entry first
  entries.unshift(entry);


  // Save journal
  try {
    localStorage.setItem(
      "luckylife-journal",
      JSON.stringify(entries)
    );
  } catch (error) {
    console.error("Could not save journal:", error);
    alert("Sorry, your journal could not be saved.");
    return;
  }


  // Clear form
  clearJournalForm();


  // Show success message
  const message = document.getElementById("saveMessage");

  if (message) {
    message.textContent =
      "Your journal has been saved successfully 🌿";

    setTimeout(() => {
      message.textContent = "";
    }, 3000);
  }


  // Refresh journal history
  loadJournal();
}


// ========================================
// GET VALUE SAFELY
// ========================================

function getValue(id) {
  const element = document.getElementById(id);

  if (!element) return "";

  return element.value.trim();
}


// ========================================
// CLEAR FORM
// ========================================

function clearJournalForm() {

  const fields = [
    "gratitude1",
    "gratitude2",
    "gratitude3",
    "reflection",
    "prayer"
  ];

  fields.forEach((id) => {
    const element = document.getElementById(id);

    if (element) {
      element.value = "";
    }
  });


  // Reset mood
  selectedMood = "";

  document.querySelectorAll(".mood-btn").forEach((button) => {
    button.classList.remove("selected");
  });


  const moodText = document.getElementById("selectedMood");

  if (moodText) {
    moodText.textContent = "No mood selected";
  }
}


// ========================================
// LOAD JOURNAL
// ========================================

function loadJournal() {

  const main = document.querySelector("main");

  if (!main) {
    console.error("Journal error: <main> was not found.");
    return;
  }


  // Find history section
  let history = document.getElementById("journalHistory");


  // Create it if it doesn't exist
  if (!history) {

    history = document.createElement("section");

    history.id = "journalHistory";
    history.className = "journal-history";

    main.appendChild(history);
  }


  // Get entries
  let entries = [];

  try {

    entries = JSON.parse(
      localStorage.getItem("luckylife-journal") || "[]"
    );

    if (!Array.isArray(entries)) {
      entries = [];
    }

  } catch (error) {

    console.error("Could not load journal:", error);

    entries = [];
  }


  // Clear history
  history.innerHTML = "";


  // No entries
  if (entries.length === 0) {

    history.innerHTML = `
      <div class="card journal-empty">

        <span class="label">MY JOURNAL</span>

        <h2>Your journal is waiting for you 🤍</h2>

        <p>
          Write your first entry above and
          it will appear here.
        </p>

      </div>
    `;

    return;
  }


  // History heading
  const heading = document.createElement("div");

  heading.className = "section-title";

  heading.innerHTML = `
    <h2>Previous Entries</h2>
    <p>Your thoughts, prayers and memories.</p>
  `;

  history.appendChild(heading);


  // Display every entry
  entries.forEach((entry) => {

    const card = document.createElement("div");

    card.className = "card journal-entry";


    // Date
    const entryDate = new Date(entry.date);

    const formattedDate =
      isNaN(entryDate.getTime())
        ? "Unknown date"
        : entryDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          });


    // ========================================
    // GRATITUDE
    // ========================================

    let gratitudeHTML = "";

    if (
      Array.isArray(entry.gratitude) &&
      entry.gratitude.some((item) => item)
    ) {

      const gratitudeItems = entry.gratitude
        .filter((item) => item)
        .map((item) => {
          return `<li>${escapeHTML(item)}</li>`;
        })
        .join("");

      gratitudeHTML = `
        <div class="journal-entry-section">

          <span class="label">GRATITUDE</span>

          <ul>
            ${gratitudeItems}
          </ul>

        </div>
      `;
    }


    // ========================================
    // REFLECTION
    // ========================================

    let reflectionHTML = "";

    if (entry.reflection) {

      reflectionHTML = `
        <div class="journal-entry-section">

          <span class="label">REFLECTION</span>

          <p>${escapeHTML(entry.reflection)}</p>

        </div>
      `;
    }


    // ========================================
    // PRAYER
    // ========================================

    let prayerHTML = "";

    if (entry.prayer) {

      prayerHTML = `
        <div class="journal-entry-section prayer-entry">

          <span class="label">PRAYER 🙏</span>

          <p>${escapeHTML(entry.prayer)}</p>

        </div>
      `;
    }


    // ========================================
    // MOOD
    // ========================================

    let moodHTML = "";

    if (entry.mood) {

      moodHTML = `
        <div class="entry-mood">
          Mood: ${escapeHTML(entry.mood)}
        </div>
      `;
    }


    // ========================================
    // COMPLETE CARD
    // ========================================

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
        type="button"
        onclick="deleteJournalEntry(${entry.id})">

        Delete Entry

      </button>

    `;


    history.appendChild(card);
  });
}


// ========================================
// DELETE JOURNAL ENTRY
// ========================================

function deleteJournalEntry(id) {

  const confirmDelete = confirm(
    "Are you sure you want to delete this journal entry?"
  );

  if (!confirmDelete) return;


  let entries = [];

  try {

    entries = JSON.parse(
      localStorage.getItem("luckylife-journal") || "[]"
    );

    if (!Array.isArray(entries)) {
      entries = [];
    }

  } catch (error) {

    console.error("Could not read journal entries:", error);

    return;
  }


  entries = entries.filter((entry) => {
    return entry.id !== id;
  });


  localStorage.setItem(
    "luckylife-journal",
    JSON.stringify(entries)
  );


  loadJournal();
}


// ========================================
// SECURITY
// ========================================

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = String(text ?? "");

  return div.innerHTML;
}