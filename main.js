const addButton = document.querySelector(".addButton");
const inputEle = document.querySelector("#taskInput");
const taskContainer = document.querySelector(".innerContainer");
const updateBtn = document.querySelector(".updateButton");

// Creating Random ID for tasks
const randomId = function(length = 8) {
    return Math.random().toString(36).substring(2, length+2);
  };

let dataArray = [];
let currentTask = null;

document.addEventListener('DOMContentLoaded', loadContent);
addButton.addEventListener('click', handleAddButton);
updateBtn.addEventListener('click', handleUpdateButton);

// Triggering Buttons on pressing ENTER
inputEle.addEventListener('keypress', (event) => {
    if (event.key === "Enter" && addButton.classList.contains("hidden")) {
        event.preventDefault();
        updateBtn.click();
    }
    else if (event.key === "Enter" && updateBtn.classList.contains("hidden")) {
        event.preventDefault();
        addButton.click();
    }
});

// options for formatting date and time
let options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
}

function loadContent() {
    dataArray = JSON.parse(localStorage.getItem("tasks")) || [];

    dataArray.forEach((tas) => {
        const taskData = {
            id: tas.id,
            title: tas.title,
            timeOfCreation: tas.timeOfCreation,
            checked: tas.checked
        }
        createCard(taskData);
        
    });

}

function createCard(taskData) {
    //Creating Card and task div
    const card = document.createElement('div');
    const taskDiv = document.createElement('div');
    const task = document.createElement('p');

    // creating a button div and buttons to add in it
    const buttons = document.createElement('div');
    const checkButton = document.createElement('input');
    const editButton = document.createElement('button');
    const delButton = document.createElement('button');
    const spanDate = document.createElement('p');

    // Adding Classes to above created divs
    card.classList.add('bg-dark-grey', 'mt-4', 'card');
    taskDiv.classList.add('taskDiv');
    spanDate.classList.add('spanDate');


    // Adding some properties to the buttons
    editButton.innerHTML = "Edit";
    delButton.innerHTML = "Delete";
    checkButton.type = "checkbox";
    checkButton.name = "checkbox";

    editButton.classList.add('editButton', 'btn', 'btn-primary');
    delButton.classList.add('delButton', 'btn', 'btn-danger');
    buttons.classList.add("cardRight");

    // Setting the value of task
    task.innerHTML = taskData.title;
    let formattedDateUS = taskData.timeOfCreation;

// Applying checked state
if (taskData.checked) {
    task.classList.add('checked');
    checkButton.checked = true;
    editButton.disabled = true;
} else {
    task.classList.remove('checked');
    checkButton.checked = false;
    editButton.disabled = false;
}

    // Adding some properties to the buttons
    editButton.innerHTML = "Edit";
    delButton.innerHTML = "Delete";
    checkButton.type = "checkbox";
    checkButton.name = "checkbox";
    editButton.classList.add('editButton', 'btn', 'btn-primary');
    delButton.classList.add('delButton', 'btn', 'btn-danger');
    buttons.classList.add("cardRight");

    // Appending elements
    taskDiv.append(task);
    card.append(taskDiv);
    buttons.append(editButton, delButton, checkButton);
    spanDate.append(formattedDateUS);
    card.append(spanDate);
    card.append(buttons);
    taskContainer.append(card);

    // Setting event Listeners on buttons to handel the functionality
    delButton.addEventListener('click', () => {
        dataArray = dataArray.filter(tas => {
            return tas.id !== taskData.id;
        });
        console.log(dataArray);
        localStorage.setItem('tasks', JSON.stringify(dataArray));
        card.remove();
    })

    //Edit Button
    editButton.addEventListener('click', () => { editTask(taskData) });

    //CheckBox Creation
    checkButton.addEventListener('change',() =>{
        let check = handleCheckbox(taskData,checkButton);
        if(check){
            task.classList.add('checked');
            editButton.disabled = true;
            console.log(check);
        }
        else{
            task.classList.remove('checked');
            editButton.disabled = false;
            console.log(check);
        }
    });

   
}

// Handles Click On Add Button
function handleAddButton() {

    // checking if the input contains any value or is empty
    if (inputEle.value !== '') {

        // Setting the value of task
        taskTitle = inputEle.value.trim();
        
        // Task Data 
        const taskData = {
            id: randomId(),
            title: taskTitle,
            timeOfCreation: timeCreator(),
            checked: false
        }
        // Adding Data To Array
        dataArray.push(taskData);

        localStorage.setItem("tasks", JSON.stringify(dataArray));
        //creating Card
        createCard(taskData);
        // Reseting the input box
        inputEle.value = '';
       
        console.log(dataArray);
    }
    else {
        alert("Please Provide Some Input!");
    }
}


function timeCreator() {
    // Adding time to card being created At
    let timeStamp = new Date();
    let localLang = navigator.language;
    let formattedDateUS = Intl.DateTimeFormat(localLang, options).format(timeStamp);

    return formattedDateUS;
}

function editTask(taskData) {
    currentTask = taskData;
    addButton.classList.add("hidden");
    updateBtn.classList.remove("hidden");
    inputEle.value = taskData.title;
}

function handleCheckbox(taskData,checkButton){
    const isChecked = checkButton.checked;
    dataArray = dataArray.map((tas) => {
        if (tas.id === taskData.id) {
            return { ...tas, checked: isChecked};
        }
        return tas;
    });
    
    localStorage.setItem("tasks",JSON.stringify(dataArray));

    return isChecked;
   
}

function handleUpdateButton() {  
    if (currentTask)
    {
        dataArray = dataArray.map((tas) => {
        if (tas.id === currentTask.id) {
            return { ...tas, title: inputEle.value,timeOfCreation : timeCreator()};
        }
        return tas;
        });

        // Find the card element of the currentTask
        const cardToUpdate = Array.from(taskContainer.children).find(card => {
            return card.querySelector('p').innerText === currentTask.title;
        });

        if (cardToUpdate) {
            // Update the task title and time of creation in the card
            cardToUpdate.querySelector('.taskDiv p').innerText = inputEle.value;
            cardToUpdate.querySelector('.spanDate').innerText = timeCreator();
        }

        updateBtn.classList.add("hidden");
        addButton.classList.remove("hidden");
        localStorage.setItem("tasks", JSON.stringify(dataArray));
        inputEle.value = '';
        currentTask = null; // Reset the current task
    }
}

