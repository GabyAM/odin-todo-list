import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";
import { todoInterface } from "./todoInterface.js";

export const displayModule = (function() {

    function addEvents(todoTitle) {

        let enterPressed = false;
    
        function onBlur() {
            if(enterPressed) {
                enterPressed = false;
            }
            else {
                todoInterface.handleTodoSubmit(todoTitle.parentElement);
                enterPressed = false;
                updateTodos();
                toggleAddTodoButton('enabled');
            }
        }

        function onKeyDown(event) {
            if(event.key === 'Enter' && !enterPressed) {
                enterPressed = true;
                event.preventDefault();
                todoInterface.handleTodoSubmit(todoTitle.parentElement);
                enterPressed = false;
                updateTodos()
                toggleAddTodoButton('enabled');
                event.preventDefault();
            }
        }

        function onBlurHandler() {
            onBlur();
        }
        function onKeyDownHandler(e) {
            onKeyDown(e);
        }

        todoTitle.removeEventListener('blur', onBlurHandler)
        todoTitle.removeEventListener('keydown', onKeyDownHandler)

        todoTitle.addEventListener('blur', onBlurHandler)
        todoTitle.addEventListener('keydown', onKeyDownHandler)
    }

    function createTodo(todo = '') {
        const $listItem = document.createElement('li');
        const $todoTitle = document.createElement('input');
        $todoTitle.type = 'text';
        $todoTitle.value = todo;
        $todoTitle.className = 'todo-text';
        $listItem.appendChild($todoTitle);
        return $listItem
    }

    function displayTodos(todos) {
        const $list = document.querySelector('.todo-list');
        todos.forEach(todo => {
            const $listTodo = createTodo(todo.title);
            if(todo.id) {
                $listTodo.dataset.id = todo.id;
            }
            $list.appendChild($listTodo)
            addEvents($listTodo.children[0]); //this will have to be modified if i put other element before the text input (possibly checkbox)
        })
    }

    function updateTodos() {
        document.querySelector('.todo-list').innerHTML = '';
        displayTodos(todoController.getTodos());
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

        const $todoTitle = document.querySelector('.placeholder .todo-text')
        addEvents($todoTitle);

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

