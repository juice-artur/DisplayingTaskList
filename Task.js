class Task {
    constructor(taskListId, title, description, dueDate, done, id) {
        if (typeof taskListId === 'object') {
            this.taskListId = taskListId.taskListId;
            this.title = taskListId.title;
            this.description = taskListId.description;
            this.dueDate = taskListId.dueDate;
            this.id =  taskListId.id;
            this.done = taskListId.done === true || done === 'true';
        } else {
            this.taskListId = taskListId;
            this.title = title;
            this.description = description;
            this.dueDate = dueDate;
            this.id =  id;
            this.done = done === true || done === 'true';
        }
    }
}

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
    taskListId = task.taskListId;
    title = task.title;
    description = task.description;
    dueDate = task.dueDate;
    done = task.done;
    id = task.id;


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
    if(checkEmpty(dueDate)){
        if(typeof (dueDate) === "object")
        {
            taskDueDate.innerText = dueDate.toLocaleDateString("en-US").toString();
        }
        else
        {
            taskDueDate.innerText = new Date(dueDate).toLocaleDateString("en-US").toString();
        }   
    }
}


function isExpired(date)
{
    return new Date(date) < Date.now();
}
//Promis fix(remove )
function onClickDelete(task, button)
{
    let deleteEndpoint = `https://localhost:5001/api/Task/${task.id}`;
    fetch(deleteEndpoint,
    {
        method: 'DELETE'
    })
        .then(button.parentNode.remove());
}

function showTasks(allTasksFlag)
{
    let tasks = document.querySelector('#tasks');
    tasks.classList.toggle('hide',  !allTasksFlag.checked)
}

const taskForm = document.forms['taskForm'];
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const task = new Task( Object.fromEntries(formData.entries()));
    taskForm.reset();
    taskApi.createTask(task)
        .then(response => response.json())
        .then(createAndAppendTaskNode);
    
});


function clickedTaskCheckBox(task, flag)
{
    task.done = flag.checked;
    let head = flag.parentNode;
    let root = head.parentNode.parentNode;
    taskApi.patchTask(task)
        .then(() => {
            root.classList.toggle('done', flag.checked);
            const dateNode = root.querySelector('.date');
            dateNode.classList.toggle('expired', !flag.checked && isExpired(dateNode.textContent));
        })
    
}

window.onload = showTasks;

const baseApiUrl = 'https://localhost:5001/api';


const taskApi = {    
    getOpenTasks() {        
        return fetch(baseApiUrl + '/TaskList/1/tasks?isOpen=false')
            .then(response => response.json())
    },
    createTask(task)
    {
        task.taskListId = 1;
        task.dueDate = new Date(task.dueDate);
        return fetch(baseApiUrl +'/Task',
        {
            method: 'POST',
            headers:
                {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(task)
        })
    },
    
    patchTask(task)
    {
        task.taskListId = 1
        return fetch(baseApiUrl + `/Task/${task.id}`,{
            method : 'PATCH',
            headers:
                {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(task)
        })   
    }
};

taskApi.getOpenTasks()
    .then(testTask => testTask.forEach(createAndAppendTaskNode));

 

