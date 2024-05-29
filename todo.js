document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInputTitle = document.getElementById('input-title');
    const todoInputDescription = document.getElementById('input-text');
    const todoList = document.getElementById('todo-list');
    const filterInput = document.getElementById('filter-title');
    const filterButton = document.getElementById('filter-button');
    const editDialog = document.getElementById('edit-dialog');
    const editForm = document.getElementById('edit-form');
    const editTitle = document.getElementById('edit-title');
    const editText = document.getElementById('edit-text');
    const cancelEdit = document.getElementById('cancel-edit');
    let editIndex = null;

    function loadTodoList(filter = '') {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        todoList.innerHTML = '';

        tasks
            .filter(task => task.title.toLowerCase().includes(filter.toLowerCase()))
            .forEach((todo, index) => {
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

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.title = 'Deletar tarefa';
                deleteButton.innerHTML = '🗑️';
                deleteButton.addEventListener('click', () => deleteTask(index));

                taskItem.appendChild(taskTitle);
                taskItem.appendChild(taskDescription);
                taskItem.appendChild(editButton);
                taskItem.appendChild(deleteButton);
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

    function deleteTask(index) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTodoList();
    }

    function saveTask(title, text) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ title, text });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    async function fetchPokemon() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            return [];
        }
    }

    async function init() {
        loadTodoList();

        todoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const todoTitle = todoInputTitle.value.trim();
            const todoText = todoInputDescription.value.trim();

            if (todoTitle && todoText) {
                const pokemons = await fetchPokemon();
                const randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)].name;
                const taskTitle = `${todoTitle} - ${randomPokemon}`;
                saveTask(taskTitle, todoText);
                todoInputTitle.value = '';
                todoInputDescription.value = '';
                loadTodoList();
            }
        });

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks[editIndex] = {
                title: editTitle.value,
                text: editText.value
            };
            localStorage.setItem('tasks', JSON.stringify(tasks));
            closeEditDialog();
            loadTodoList();
        });

        cancelEdit.addEventListener('click', closeEditDialog);

        filterButton.addEventListener('click', () => {
            const filterValue = filterInput.value.trim();
            loadTodoList(filterValue);
        });
    }

    init();
});
