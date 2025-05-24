import { groups } from "../initial.js";
import { groupDialogHTML, submitGroupDialog, closeGroupDialog, confirmDeleteGroupDialog } from "./group-methods.js"

function createGroupDialog() {
    console.log("group dialog opened!")
    const dialog = document.createElement("dialog");
    groupDialogHTML(dialog, "create")
    const form = dialog.querySelector("form");
    submitGroupDialog(dialog, form);
    closeGroupDialog(groups, dialog, "create");
    dialog.showModal();
}

function deleteGroupDialog(group) {
    const dialog = document.createElement("dialog");
    confirmDeleteGroupDialog(dialog, group);

    dialog.showModal();
}

export { createGroupDialog, deleteGroupDialog };