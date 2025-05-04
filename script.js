document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const tabs = document.querySelectorAll(".tab");

  const notStartedList = document.getElementById("notStartedList");
  const inProgressList = document.getElementById("inProgressList");
  const completedList = document.getElementById("completedList");

  const notStartedCount = document.getElementById("notStartedCount");
  const inProgressCount = document.getElementById("inProgressCount");
  const completedCount = document.getElementById("completedCount");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks(filter = "all") {
    notStartedList.innerHTML = "";
    inProgressList.innerHTML = "";
    completedList.innerHTML = "";

    let notStarted = 0;
    let inProgress = 0;
    let completed = 0;

    const filteredTasks =
      filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

    filteredTasks.forEach((task, index) => {
      const taskCard = document.createElement("div");
      taskCard.className = `task-card ${task.status}`;
      taskCard.innerHTML = `
                <div>${task.title}</div>
                <div style="font-size: 12px; color: #888;">
                    ${new Date(task.createdAt).toLocaleString()}
                </div>
                <div class="task-actions">
                    <button class="action-btn" onclick="changeStatus(${index}, 'not-started')"><i class="fas fa-circle-notch"></i></button>
                    <button class="action-btn" onclick="changeStatus(${index}, 'in-progress')"><i class="fas fa-spinner"></i></button>
                    <button class="action-btn" onclick="changeStatus(${index}, 'completed')"><i class="fas fa-check-circle"></i></button>
                    <button class="action-btn" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
                </div>
            `;

      if (task.status === "not-started") {
        notStarted++;
        notStartedList.appendChild(taskCard);
      } else if (task.status === "in-progress") {
        inProgress++;
        inProgressList.appendChild(taskCard);
      } else if (task.status === "completed") {
        completed++;
        completedList.appendChild(taskCard);
      }
    });

    notStartedCount.textContent = notStarted;
    inProgressCount.textContent = inProgress;
    completedCount.textContent = completed;

    if (notStarted === 0)
      notStartedList.innerHTML = getEmpty(
        "far fa-folder-open",
        "No tasks here yet"
      );
    if (inProgress === 0)
      inProgressList.innerHTML = getEmpty(
        "far fa-hourglass",
        "No tasks in progress"
      );
    if (completed === 0)
      completedList.innerHTML = getEmpty(
        "far fa-check-circle",
        "No completed tasks"
      );
  }

  function getEmpty(icon, message) {
    return `<div class="empty-state"><i class="${icon}"></i><p>${message}</p></div>`;
  }

  addTaskBtn.addEventListener("click", function () {
    const title = taskInput.value.trim();
    if (title) {
      tasks.push({
        title,
        status: "not-started",
        createdAt: new Date().toISOString(),
      });
      taskInput.value = "";
      saveTasks();
      renderTasks(getCurrentFilter());
    }
  });

  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTaskBtn.click();
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      renderTasks(this.dataset.status);
    });
  });

  window.changeStatus = function (index, status) {
    tasks[index].status = status;
    saveTasks();
    renderTasks(getCurrentFilter());
  };

  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(getCurrentFilter());
  };

  function getCurrentFilter() {
    const activeTab = document.querySelector(".tab.active");
    return activeTab ? activeTab.dataset.status : "all";
  }

  renderTasks(); // initial render
});
