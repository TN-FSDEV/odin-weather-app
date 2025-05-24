import { updateGroupNav } from "./update-group-nav.js";
import { updateGroupTasks } from "./update-group-tasks.js";
import { updateTopUI } from "./update-top-UI.js";
import { getCurrentGroup, setupMenu } from "../initial.js";

function updateState(groups) {
    saveToLocal(groups);
    signalDOM(groups);
}

function saveToLocal(groups) {
    localStorage.setItem("todo-groups", JSON.stringify(groups));
}

function signalDOM(groups) {
    resetHTML();
    setupMenu();
    updateGroupNav(groups);
    updateGroupTasks(groups, getCurrentGroup());
    updateTopUI(groups);
    console.log("DOM updated!");
}

function resetHTML() {
    const body = document.querySelector("body");
    body.innerHTML = `
    <div id="menu-sidebar">
        <div>Some logo</div>
        <button id="create-group">New Group</button>
        <button id="create-task">New Task</button>
    </div>
    <div id="main-body">
        <div id="top">
            <div id="late" class="top-ui"></div>
            <div id="soon" class="top-ui"></div>
        </div>
        <div id="content">
            <div id="group-nav"></div>
            <div id="task-group"></div>
        </div>
    </div>
    `
}

export { signalDOM, updateState };