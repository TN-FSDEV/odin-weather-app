import { signalDOM } from "./components/data-station.js";
import { updateTopUI } from "./components/update-top-UI.js";
//new import
import { createGroupDialog } from "./components/group-dialog.js";
import { createTaskDialog } from "./components/task-dialog.js";

const groups = [];

class Group {
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.id = name.trim().replace(/\s+/g, "-").toLowerCase();
    }
    addToGroup(task) {
        this.tasks.push(task);
    }
}

class Task {
    constructor(title, desc, date) {
        this.title = title;
        this.desc = desc;
        this.date = date;
    }
}

function initialize() {
    groups.length = 0;

    const saved = localStorage.getItem("todo-groups");
    if (saved) {
        const parsed = JSON.parse(saved);
        for (const g of parsed) {
            const group = new Group(g.name);
            g.tasks.forEach(t => group.addToGroup(new Task(t.title, t.desc, t.date)));
            groups.push(group);
        }
    } else {
        defaultMainGroup();
    }

    signalDOM(groups);

    setupMenu();

    setInterval(() => {
        if (document.visibilityState === "visible") {
            updateTopUI(groups);
        }
    }, 60 * 1000);
    console.log("initializing.... completed")
}

function defaultMainGroup() {
    const main = new Group("Main");
    groups.push(main);
    console.log("Default Main group is set!")
}

function setupMenu() {
    const createNewGroup = document.querySelector("#create-group");
    const createNewTask = document.querySelector("#create-task");

    createNewGroup.addEventListener("click", createGroupDialog);
    createNewTask.addEventListener("click", createTaskDialog);
    console.log("Menu is set!")
}

let currentGroupId = "main"; // default

function setCurrentGroup(id) {
    currentGroupId = id;
}

function getCurrentGroup() {
    return currentGroupId;
}

export { Group, Task, groups, initialize, setCurrentGroup, getCurrentGroup, setupMenu };

