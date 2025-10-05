// === Grab HTML elements ===
const taskForm      = document.getElementById('taskForm');     // the <form>
const taskTitle     = document.getElementById('taskTitle');    // title input
const taskDesc      = document.getElementById('taskDesc');     // description textarea
const taskDate      = document.getElementById('taskDate');     // date input
const taskPriority  = document.getElementById('taskPriority'); // priority select
const taskList      = document.getElementById('taskList');     // <ul> list container
const progressFill  = document.getElementById('progressFill'); // inner green bar
const progressText  = document.getElementById('progressText'); // progress text

// === Data store ===
let tasks = []; // an array to hold all task objects

// === Load saved tasks from localStorage on page load ===
if(localStorage.getItem('tasksData')){
  tasks = JSON.parse(localStorage.getItem('tasksData')); // convert JSON string back to array
  renderTasks();     // draw tasks on screen
  updateProgress();  // update progress bar and text
}

// === When form is submitted ===
taskForm.addEventListener('submit', function(e){
  e.preventDefault(); // stop page reload

  // Create a new task object
  const newTask = {
    id: Date.now(),                  // unique number (current timestamp)
    title: taskTitle.value.trim(),   // text from input
    desc: taskDesc.value.trim(),     // text from textarea
    date: taskDate.value,            // due date (may be empty)
    priority: taskPriority.value,    // low/medium/high
    completed: false                 // default unchecked
  };

  tasks.push(newTask);                // add to array
  saveTasks();                        // save to localStorage
  taskForm.reset();                    // clear the form
  renderTasks();                       // refresh the task list
  updateProgress();                    // update progress bar
});

// === Save array to localStorage ===
function saveTasks(){
  localStorage.setItem('tasksData', JSON.stringify(tasks));
  // localStorage only stores strings, so we convert array -> JSON string
}

// === Build HTML for every task ===
function renderTasks(){
  taskList.innerHTML = ''; // remove old list items

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" class="completeBox" ${task.completed ? 'checked' : ''}>
      <strong style="margin-left:6px;">${task.title}</strong>
      ${task.date ? `<br><small>Due: ${task.date}</small>` : ''}
      ${task.desc ? `<br>${task.desc}` : ''}
      <br><em>Priority: ${task.priority}</em>
      <button class="deleteBtn" style="float:right;">Delete</button>
    `;

    // Add strike-through if completed
    if(task.completed) li.style.textDecoration = 'line-through';

    taskList.appendChild(li);

    // --- Checkbox click: toggle completion ---
    li.querySelector('.completeBox').addEventListener('change', (e)=>{
      task.completed = e.target.checked; // update boolean
      saveTasks();
      renderTasks();   // redraw list (to apply strike-through)
      updateProgress();
    });

    // --- Delete button click ---
    li.querySelector('.deleteBtn').addEventListener('click', ()=>{
      tasks = tasks.filter(t => t.id !== task.id); // remove task by id
      saveTasks();
      renderTasks();
      updateProgress();
    });
  });
}

// === Update the progress bar and text ===
function updateProgress(){
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  progressFill.style.width = percent + '%';      // grow/shrink the green bar
  progressFill.textContent = percent + '%';      // show percent text inside bar
  progressText.textContent = `${completed} of ${total} tasks completed`;
}
