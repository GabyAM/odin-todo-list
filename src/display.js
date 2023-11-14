import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";

export const displayModule = (function() {

    function addEvents(todoTitle) {

        let enterPressed = false;

        function editTodo(todo) {
            todoController.editTodo(todo)
        }

        function validateAndAddTodo(todo, todoTitle) {
            if(todo.classList.contains('placeholder')) {
                todo.classList.remove('placeholder');
                document.querySelector('.todo-list').removeChild(todo);
                if(todoTitle.value !== '') {
                    const newTodo = new Todo(todoTitle.value, '', false, '', '');
                    todoController.addTodo(newTodo);
                }
            }
            else {
                editTodo(todo);
            }
            enterPressed = false;
        }
    
        function onBlur() {
            if(enterPressed) {
                enterPressed = false;
            }
            else {
                validateAndAddTodo(todoTitle.parentElement, todoTitle)
                updateTodos();
                toggleAddTodoButton();
            }
        }

        function onKeyDown(event) {
            if(event.key === 'Enter' && !enterPressed) {
                enterPressed = true;
                event.preventDefault();
                validateAndAddTodo(todoTitle.parentElement, todoTitle)
                updateTodos()
                toggleAddTodoButton();
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
            $list.appendChild($listTodo)
            addEvents($listTodo.children[0]); //this will have to be modified if i put other element before the text input (possibly checkbox)
        })
    }

    function updateTodos() {
        document.querySelector('.todo-list').innerHTML = '';
        displayTodos(todoController.getTodos());
    }

    function toggleAddTodoButton() {
        const $addTodoButton = document.querySelector('.add-todo-button');
        $addTodoButton.disabled = $addTodoButton.disabled ? false : true;
    }

    function displayTodoPlaceholder() {
        toggleAddTodoButton();

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

