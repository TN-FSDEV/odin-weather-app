import { Task, groups } from "../initial.js";
import { updateState } from "./data-station.js";

function taskDialogHTML(dialog, action) {
    const taskTitle = (action === "create") ? "New Task" : "Edit Task";
    const submitBtn = (action === "create") ? "Create" : "Save Changes";
    dialog.innerHTML = `
        <form method="dialog">
          <h2>${taskTitle}</h2>
          <label for="title">Title</label>
          <input id="title" type="text" name="title" required />
          <label for="desc">Description</label>
          <textarea id="desc" name="desc" rows="2"></textarea>
          <label for="date">Date</label>
          <input id="date" type="date" name="date" required />
          <label for="group">Group</label>
          <select name="group" id="group">
            <option value="opt-main" id="opt-main" selected>Main</option>
          </select>
          <div id="dialog-selection">
            <button type="submit">${submitBtn}</button>
            <button id="cancel-btn" value="cancel" formmethod="dialog" formnovalidate>Cancel</button>
          </div>
        </form>
      `;
    document.body.appendChild(dialog);
}

function setDefaultDate(form) {
    const today = new Date().toISOString().split("T")[0];
    const dateInput = form.querySelector("#date");
    dateInput.value = today;
    dateInput.min = today;
}

function searchGroupSelect(groups, dialog) {
    const select = dialog.querySelector("#group");
    for (let i = 1; i < groups.length; i++) {
        const option = document.createElement("option")
        option.id = option.value = "opt-" + groups[i].id;
        option.textContent = groups[i].name;
        select.appendChild(option);
    }
}

function restoreValue(task, groups, form) {
    const taskGroup = groups.find(group =>
        Array.isArray(group.tasks) &&
        group.tasks.includes(task)
    );
    const taskGroupID = "opt-" + taskGroup.id;
    form.querySelector("#title").value = task.title;
    form.querySelector("#desc").value = task.desc;
    form.querySelector("#date").value = task.date;
    form.querySelector("#group").value = taskGroupID;
}

function submitTaskDialog(dialog, form) {
    form.addEventListener("submit", (event) => {
        const isCancel = document.activeElement.id === "cancel-btn";
        if (isCancel) return;

        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get("title");
        const desc = formData.get("desc");
        const date = formData.get("date");
        const group = formData.get("group");

        dialog.close(JSON.stringify({ title, desc, date, group }))
    })
}

function closeTaskDialog(task, groups, dialog, action) {
    (action === "create") ? signalNewTaskCreate(groups, dialog) : signalNewTaskChanges(task, groups, dialog);
}

function signalNewTaskCreate(groups, dialog) {
    dialog.addEventListener('close', () => {
        try {
            const result = JSON.parse(dialog.returnValue);
            const groupId = result.group.replace(/^opt-/, "").toLowerCase();
            const selectedGroup = groups.find(g => g.id === groupId);

            if (result) {
                const task = new Task(result.title, result.desc, result.date);
                selectedGroup.addToGroup(task);

                updateState(groups);
            }
        } catch (e) {
            // Ignore cancel or invalid returnValue (e.g., user clicked X)
        }
        dialog.remove();
    });
}

function signalNewTaskChanges(task, groups, dialog) {
    dialog.addEventListener("close", () => {
        try {
            const result = JSON.parse(dialog.returnValue);
            const groupId = result.group.replace(/^opt-/, "").toLowerCase();
            const selectedGroup = groups.find(g => g.id === groupId);

            const originalGroup = groups.find(g => Array.isArray(g.tasks) && g.tasks.includes(task));

            if (result) {
                task.title = result.title;
                task.desc = result.desc;
                task.date = result.date;

                if (originalGroup && selectedGroup && originalGroup !== selectedGroup) {
                    originalGroup.tasks = originalGroup.tasks.filter(t => t !== task);
                    selectedGroup.addToGroup(task);
                }

                updateState(groups);
            }
        } catch (e) {
            // User cancelled or closed dialog
        }
        dialog.remove();
    });
}

function confirmDeleteTaskDialog(dialog, task, group) {
    dialog.innerHTML = `
        <form method="dialog">
          <h2>Confirm Delete Task?</h2>
          <div id="dialog-selection">
            <button id="confirm-btn" value="confirm">Confirm</button>
            <button id="cancel-btn" value="cancel" formmethod="dialog" formnovalidate>Cancel</button>
          </div>
        </form>
      `;
    document.body.appendChild(dialog);

    dialog.addEventListener("close", () => {
        if (dialog.returnValue === "confirm") {
            const index = group.tasks.indexOf(task);
            if (index !== -1) {
                group.tasks.splice(index, 1);
            }
            updateState(groups);
        }

        dialog.remove();
    });
}

export { taskDialogHTML, searchGroupSelect, setDefaultDate, restoreValue, submitTaskDialog, closeTaskDialog, confirmDeleteTaskDialog };