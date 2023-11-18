//import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";
import { todoInterface } from "./todoInterface.js";
import { formatToRelativeDate } from "./utilities.js";

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

    function createTodo({title = '', completed = false, id = null, dueDate = ''} = {}) {
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

        const $todoText = document.createElement('div');
        $todoText.className = 'todo-text';
        $todoText.appendChild($todoTitle)

        if(dueDate !== '') {
            const $todoDueDate = document.createElement('div');
            $todoDueDate.className = 'todo-due-date';
            const $dueDateIcon = document.createElement('span');
            $dueDateIcon.className = 'material-symbols-outlined';
            $dueDateIcon.textContent = 'schedule';
            const $dueDateText = document.createElement('span');
            $dueDateText.textContent = formatToRelativeDate(dueDate);

            $todoDueDate.appendChild($dueDateIcon);
            $todoDueDate.appendChild($dueDateText);
            $todoText.appendChild($todoDueDate)
        }


        const $todoOptions = document.createElement('buttton');
        $todoOptions.removeEventListener('click', onClickHandler);

        $todoOptions.className = 'todo-options';
        const $optionsIcon = document.createElement('span');
        $optionsIcon.className = 'material-symbols-outlined';
        $optionsIcon.textContent = 'more_vert';
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
        $listItem.appendChild($todoText);
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
        todoInterface.sortListByDueDate(todos);
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

    function updateEditMenuFields(id) {
        const listTodo = todoController.getTodoById(id);
        document.querySelector('.edit-completed').checked = listTodo.completed;
        document.querySelector('.edit-title').value = listTodo.title;
        document.querySelector('.edit-due-date').value = listTodo.dueDate;
    }

    //IDEA: hacer que al hacer submit a algun valor, en vez de autollamarse otra vez, que solo actualize los valores de los campos.
    const editMenuListeners = {
        checkboxListener: null,
        dateListener: null
    }
    
    function updateEditMenu(todo) {
        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.dataset.id = todo.dataset.id;
        
        const $editCompleted = $todoEditMenu.querySelector('.edit-completed');
        const $editTitle = $todoEditMenu.querySelector('.edit-title');
        const $editDueDate = $todoEditMenu.querySelector('.edit-due-date')
        updateEditMenuFields($todoEditMenu.dataset.id);

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

        function onDateChange() {
            todoInterface.handleDateChange($todoEditMenu.dataset.id, $editDueDate.value);
            updateTodos();
            updateEditMenuFields($todoEditMenu.dataset.id);
        }

        function onDateChangeHandler() {
            onDateChange();
        }


        $editCompleted.addEventListener('change', onCompletedChangeHandler)
        editMenuListeners.checkboxListener = onCompletedChangeHandler;

        addTextInputEvents($editTitle, submitCallback);

        $editDueDate.addEventListener('change', onDateChangeHandler)
        editMenuListeners.dateListener = onDateChangeHandler;
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

