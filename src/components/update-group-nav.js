import { deleteGroupDialog } from "./group-dialog.js";
import { updateGroupTasks } from "./update-group-tasks.js";
import { setCurrentGroup } from "../initial.js";

export function updateGroupNav(groups) {
    const nav = document.getElementById("group-nav");
    nav.innerHTML = "";

    for (const group of groups) {
        const entry = document.createElement("div");
        entry.className = "group-entry";

        const label = document.createElement("h3");
        label.textContent = group.name;

        entry.addEventListener("click", () => {
            setCurrentGroup(group.id);
            updateGroupTasks(groups, group.id);
        });

        entry.appendChild(label);

        if (group.name !== "Main") {
            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.addEventListener("click", () => { deleteGroupDialog(group) });
            entry.appendChild(delBtn);
        }

        nav.appendChild(entry);
    }
}


