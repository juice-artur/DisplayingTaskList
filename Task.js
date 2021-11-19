class Task {
    constructor(taskListId, title, description, dueDate, done) {
        if (typeof taskListId === 'object') {
            this.taskListId = taskListId.taskListId;
            this.title = taskListId.title;
            this.description = taskListId.description;
            this.dueDate = taskListId.dueDate;
            this.done = taskListId.done === true || done === 'true';
        } else {
            this.taskListId = taskListId;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.done = done === true || done === 'true';
        }
    }
}

/*let testTask = [
    new Task(0, 'Test task', 'first test task', new Date(2021, 11, 28), false),
    new Task(1, 'Test task 1', 'second test task', new Date(2021, 11, 15), true),
    new Task(1, "Task without desc", null, new Date(2020, 11, 15), false)
]*/


/*const taskElement = document.getElementById('tasks')*/

function checkEmpty(str) {
    if (str != null && typeof str !== "undefined") {
        if (!str.trim()) {
            return "";
        }
        return str
    } else {
        return "";
    }
}

let _body = document.querySelector('.change-hide');
let changeModeButton =  document.createElement('input');
let changeShowP =  document.createElement('p');
_body.appendChild(changeShowP);
changeModeButton.type = "checkbox";
changeModeButton.classList.add('change-mode-button');
changeModeButton.addEventListener('change', function (){
    showTasks(changeModeButton);
});
changeShowP.innerText = "All tasks";
_body.appendChild(changeModeButton);


function createAndAppendTaskNode(task) {
   /* const {taskListId, title, description, dueDate, done} = task;*/
    taskListId = task.taskListId;
    title = task.title;
    description = task.description;
    dueDate = task.dueDate;
    done = task.done;


    let taskContainer = document.createElement('div');
    taskContainer.classList.add('format-task-to-show');
    document.getElementById('tasks').appendChild(taskContainer);

    let taskHead = document.createElement('div');
    taskContainer.appendChild(taskHead);
    taskHead.classList.add('task-head');


    let removeButton = document.createElement('button');
    taskContainer.appendChild(removeButton);
    removeButton.innerText = "Delete task";
    removeButton.classList.add('remove-button');
    removeButton.addEventListener('click', function () {
        onClickDelete(task, removeButton);
    });

    let _title = document.createElement('p');
    taskHead.appendChild(_title);
    _title.classList.add('task-title');

    let check = document.createElement('p');
    taskHead.appendChild(check);
    check.classList.add('task-check-box');

    let myCheckBox = document.createElement('input');
    check.appendChild(myCheckBox);
    myCheckBox.type = "checkbox";
    taskContainer.classList.toggle('done', done);
    myCheckBox.checked = done;

    myCheckBox.addEventListener('change', function () {
        clickedTaskCheckBox(task, myCheckBox), showTasks(changeModeButton);
    });

    _title.innerText = title;
    

    let taskDeskDiv = document.createElement('div');
    taskContainer.appendChild(taskDeskDiv);
    taskDeskDiv.classList.add('desc-p');
    let taskDesk = document.createElement('p');
    taskDesk.innerText = checkEmpty(description);
    taskDeskDiv.appendChild(taskDesk);    

    let taskDueDate = document.createElement('p');
    taskContainer.appendChild(taskDueDate);
    taskDueDate.classList.add('date');
    taskDueDate.classList.toggle('expired', !done && isExpired(dueDate));
    if(typeof (dueDate) === "object")
    {
        taskDueDate.innerText = dueDate.toLocaleDateString("en-US").toString();
    }
    else
    {
        if(!checkEmpty(dueDate)) return;
        taskDueDate.innerText = new Date(dueDate).toLocaleDateString("en-US").toString();
    }
}

/*testTask.forEach(createAndAppendTaskNode);*/

function clickedTaskCheckBox(task, flag)
{
    let head = flag.parentNode;
    let root = head.parentNode.parentNode;
    root.classList.toggle('done', flag.checked);
    const dateNode = root.querySelector('.date');
    dateNode.classList.toggle('expired', !flag.checked && isExpired(dateNode.textContent));
}

function isExpired(date)
{
    return new Date(date) < Date.now();
}

function onClickDelete(task, button)
{
    button.parentNode.remove();
    testTask.splice( testTask.indexOf(task), 1);
}

function showTasks(allTasksFlag)
{
    let tasks = document.querySelector('#tasks');
    tasks.classList.toggle('hide',  !allTasksFlag.checked)
}

const userTask = document.forms['taskForm'];
userTask.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(userTask);
    const _task = new Task( Object.fromEntries(formData.entries()));
    /*testTask.push(_task);*/
  /*  createAndAppendTaskNode(_task);*/
    userTask.reset();
    createTask(_task)
        .then(createAndAppendTaskNode);
    
});


function createTask(task)
{
    let postEndpoint = 'https://localhost:5001/api/Task';
    task.taskListId = 1;
    console.log(task);
    return fetch(postEndpoint,
    {
        method : 'POST',
        headers:
            {
                'Content-Type': 'application/json'   
            },
            body: JSON.stringify(task)
    })
        .then(response => response.json())
}

window.onload = showTasks;


fetch('https://localhost:5001/api/TaskList/1/tasks?isOpen=false')
    .then(response => response.json())
    .then(testTask => testTask.forEach(createAndAppendTaskNode));

 

