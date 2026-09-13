// ========================================
// LuckyLife 🌿
// SMART Goals
// ========================================


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener("DOMContentLoaded", function () {

  setupProgressSlider();

  loadGoals();

});


// ========================================
// PROGRESS SLIDER
// ========================================

function setupProgressSlider() {

  const slider = document.getElementById("goalProgress");
  const value = document.getElementById("progressValue");

  if (!slider || !value) {
    return;
  }

  slider.addEventListener("input", function () {

    value.textContent = slider.value + "% completed";

  });

}


// ========================================
// ADD GOAL
// ========================================

function addGoal() {

  const title =
    document.getElementById("goalTitle").value.trim();

  const category =
    document.getElementById("goalCategory").value;

  const measurable =
    document.getElementById("goalMeasure").value.trim();

  const achievable =
    document.getElementById("goalActions").value.trim();

  const relevant =
    document.getElementById("goalWhy").value.trim();

  const deadline =
    document.getElementById("goalDeadline").value;

  const progress =
    Number(document.getElementById("goalProgress").value);


  // ========================================
  // VALIDATION
  // ========================================

  if (title === "") {

    alert("Please enter your specific goal.");

    document.getElementById("goalTitle").focus();

    return;
  }

  if (measurable === "") {

    alert("Please enter how you will measure your goal.");

    document.getElementById("goalMeasure").focus();

    return;
  }

  if (achievable === "") {

    alert("Please enter the actions you will take.");

    document.getElementById("goalActions").focus();

    return;
  }

  if (relevant === "") {

    alert("Please explain why this goal is important.");

    document.getElementById("goalWhy").focus();

    return;
  }

  if (deadline === "") {

    alert("Please choose a deadline.");

    document.getElementById("goalDeadline").focus();

    return;
  }


  // ========================================
  // GET EXISTING GOALS
  // ========================================

  const goals = getGoals();


  // ========================================
  // CREATE NEW GOAL
  // ========================================

  const newGoal = {

    id: Date.now(),

    title: title,

    category: category,

    specific: title,

    measurable: measurable,

    achievable: achievable,

    relevant: relevant,

    timeBound: deadline,

    progress: progress,

    createdAt: new Date().toISOString()

  };


  // ========================================
  // SAVE GOAL
  // ========================================

  goals.unshift(newGoal);

  localStorage.setItem(
    "luckylife-goals",
    JSON.stringify(goals)
  );


  // ========================================
  // CLEAR FORM
  // ========================================

  document.getElementById("goalTitle").value = "";

  document.getElementById("goalMeasure").value = "";

  document.getElementById("goalActions").value = "";

  document.getElementById("goalWhy").value = "";

  document.getElementById("goalDeadline").value = "";

  document.getElementById("goalProgress").value = "0";

  document.getElementById("progressValue").textContent =
    "0% completed";


  // ========================================
  // REFRESH GOALS
  // ========================================

  loadGoals();

  alert("Your SMART Goal has been saved! 🎯🌿");

}


// ========================================
// LOAD GOALS
// ========================================

