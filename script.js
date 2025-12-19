const subjectInput = document.getElementById("subject");
const taskTextInput = document.getElementById("taskText");
const addBtn = document.getElementById("addBtn");
const tasksList = document.getElementById("tasksList");
const emptyMessage = document.getElementById("emptyMessage");
const summaryText = document.getElementById("summaryText");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

// Load from localStorage
function loadTasks() {
  const saved = localStorage.getItem("studentTasks");
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function renderTasks() {
  tasksList.innerHTML = "";

  let visibleTasks = tasks;
  if (currentFilter === "active") {
    visibleTasks = tasks.filter((t) => !t.done);
  } else if (currentFilter === "done") {
    visibleTasks = tasks.filter((t) => t.done);
  }

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.done) li.classList.add("done");
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${
        task.done ? "checked" : ""
      } />
      <div class="task-content">
        <div class="task-subject">${task.subject || "General"}</div>
        <div class="task-text">${task.text}</div>
      </div>
      <button class="task-delete">✕</button>
    `;

    tasksList.appendChild(li);
  });

  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const active = total - done;
  summaryText.textContent = `${total} tasks total · ${active} active · ${done} done`;
}

function addTask() {
  const subject = subjectInput.value.trim();
  const text = taskTextInput.value.trim();

  if (!text) {
    taskTextInput.focus();
    return;
  }

  const newTask = {
    id: Date.now(),
    subject,
    text,
    done: false,
  };

  tasks.unshift(newTask); // nouvelle tâche en haut
  saveTasks();
  renderTasks();

  taskTextInput.value = "";
  taskTextInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function handleListClick(e) {
  const li = e.target.closest(".task-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.classList.contains("task-checkbox")) {
    toggleTask(id);
  } else if (e.target.classList.contains("task-delete")) {
    deleteTask(id);
  }
}

function handleFilterClick(e) {
  const btn = e.target;
  const filter = btn.dataset.filter;
  if (!filter) return;

  currentFilter = filter;
  filterButtons.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderTasks();
}

// Event listeners
addBtn.addEventListener("click", addTask);
taskTextInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});
tasksList.addEventListener("click", handleListClick);
filterButtons.forEach((btn) =>
  btn.addEventListener("click", handleFilterClick)
);

// Init
loadTasks();
renderTasks();
