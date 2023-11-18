//import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";
import { todoInterface } from "./todoInterface.js";

export const displayModule = (function() {

    function addTextInputEvents(input, callback) {
        let enterPressed = false;
        
        function onBlurHandler() {
            if(enterPressed) {
                enterPressed = false
            } else {
                callback(input);
                enterPressed = false;
            }
        }

        function onKeyDownHandler(e) {
            if(e.key === 'Enter' && !enterPressed) {
                enterPressed = true;
                callback(input);
                enterPressed = false;  
            }
        }

        input.removeEventListener('blur', onBlurHandler);
        input.removeEventListener('keydown', onKeyDownHandler);


        if (!input.hasAttribute('data-event-bound')) {
            input.addEventListener('blur', onBlurHandler);
            input.addEventListener('keydown', onKeyDownHandler);
            input.setAttribute('data-event-bound', true);
        }
    }

    function addCheckboxEvents(todoCompleted) {

        function onChange() {
            todoInterface.handleCompletedChange(todo.dataset.id);
            //updateTodos();
        }

        function onChangeHandler() {
            onChange();
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

        function submitCallback() {
            todoInterface.handleTodoSubmit($listItem);
            updateTodos();
            toggleAddTodoButton('enabled');
        }
        addTextInputEvents($todoTitle, submitCallback);
        addCheckboxEvents($todoCompleted);
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

    //IDEA: hacer que al hacer submit a algun valor, en vez de autollamarse otra vez, que solo actualize los valores de los campos.
    const editMenuListeners = {
        checkboxListener: null,
    }
    
    function updateEditMenu(todo) {
        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.dataset.id = todo.dataset.id;
        
        const $editCompleted = $todoEditMenu.querySelector('.todo-completed');
        const $editTitle = $todoEditMenu.querySelector('.todo-title');
        updateEditMenuFields(todo);

        $editCompleted.removeEventListener('change', editMenuListeners.checkboxListener)
        $editDueDate.removeEventListener('change', editMenuListeners.dateListener)

        function onCompletedChange() {
            todoInterface.handleCompletedChange(todo.dataset.id)
            updateTodos();
            updateEditMenuFields($todoEditMenu.dataset.id);
        }

        function onCompletedChangeHandler() {
            onCompletedChange();
        }

        function submitCallback() {
            todoInterface.updateTodoTitle($todoEditMenu.dataset.id, $editTitle.value);
            updateTodos();
            updateEditMenuFields($todoEditMenu.dataset.id);
        }

        }



        $editCompleted.addEventListener('change', onCompletedChangeHandler)
        editMenuListeners.checkboxListener = onCompletedChangeHandler;

        addTextInputEvents($editTitle, submitCallback);

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

