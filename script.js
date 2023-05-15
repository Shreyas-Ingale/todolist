// used 'sessionStorage' instead of 'localStorage' since the later isnt compatible with Github Pages
const taskInput = document.querySelector(".input-section input"), //input field
    filters = document.querySelectorAll(".filters span"), // filter(all, pending, completed)
    clearAll = document.querySelector(".clear-btn"), // clear all button
    taskList = document.querySelector(".task-list"), // ul tag task list
    addButton = document.querySelector("#add-icon"), // add button
    themeButton = document.querySelector("#theme-btn"); //theme switcher

let editId, // identify which li item is clicked for edit
    isLight = true, // is the theme light
    isEditTask = false, //is the text in input field for edit 
    todos = JSON.parse(sessionStorage.getItem("todo-list")); // get the todos stored in sessionStorage

// toggle between light and dark theme 
themeButton.addEventListener('click', () => {
    const root = document.querySelector(':root');
    const themeIcon = document.querySelector('.theme-switcher i');
    if (isLight) { //if theme is light on button press change it to black
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        root.style.setProperty('--theme', '#202124');
        root.style.setProperty('--theme-font', '#e8eaed');
        console.log("dark");
        isLight = false;
    } else {  //if theme is dark on button press change it to light
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        root.style.setProperty('--theme', '#bebebe');
        root.style.setProperty('--theme-font', '#1f2937');
        console.log("light");
        isLight = true;
    }
});

// make the current filter active 
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

// render the todos
function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            if (filter == todo.status || filter == "all") { // make the li tags
                liTag += `<li class="tasklist-item" onclick="updateStatus(this)">
                             <input type="checkbox" title="checkbox" id="${id}">
                             <span class="task">${todo.name}</span>
                             <span class="settings">
                                 <i onclick='editTask(${id}, "${todo.name}",this); event.stopPropagation();' class="fa-solid fa-pen-to-square"></i>
                                 <i onclick='deleteTask(${id}, "${filter}"); event.stopPropagation();' class="fa-solid fa-trash-can"></i>
                             </span>
                         </li>`;
            }
        });
    }
    // if todos/tasks exist append them to tasklist/ul tsg or display no task here
    taskList.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskList.querySelectorAll(".tasklist-item");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active"); // is tasks exist make clear all button active
    if (checkTask && todos) { // is todos exist make them appear as their state ie. either completed(checked) or pending/all (unchecked) 
        todos.forEach((todo, id) => {
            if (todo.status == "completed") {
                const checkbox = document.getElementById(id);
                if (checkbox != null) {
                    checkbox.checked = true;
                }
            }
        });
    }
    updateNumbers(); //update stats
}
showTodo("all");

// update the stats of pending and completed tasks
function updateNumbers() {
    if (todos) {
        const pendingTasksNumb = document.querySelector(".pending-tasks"); // update the pending tasks count
        let pendingTasks = todos.filter(todo => {
            return todo.status == 'pending';
        });
        pendingTasksNumb.textContent = pendingTasks.length;
        const completedTasksNumb = document.querySelector(".completed-tasks");  // update the completed tasks count
        let completedTasks = todos.filter(todo => {
            return todo.status == 'completed';
        });
        completedTasksNumb.textContent = completedTasks.length;
    }
}

// for checking and unchecking the tasks/todos by clicking on the whole li tag 
function updateStatus(e) {
    // console.log(e);
    const checkbox = e.querySelector("input"); //getting checkbox
    if (checkbox.checked) { // if the checkbox is unchecked then mark the task as pending
        checkbox.checked = false;
        todos[checkbox.id].status = "pending";
    } else { // if the checkbox is checked then mark the task as completed
        checkbox.checked = true;
        todos[checkbox.id].status = "completed";
    }
    sessionStorage.setItem("todo-list", JSON.stringify(todos)) // update the sessionStorage
    updateNumbers(); // update the stats
}

// edit the selected task
function editTask(taskId, textName, e) {
    console.log(e);
    editId = taskId; // task which is to be edited
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active"); // make the add button and input field active
    addButton.classList.add("active");
    updateNumbers(); // update the stats
}

// delete the selected task
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);// delete selected task
    sessionStorage.setItem("todo-list", JSON.stringify(todos)); // upadte sessionStorage
    showTodo(filter); //render the updated list
    console.log("ID : " + deleteId);
}

// clear all tasks
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length); // empty the list
    sessionStorage.setItem("todo-list", JSON.stringify(todos)); // upadte the sessionStorage
    showTodo() //render the empty list
});

// add button functionality
addButton.addEventListener("click", e => {
    let userTask = taskInput.value.trim(); // to make sure that task written isnt only spaces 
    if (userTask) {
        if (!isEditTask) { // not an edit operation but an appending one
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else { // edit operation
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        addButton.classList.remove("active"); // deactivate the add button after a task is added 
        sessionStorage.setItem("todo-list", JSON.stringify(todos));// store the todo in sessionStorage
        showTodo(document.querySelector("span.active").id); //show todos with current filter
    }
});

// add the tasks by pressing enter
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim(); // to make sure that task written isnt only spaces 
    if (userTask) { //if a valid task exist make the add button active
        addButton.classList.add("active");
    }
    else {
        addButton.classList.remove("active");
    }
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) { // not an edit operation but an appending one
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else { // edit operation
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        addButton.classList.remove("active"); // deactivate the add button after a task is added
        sessionStorage.setItem("todo-list", JSON.stringify(todos)); // store the todo in sessionStorage
        showTodo(document.querySelector("span.active").id); //show todos with current filter
    }
});