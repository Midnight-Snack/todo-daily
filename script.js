// Retrieve todo and streak from local storage or initialize
let todo = JSON.parse(localStorage.getItem("todo")) || [];
let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastCompletionDate = localStorage.getItem("lastCompletionDate") || '';
const philippinesTimeZone = "Asia/Manila";
const resetHour = 0; // 12 AM in 24-hour format

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const streakCount = document.getElementById("streakCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
//8/18/2024 2 days streak chck 8/19/2024 for third day streak 
// Initialize
document.addEventListener("DOMContentLoaded", function() {
    addButton.addEventListener("click", addTask);
    todoInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
    deleteButton.addEventListener("click", deleteAllTasks);
    displayTasks();
    checkAndUpdateStreak(); // Check and update streak when the page loads
    displayStreak(); // Display streak when the page loads
});

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") { // if there is text
        todo.push({
            text: newTask,
            disabled: false,
        });
        saveToLocalStorage();
        todoInput.value = "";
        displayTasks();
    }
}

function deleteAllTasks() {
    todo = []; // Clearing the task list
    saveToLocalStorage();
    displayTasks();
}

function deleteTask(index) {
    todo.splice(index, 1); // Remove the task from the array
    saveToLocalStorage();  // Save the updated array to local storage
    displayTasks();        // Refresh the task display
}

function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
        <div class="todo-container">
            <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
            <span class="todo-text ${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">${item.text}</span>
            <button class="todo-delete-btn" onclick="deleteTask(${index})">Delete</button>
        </div>
    
        `;
        p.querySelector(".todo-checkbox").addEventListener("change", () =>
            toggleTask(index)
        );
        todoList.appendChild(p);
    });
    todoCount.textContent = todo.length;
    checkAndUpdateStreak(); 
}

function deleteTask(index) {
    todo.splice(index, 1); 
    saveToLocalStorage();
    displayTasks(); 
}

function editTask(index) {
    const todoItem = document.getElementById(`todo-${index}`);
    const existingText = todo[index].text;
    const inputElement = document.createElement("input");

    inputElement.value = existingText;
    todoItem.replaceWith(inputElement);
    inputElement.focus();

    inputElement.addEventListener("blur", function () {
        const updatedText = inputElement.value.trim();
        if (updatedText) {
            todo[index].text = updatedText;
            saveToLocalStorage();
        }
        displayTasks();
    });
}

function toggleTask(index) {
    todo[index].disabled = !todo[index].disabled;
    saveToLocalStorage();
    displayTasks();
}

function checkAndUpdateStreak() {
    const allCompleted = todo.every(task => task.disabled);
    const now = new Date();
    const nowPhilippinesTime = new Date(now.toLocaleString("en-US", { timeZone: philippinesTimeZone }));
    const todayDate = nowPhilippinesTime.toISOString().split('T')[0];

    // Check if it is a new day in the Philippines time zone
    const isNewDay = (lastCompletionDate && lastCompletionDate !== todayDate);

    if (isNewDay) {
        if (allCompleted) {
            // All tasks were completed yesterday before reset time
            streak++;
        } else {
            // Not all tasks were completed before reset time
            streak = 0;
        }
        lastCompletionDate = todayDate;
        saveToLocalStorage();
    }
}

function displayStreak() {
    streakCount.textContent = `${streak} `; //displaying the streak
}

function saveToLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todo));
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastCompletionDate", lastCompletionDate);
}


