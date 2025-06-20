/*
const todoList = [
{
  name: 'make dinner',
  dueDate: '2025-06-18'
}, 
{
  name: 'wash dishes', 
  dueDate: '2025-06-18'
}
];
*/

const todoList = [];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  todoList.forEach((todoObject, i) => {
    const { name, dueDate } = todoObject;
    const html = `
        <div class="task-name">${name}</div>
        <div class="task-due-date">${dueDate}</div>
        <button class="js-delete-todo-button delete-todo-button">Delete</button>
    `;
    todoListHTML += html;
  })

  document.querySelector('.js-todo-list').innerHTML = todoListHTML;

  
  document.querySelectorAll('.js-delete-todo-button').forEach((deleteButton, i) => {
    deleteButton.addEventListener('click', () => {
      deleteTask(i);
    });
  });
}

document.querySelector('.js-add-todo-button').addEventListener('click', () => {
  addToDo();
})

function addToDo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  todoList.push(
    { 
      name,
      dueDate
    });

    inputElement.value = ''
    dateInputElement.value = '';

  renderTodoList();
}

function deleteTask(i) {
  todoList.splice(i, 1);
  renderTodoList();
}

function handleKeyDownEnter(event) {
  if (event.key === 'Enter') {
    addToDo();
  }
}

/* addEventListeners */
document.querySelector('.js-name-input').addEventListener('keydown', (event) => {
  handleKeyDownEnter(event);
});
