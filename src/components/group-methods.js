import { Group, groups } from "../initial.js";
import { updateState } from "./data-station.js";

function groupDialogHTML(dialog) {
    dialog.innerHTML = `
        <form method="dialog">
          <h2>New Project</h2>
          <input id="name" type="text" name="name" placeholder="Group Name" required />

          <div id="dialog-selection">
            <button type="submit">Create</button>
            <button value="cancel" formmethod="dialog" formnovalidate>Cancel</button>
          </div>
        </form>
      `;
    document.body.appendChild(dialog);
}

function submitGroupDialog(dialog, form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get("name");

        dialog.close(JSON.stringify({ name }))
    })
}

function closeGroupDialog(groups, dialog) {
    dialog.addEventListener('close', () => {
        const returnValue = dialog.returnValue;
        try {
            const result = JSON.parse(returnValue);
            if (result.name) {
                const newGroup = new Group(result.name);
                groups.push(newGroup);

                updateState(groups);
            }
        } catch (e) {
            // Ignore cancel or invalid returnValue (e.g., user clicked X)
        }
        dialog.remove();
    });
}

function confirmDeleteGroupDialog(dialog, group) {
    dialog.innerHTML = `
        <form method="dialog">
          <h2>Confirm Delete Group?</h2>
          <div id="dialog-selection">
            <button id="confirm-btn" value="confirm">Confirm</button>
            <button id="cancel-btn" value="cancel" formmethod="dialog" formnovalidate>Cancel</button>
          </div>
        </form>
      `;
    document.body.appendChild(dialog);

    dialog.addEventListener("close", () => {
        if (dialog.returnValue === "confirm") {
            // Remove the group from the global groups array
            const index = groups.indexOf(group);
            if (index !== -1) {
                groups.splice(index, 1);
            }
            updateState(groups);
        }

        dialog.remove();
    });
}

export { groupDialogHTML, submitGroupDialog, closeGroupDialog, confirmDeleteGroupDialog };