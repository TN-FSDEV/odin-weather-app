import { parseISO, isBefore, isWithinInterval, addDays } from "date-fns";

export function updateTopUI(groups) {
    const late = document.getElementById("late");
    const soon = document.getElementById("soon");
    [late, soon].forEach(element => element.addEventListener("click", () => {
        if (element.classList.contains("expanded")) {
            element.classList.remove("expanded");
        } else {
            element.classList.add("expanded");
        }
    }))
    late.innerHTML = "";
    soon.innerHTML = "";

    const now = new Date();

    for (const group of groups) {
        for (const task of group.tasks || []) {
            const taskDate = parseISO(task.date);
            const taskEl = document.createElement("div");
            taskEl.className = "top-task";
            taskEl.innerHTML = `
                <strong>${task.title}</strong> (${group.name})<br/>
                ${task.desc}<br/>
                Due: ${task.date}
            `;

            if (isBefore(taskDate, now)) {
                late.appendChild(taskEl);
            } else if (isWithinInterval(taskDate, { start: now, end: addDays(now, 2) })) {
                soon.appendChild(taskEl);
            }
        }
    }
}
