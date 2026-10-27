$(function () {
  let nextId = 1;
  let tasks = [];

  function updateTaskCount() {
    const remaining = tasks.filter(task => !task.completed).length;
    $("#taskCount").text(tasks.length + (tasks.length === 1 ? " task" : " tasks"));
    $("#progressText").text(tasks.length === 0 ? "You’ve got this." :
      remaining === 0 ? "Everything is complete. Amazing!" :
      remaining + (remaining === 1 ? " task left to go." : " tasks left to go."));
    $("#emptyState").toggle(tasks.length === 0);
    $("#clearCompleted").toggle(tasks.some(task => task.completed));
  }

  function renderTasks() {
    const $list = $("#taskList").empty();
    tasks.forEach(function (task) {
      const $item = $("<li>").addClass("task-item");
      if (task.completed) $item.addClass("completed");

      const $check = $("<button>", {
        type: "button",
        class: "check-button",
        "aria-label": task.completed ? "Mark task as incomplete" : "Mark task as complete"
      }).text(task.completed ? "✓" : "");
      $check.on("click", function () {
        task.completed = !task.completed;
        renderTasks();
      });

      const $text = $("<span>").addClass("task-text").text(task.text);
      const $delete = $("<button>", {
        type: "button", class: "delete-button", "aria-label": "Delete task"
      }).text("×");
      $delete.on("click", function () {
        tasks = tasks.filter(item => item.id !== task.id);
        renderTasks();
      });

      $item.append($check, $text, $delete);
      $list.append($item);
    });
    updateTaskCount();
  }

  $("#taskForm").on("submit", function (event) {
    event.preventDefault();
    const text = $("#taskInput").val().trim();
    if (!text) {
      $("#errorMessage").text("Please enter a task first.");
      $("#taskInput").trigger("focus");
      return;
    }
    tasks.push({ id: nextId++, text: text, completed: false });
    $("#taskInput").val("");
    $("#errorMessage").text("");
    renderTasks();
    $("#taskInput").trigger("focus");
  });

  $("#taskInput").on("input", function () {
    $("#errorMessage").text("");
  });

  $("#clearCompleted").on("click", function () {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
  });

  renderTasks();
});
