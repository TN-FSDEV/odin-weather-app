import { editTaskDialog, deleteTaskDialog } from "./task-dialog.js";

export function updateGroupTasks(groups, selectedGroupID) {
    const container = document.getElementById("task-group");
    container.innerHTML = "";

    const group = groups.find(g => g.id === selectedGroupID);
    if (!group) return;

    for (const task of group.tasks || []) {
        const taskBox = document.createElement("div");
        taskBox.className = "task-box";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const desc = document.createElement("p");
        desc.textContent = task.desc;

        const due = document.createElement("p");
        due.textContent = `Due: ${task.date}`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editTaskDialog(task));

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => deleteTaskDialog(task, group));

        taskBox.append(title, desc, due, editBtn, delBtn);
        container.appendChild(taskBox);
    }
}
