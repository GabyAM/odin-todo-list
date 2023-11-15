//import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";
import { todoInterface } from "./todoInterface.js";

export const displayModule = (function() {

    function addEvents(todo) {

        const todoTitle = todo.children[0];
        todoTitle.removeEventListener('blur', onBlurHandler)
        todoTitle.removeEventListener('keydown', onKeyDownHandler)


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

        function onBlurHandler() {
            onBlur();
        }
        function onKeyDownHandler(e) {
            onKeyDown(e);
        }

        if (!todoTitle.hasAttribute('data-event-bound')) {
            todoTitle.addEventListener('blur', onBlurHandler);
            todoTitle.addEventListener('keydown', onKeyDownHandler);
            todoTitle.setAttribute('data-event-bound', true);
        }
    }

    function createTodo({title = '', completed = false, id = null} = {}) {
        const $listItem = document.createElement('li');
        if(id) {
            $listItem.dataset.id = id;
        }

        const $todoTitle = document.createElement('input');
        $todoTitle.type = 'text';
        $todoTitle.value = title;
        $todoTitle.className = 'todo-title';

        const $todoCompleted = document.createElement('input');
        $todoCompleted.type = 'checkbox';
        $todoCompleted.checked = completed;
        $todoCompleted.className = 'todo-completed'

        $listItem.appendChild($todoTitle);
        $listItem.appendChild($todoCompleted);

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

        if(!updatingTodos) {
            updatingTodos = true;
            document.querySelector('.todo-list').innerHTML = '';
            displayTodos(todoController.getTodos());
            updatingTodos = false;
        }
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

    function changeCategory(categoryName) {
        todoController.switchCategory(categoryName);
        updateTodos();
    }

    updateTodos();

    return {
        changeCategory, 
        displayTodoPlaceholder,
        updateTodos
    }
})()