function loadGoals() {

  const grid =
    document.getElementById("goalGrid");

  if (!grid) {
    return;
  }


  const goals = getGoals();


  // Clear existing content

  grid.innerHTML = "";


  // ========================================
  // NO GOALS
  // ========================================

  if (goals.length === 0) {

    grid.innerHTML = `
      <div class="empty">
        <h3>No goals yet 🌿</h3>
        <p>
          Start by creating your first SMART goal.
        </p>
      </div>
    `;

    return;
  }


  // ========================================
  // DISPLAY GOALS
  // ========================================

  goals.forEach(function (goal) {

    const card =
      document.createElement("div");

    card.className = "goal-card";


    // Support old goals

    const specific =
      goal.specific || goal.title || "";

    const measurable =
      goal.measurable || "Not specified";

    const achievable =
      goal.achievable || "Not specified";

    const relevant =
      goal.relevant || "Not specified";

    const deadline =
      goal.timeBound ||
      goal.deadline ||
      "";

    const progress =
      Math.max(
        0,
        Math.min(
          100,
          Number(goal.progress) || 0
        )
      );


    // ========================================
    // CARD
    // ========================================

    card.innerHTML = `

      <div class="goal-category">
        ${escapeHTML(goal.category || "Personal")}
      </div>

      <h3>
        ${escapeHTML(goal.title || "Untitled Goal")}
      </h3>


      <div class="smart-details">

        <div class="smart-detail">

          <strong>🎯 Specific</strong>

          <p>
            ${escapeHTML(specific)}
          </p>

        </div>


        <div class="smart-detail">

          <strong>📊 Measurable</strong>

          <p>
            ${escapeHTML(measurable)}
          </p>

        </div>


        <div class="smart-detail">

          <strong>💪 Achievable</strong>

          <p>
            ${escapeHTML(achievable)}
          </p>

        </div>


        <div class="smart-detail">

          <strong>❤️ Relevant</strong>

          <p>
            ${escapeHTML(relevant)}
          </p>

        </div>


        <div class="smart-detail">

          <strong>📅 Time-Bound</strong>

          <p>
            ${formatDate(deadline)}
          </p>

        </div>

      </div>


      <div class="goal-progress">

        <div
          class="goal-fill"
          style="width: ${progress}%"
        ></div>

      </div>


      <div class="goal-percent">
        ${progress}% completed
      </div>


      <div class="goal-actions">

        <button
          type="button"
          class="progress-btn"
          onclick="updateGoalProgress(${goal.id})"
        >
          Update Progress
        </button>


        <button
          type="button"
          class="delete-btn"
          onclick="deleteGoal(${goal.id})"
        >
          Delete Goal
        </button>

      </div>

    `;


    grid.appendChild(card);

  });

}


// ========================================
// UPDATE PROGRESS
// ========================================

function updateGoalProgress(id) {

  const goals = getGoals();


  const goal =
    goals.find(function (item) {

      return item.id === id;

    });


  if (!goal) {
    return;
  }


  const currentProgress =
    Number(goal.progress) || 0;


  const newProgress =
    prompt(
      "Enter your new progress (0 - 100):",
      currentProgress
    );


  if (newProgress === null) {
    return;
  }


  const progressNumber =
    Number(newProgress);


  if (
    isNaN(progressNumber) ||
    progressNumber < 0 ||
    progressNumber > 100
  ) {

    alert(
      "Please enter a number between 0 and 100."
    );

    return;
  }


  goal.progress =
    Math.round(progressNumber);


  localStorage.setItem(
    "luckylife-goals",
    JSON.stringify(goals)
  );


  loadGoals();

}


// ========================================
// DELETE GOAL
// ========================================

function deleteGoal(id) {

  const goals = getGoals();


  const goal =
    goals.find(function (item) {

      return item.id === id;

    });


  if (!goal) {
    return;
  }


  const confirmed =
    confirm(
      'Delete "' +
      goal.title +
      '" from your goals?'
    );


  if (!confirmed) {
    return;
  }


  const updatedGoals =
    goals.filter(function (item) {

      return item.id !== id;

    });


  localStorage.setItem(
    "luckylife-goals",
    JSON.stringify(updatedGoals)
  );


  loadGoals();

}


// ========================================
// GET GOALS
// ========================================

function getGoals() {

  try {

    const saved =
      localStorage.getItem("luckylife-goals");


    if (!saved) {
      return [];
    }


    const goals =
      JSON.parse(saved);


    if (!Array.isArray(goals)) {
      return [];
    }


    return goals;

  } catch (error) {

    console.error(
      "Could not load goals:",
      error
    );

    return [];

  }

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateString) {

  if (!dateString) {
    return "No deadline";
  }


  const date =
    new Date(
      dateString + "T00:00:00"
    );


  if (isNaN(date.getTime())) {
    return "No deadline";
  }


  return date.toLocaleDateString(
    "en-CA",
    {
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );

}


// ========================================
// SECURITY
// ========================================

function escapeHTML(value) {

  const div =
    document.createElement("div");


  div.textContent =
    String(value ?? "");


  return div.innerHTML;

}