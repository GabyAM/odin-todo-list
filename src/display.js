//import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";
import { todoInterface } from "./todoInterface.js";

export const displayModule = (function() {

    function addEvents(todo) {

        const todoTitle = todo.children[1];
        const todoCompleted = todo.children[0];

        todoTitle.removeEventListener('blur', onBlurHandler)
        todoTitle.removeEventListener('keydown', onKeyDownHandler)
        todoCompleted.removeEventListener('change', onChangeHandler);


        let enterPressed = false;
    
        function onBlur() {
            if(enterPressed) {
                enterPressed = false;
            }
            else {
                todoInterface.handleTodoSubmit(todo);
                enterPressed = false;
                updateTodos();
                toggleAddTodoButton('enabled');
            }
        }

        function onKeyDown(event) {
            if(event.key === 'Enter' && !enterPressed) {
                enterPressed = true;
                event.preventDefault();
                todoInterface.handleTodoSubmit(todo);
                updateTodos()
                enterPressed = false;
                toggleAddTodoButton('enabled');
            }
        }

        function onChange() {
            todoInterface.handleCompletedChange(todo.dataset.id);
            //updateTodos();
        }

        function onBlurHandler() {
            onBlur();
        }
        function onKeyDownHandler(e) {
            onKeyDown(e);
        }

        function onChangeHandler() {
            onChange();
        }

        if (!todoTitle.hasAttribute('data-event-bound')) {
            todoTitle.addEventListener('blur', onBlurHandler);
            todoTitle.addEventListener('keydown', onKeyDownHandler);
            todoTitle.setAttribute('data-event-bound', true);
        }

        todoCompleted.addEventListener('change', onChangeHandler);
    }

    function createTodo({title = '', completed = false, id = null} = {}) {
        const $listItem = document.createElement('li');
        $listItem.className = 'todo';
        if(id) {
            $listItem.dataset.id = id;
        }

        const $todoTitle = document.createElement('input');
        $todoTitle.type = 'text';
        $todoTitle.value = title;
        $todoTitle.className = completed ? 'todo-title completed' : 'todo-title';

        const $todoCompleted = document.createElement('input');
        $todoCompleted.type = 'checkbox';
        $todoCompleted.checked = completed;
        $todoCompleted.className = 'todo-completed'


        const $todoOptions = document.createElement('buttton');
        $todoOptions.removeEventListener('click', onClickHandler);

        $todoOptions.className = 'todo-options';
        const $optionsIcon = document.createElement('span');
        $todoOptions.className = 'material-symbols-outlined';
        $todoOptions.textContent = 'more_vert';
        $todoOptions.appendChild($optionsIcon);

        function onClick() {
            if(document.querySelector('.todo-edit').style.width === '') {
                showEditMenu();
                updateEditMenu($listItem);
            }
            else {
                updateEditMenu($listItem);
            }
        }
        function onClickHandler() {
            onClick();
        }
        $todoOptions.addEventListener('click', onClickHandler);

        $listItem.appendChild($todoCompleted);
        $listItem.appendChild($todoTitle);
        $listItem.appendChild($todoOptions);

        addEvents($listItem);
        return $listItem
    }

    function displayTodos(todos) {
        const $list = document.querySelector('.todo-list');
        todos.forEach(todo => {
            const $listTodo = createTodo(todo);
            $list.appendChild($listTodo)
        })
    }

    let updatingTodos = false;

    function updateTodos() {
        console.log('updateTodos')
        if(!updatingTodos) {
            updatingTodos = true;
            document.querySelector('.todo-list').innerHTML = '';
            displayTodos(todoController.getTodos());
            updatingTodos = false;
        }
    }

    function updatePage() {
        updateTodos();
    }

    function toggleAddTodoButton(type) {
        const $addTodoButton = document.querySelector('.add-todo-button');
        $addTodoButton.disabled = type === 'disabled' ? true : false;
    }

    function displayTodoPlaceholder() {
        toggleAddTodoButton('disabled');

        const $todoList = document.querySelector('.todo-list');
        const $todo = createTodo();
        $todo.classList.add('placeholder');

        $todoList.appendChild($todo);

        const $todoTitle = document.querySelector('.placeholder .todo-title')
        addEvents($todo);

        $todoTitle.focus();
    }

    function showEditMenu() {
        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.style.width = 'calc(100% - ((100% / 7) * 5))';
    }   

    function updateEditMenuFields(todo) {
        document.querySelector('.edit-completed').checked = todo.querySelector('.todo.completed').checked;
        document.querySelector('.edit-title').value = todo.querySelector('.todo-title').value;
    }

    const editMenuListeners = {
        textInputListener: null,
        checkboxListener: null
    }
    
    function updateEditMenu(todo) {
        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.dataset.id = todo.dataset.id;
        
        const $editCompleted = $todoEditMenu.querySelector('.todo-completed');
        const $editTitle = $todoEditMenu.querySelector('.todo-title');
        updateEditMenuFields(todo);

        $editCompleted.removeEventListener('change', editMenuListeners.checkboxListener)
        $editTitle.removeEventListener('keydown', editMenuListeners.textInputListener);

        function onChange() {
            todoInterface.handleCompletedChange(todo.dataset.id)
            updatePage();
        }

        function onChangeHandler() {
            onChange();
        }

        function onKeyDown(event) {
            function getEditingTodo() {
                const $domTodos = document.querySelectorAll('.todo');
                return [...$domTodos].find(domTodo => domTodo.dataset.id === $todoEditMenu.dataset.id)
            }
            if(event.key === 'Enter') {
                todoInterface.updateTodoTitle($todoEditMenu.dataset.id, $editTitle.value);
                updateTodos();
                updateEditMenuFields(getEditingTodo());
            }
        }

        function onKeyDownHandler(e) {
            onKeyDown(e);
        }


        $editCompleted.addEventListener('change', onChangeHandler)
        editMenuListeners.checkboxListener = onChangeHandler;
        $editTitle.addEventListener('keydown', onKeyDownHandler)
        editMenuListeners.textInputListener = onKeyDownHandler;
    }

    function changeCategory(categoryName) {
        todoController.switchCategory(categoryName);
        updateTodos();
    }

    updatePage();

    return {
        changeCategory, 
        displayTodoPlaceholder,
        updateTodos
    }
})()

