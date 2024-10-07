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
    checkAndUpdateStreak(); 
    displayStreak(); 
});

function addTask() {
    const newTask = todoInput.value.trim();
    if (newTask !== "") { 
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
    todo.splice(index, 1); 
    saveToLocalStorage();  
    displayTasks();        
}

function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
        <div class="todo-container" data-index="${index}">
            <input type="checkbox" class="todo-checkbox" id="input-${index}" ${item.disabled ? "checked" : ""}>
            <span class="todo-text ${item.disabled ? "disabled" : ""}" onclick="editTask(${index})">${item.text}</span>
            <button class="todo-timer-btn" onclick="setTimer(${index})">Timer</button>
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
    let taskTextElement = document.querySelector(`#todoList .todo-container[data-index="${index}"] .todo-text`);
    let currentText = taskTextElement.textContent;

    let input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.classList.add('todo-edit-input');

    taskTextElement.innerHTML = '';
    taskTextElement.appendChild(input);

    input.focus();

    input.addEventListener('blur', function() {
        saveEditedTask(index, input.value);
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveEditedTask(index, input.value);
        }
    });
}

function saveEditedTask(index, newText) {
    if (newText.trim() !== "") { 
        todo[index].text = newText.trim(); 
        saveToLocalStorage(); 
        displayTasks(); 
    }
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

function setTimer(index) {
    let timeInMinutes = prompt("Enter the timer in minutes:");

    if (timeInMinutes && !isNaN(timeInMinutes)) {
        let timeInSeconds = timeInMinutes * 60; // Convert minutes to seconds
        let timerBtn = document.querySelector(`#todoList .todo-container[data-index="${index}"] .todo-timer-btn`);
        timerBtn.disabled = true;
        let remainingTime = timeInSeconds;
        let start = Date.now();
        let end = start + timeInSeconds * 1000;

        function updateTimer() {
            let now = Date.now();
            remainingTime = Math.ceil((end - now) / 1000);

            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;

            // Update the button text with the remaining time
            timerBtn.textContent = `${minutes}m ${seconds}s`;

            if (remainingTime <= 0) {
                timerBtn.textContent = "Timer";
                timerBtn.disabled = false;

                // Play the sound
                const timerSound = document.getElementById("timerSound");
                timerSound.play();
            } else {
                setTimeout(updateTimer, 1000); // Schedule the next update
            }
        }

        updateTimer();
    }
}





