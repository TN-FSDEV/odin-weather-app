import { groups } from "../initial.js";
import { taskDialogHTML, searchGroupSelect, setDefaultDate, restoreValue, submitTaskDialog, closeTaskDialog, confirmDeleteTaskDialog } from "./task-methods.js"

function createTaskDialog() {
    console.log("task dialog opened!")
    const dialog = document.createElement("dialog");
    taskDialogHTML(dialog, "create")
    const form = dialog.querySelector("form");
    setDefaultDate(form);
    searchGroupSelect(groups, dialog);
    submitTaskDialog(dialog, form);
    closeTaskDialog("", groups, dialog, "create");
    dialog.showModal();
}

function editTaskDialog(task) {
    const dialog = document.createElement("dialog");
    taskDialogHTML(dialog, "edit")
    const form = dialog.querySelector("form");
    searchGroupSelect(groups, dialog);
    restoreValue(task, groups, form);
    submitTaskDialog(dialog, form);
    closeTaskDialog(task, groups, dialog, "edit");

    dialog.showModal();
}

function deleteTaskDialog(task, group) {
    const dialog = document.createElement("dialog");
    confirmDeleteTaskDialog(dialog, task, group);

    dialog.showModal();
}

export { createTaskDialog, editTaskDialog, deleteTaskDialog };