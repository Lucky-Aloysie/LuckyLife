// ========================================
// LuckyLife 🌿
// Complete App Script
// Dashboard + Planner + Goals + Memories
// ========================================


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    const dateElement = document.getElementById("todayDate");

    if (dateElement) {

        const today = new Date();

        dateElement.textContent = today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    }


    const progressNumber =
        document.getElementById("progressNumber");

    if (!progressNumber) {
        return;
    }


    const today =
        new Date().toISOString().split("T")[0];


    const saved =
        JSON.parse(
            localStorage.getItem("luckylife-" + today) || "[]"
        );


    const completed =
        saved.filter(task => task.completed).length;


    const total =
        saved.length;


    const percent =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    progressNumber.textContent =
        percent + "%";


    const progressText =
        document.getElementById("progressText");

    if (progressText) {

        progressText.textContent =
            `${completed} of ${total} tasks completed`;

    }


    const progressFill =
        document.getElementById("progressFill");

    if (progressFill) {

        progressFill.style.width =
            percent + "%";

    }


    const nextTask =
        saved
            .filter(task => !task.completed)
            .sort((a, b) =>
                a.time.localeCompare(b.time)
            )[0];


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
                nextTask.time;
        }

    } else {

        if (nextTaskElement) {
            nextTaskElement.textContent =
                "Nothing planned 🌿";
        }

        if (nextTimeElement) {
            nextTimeElement.textContent =
                "Enjoy your day";
        }

    }

}



// ========================================
// PLANNER
// ========================================

let tasks = [];

let currentDate = "";


const plannerDate =
    document.getElementById("planner-date");


if (plannerDate) {

    currentDate =
        new Date().toISOString().split("T")[0];


    plannerDate.value =
        currentDate;


    loadTasks();


    plannerDate.addEventListener("change", function () {

        currentDate =
            plannerDate.value;

        loadTasks();

    });

}


function addTask() {

    const time =
        document.getElementById("task-time");

    const name =
        document.getElementById("task-name");


    if (!time || !name) {
        return;
    }


    if (
        time.value === "" ||
        name.value.trim() === ""
    ) {

        alert(
            "Please enter both a time and a task."
        );

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


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (tasks.length === 0) {

        list.innerHTML = `
            <div class="empty">
                No tasks yet 🌿
            </div>
        `;

        return;
    }


    tasks.forEach(function (task) {

        const div =
            document.createElement("div");


        div.className =
            task.completed
                ? "task done"
                : "task";


        div.innerHTML = `

            <div class="task-info">

                <div class="task-time">
                    ${task.time}
                </div>

                <div class="task-name">
                    ${task.name}
                </div>

            </div>

            <div style="display:flex;gap:8px;">

                <button
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "↩️" : "✓"}
                </button>

                <button
                    onclick="deleteTask(${task.id})">
                    🗑
                </button>

            </div>

        `;


        list.appendChild(div);

    });

}


function toggleTask(id) {

    tasks =
        tasks.map(function (task) {

            if (task.id === id) {

                task.completed =
                    !task.completed;

            }

            return task;

        });


    saveTasks();

    displayTasks();

    updateDashboard();

}


function deleteTask(id) {

    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

    updateDashboard();

}


function saveTasks() {

    if (!currentDate) {
        return;
    }


    localStorage.setItem(

        "luckylife-" + currentDate,

        JSON.stringify(tasks)

    );

}


function loadTasks() {

    if (!currentDate) {
        return;
    }


    const saved =
        localStorage.getItem(
            "luckylife-" + currentDate
        );


    tasks =
        saved
            ? JSON.parse(saved)
            : [];


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


    if (!title || !category || !progress) {
        return;
    }


    if (title.value.trim() === "") {

        alert("Please enter a goal.");

        return;
    }


    const goals =
        JSON.parse(
            localStorage.getItem(
                "luckylife-goals"
            ) || "[]"
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


    if (!grid) {
        return;
    }


    const goals =
        JSON.parse(
            localStorage.getItem(
                "luckylife-goals"
            ) || "[]"
        );


    grid.innerHTML = "";


    if (goals.length === 0) {

        grid.innerHTML = `
            <div class="empty">
                No goals yet 🌿
            </div>
        `;

        return;
    }


    goals.forEach(function (goal) {

        const card =
            document.createElement("div");


        card.className =
            "goal-card";


        card.innerHTML = `

            <div class="goal-category">
                ${goal.category}
            </div>

            <h3>
                ${goal.title}
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

    const goals =
        JSON.parse(
            localStorage.getItem(
                "luckylife-goals"
            ) || "[]"
        );


    const updated =
        goals.filter(function (goal) {

            return goal.id !== id;

        });


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


const memoryImage =
    document.getElementById("memoryImage");


if (memoryImage) {

    loadMemories();


    memoryImage.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    selectedMemoryImage =
                        event.target.result;

                };


            reader.readAsDataURL(file);

        }
    );

}


function saveMemory() {

    const title =
        document.getElementById("memoryTitle");

    const date =
        document.getElementById("memoryDate");

    const story =
        document.getElementById("memoryStory");


    if (!title || !date || !story) {
        return;
    }


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


    const memories =
        JSON.parse(
            localStorage.getItem(
                "luckylife-memories"
            ) || "[]"
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

    memoryImage.value = "";

    selectedMemoryImage = "";


    loadMemories();

}


function loadMemories() {

    const grid =
        document.getElementById("memoryGrid");


    if (!grid) {
        return;
    }


    const memories =
        JSON.parse(
            localStorage.getItem(
                "luckylife-memories"
            ) || "[]"
        );


    grid.innerHTML = "";


    if (memories.length === 0) {

        grid.innerHTML = `
            <div class="empty">
                No memories yet 🤍
            </div>
        `;

        return;
    }


    memories.forEach(function (memory) {

        const card =
            document.createElement("div");


        card.className =
            "memory-card";


        card.innerHTML = `

            <img
                src="${memory.image}"
                alt="${memory.title}">

            <div class="memory-content">

                <div class="memory-date">
                    ${memory.date}
                </div>

                <h3>
                    ${memory.title}
                </h3>

                <p class="memory-story">
                    ${memory.story}
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

    const memories =
        JSON.parse(
            localStorage.getItem(
                "luckylife-memories"
            ) || "[]"
        );


    const updated =
        memories.filter(function (memory) {

            return memory.id !== id;

        });


    localStorage.setItem(

        "luckylife-memories",

        JSON.stringify(updated)

    );


    loadMemories();

}



// ========================================
// START LUCKYLIFE
// ========================================

updateDashboard();

loadGoals();

loadMemories();