document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInputTitle = document.getElementById('input-title');
    const todoInputDescription = document.getElementById('input-text');
    const todoList = document.getElementById('todo-list');
    const editDialog = document.getElementById('edit-dialog');
    const editForm = document.getElementById('edit-form');
    const editTitle = document.getElementById('edit-title');
    const editText = document.getElementById('edit-text');
    const cancelEdit = document.getElementById('cancel-edit');
    let editIndex = null;

    function loadTodoList() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        todoList.innerHTML = '';

        tasks.forEach((todo, index) => {
            const taskItem = document.createElement('li');
            taskItem.style.border = '1px solid black';
            taskItem.style.listStyle = 'none';

            const taskTitle = document.createElement('h2');
            taskTitle.textContent = todo.title;

            const taskDescription = document.createElement('p');
            taskDescription.textContent = todo.text;
            taskDescription.style.whiteSpace = 'pre-wrap';
            taskDescription.style.marginBottom = '8px';

            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            editButton.title = 'Editar tarefa';
            editButton.innerHTML = '✏️';
            editButton.addEventListener('click', () => openEditDialog(index, todo.title, todo.text));

            taskItem.appendChild(taskTitle);
            taskItem.appendChild(taskDescription);
            taskItem.appendChild(editButton);
            todoList.appendChild(taskItem);
        });
    }

    function openEditDialog(index, title, text) {
        editIndex = index;
        editTitle.value = title;
        editText.value = text;
        editDialog.showModal();
    }

    function closeEditDialog() {
        editDialog.close();
    }

    loadTodoList();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const todoTitle = todoInputTitle.value.trim();
        const todoText = todoInputDescription.value.trim();
        if (todoTitle && todoText) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ title: todoTitle, text: todoText });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            todoInputTitle.value = '';
            todoInputDescription.value = '';
            loadTodoList();
        }
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // lógica do edit viria aqui
        closeEditDialog();
    });

    cancelEdit.addEventListener('click', () => {
        closeEditDialog();
    });

    window.onload = main;
});