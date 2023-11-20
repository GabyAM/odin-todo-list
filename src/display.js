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

    function addCheckboxEvents(input, callback) {

        function onChangeHandler() {
            callback();
        }
        input.removeEventListener('change', onChangeHandler);
        if (!input.hasAttribute('data-event-bound')) {
            input.addEventListener('change', onChangeHandler);
            input.setAttribute('data-event-bound', true);
        }
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
        function checkboxCallback() {
            todoInterface.handleCompletedChange($listItem.dataset.id);
        }

        addTextInputEvents($todoTitle, submitCallback);
        addCheckboxEvents($todoCompleted, checkboxCallback);
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
        updateTitle();
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
        addTextInputEvents($todoTitle);

        $todoTitle.focus();
    }

    function hideEditMenu() {
        document.querySelector('.todo-edit').style.visibility = 'hidden';
    }

    function showEditMenu() {
        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.style.visibility = 'visible';
    }   

    function updateEditMenuFields(id) {
        const listTodo = todoController.getTodoById(id);
        document.querySelector('.edit-completed').checked = listTodo.completed;
        document.querySelector('.edit-title').value = listTodo.title;
        document.querySelector('.edit-due-date').value = listTodo.dueDate;
    }

    //IDEA: hacer que al hacer submit a algun valor, en vez de autollamarse otra vez, que solo actualize los valores de los campos.
    const editMenuListeners = {
        dateListener: null
    }
    
    function updateEditMenu(todo) {
        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.dataset.id = todo.dataset.id;
        
        const $editCompleted = $todoEditMenu.querySelector('.edit-completed');
        const $editTitle = $todoEditMenu.querySelector('.edit-title');
        const $editDueDate = $todoEditMenu.querySelector('.edit-due-date')
        updateEditMenuFields($todoEditMenu.dataset.id);

        $editDueDate.removeEventListener('change', editMenuListeners.dateListener)

        function checkboxCallback() {
            todoInterface.handleCompletedChange($todoEditMenu.dataset.id)
            updateTodos();
            updateEditMenuFields($todoEditMenu.dataset.id);
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

        addTextInputEvents($editTitle, submitCallback);
        addCheckboxEvents($editCompleted, checkboxCallback);

        $editDueDate.addEventListener('change', onDateChangeHandler)
        editMenuListeners.dateListener = onDateChangeHandler;

        function categoryAdd(event) {
            const button = event.target;
            if(!todoInterface.isTodoInCategory($todoEditMenu.dataset.id, button.dataset.category)) {
                addToMainCategory(button.dataset.category);      
            }
        } //pleaseee!!

        function handleCategoryAdd(e) {
            categoryAdd(e);
        }

        const $addToCategoryButtons = document.querySelectorAll('.add-to-category-button');
        $addToCategoryButtons.forEach(button => button.addEventListener('click', handleCategoryAdd)
        )
        const $deleteTodoButton = $todoEditMenu.querySelector('.delete-todo-button');
        $deleteTodoButton.addEventListener('click', () => {
            todoController.removeTodoFromCategory($todoEditMenu.dataset.id);
            updatePage();
            hideEditMenu();
        })
    function updateTitle() {
        const title = document.querySelector('h1');
        const categoryName = todoController.getCurrentCategoryName();
        title.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    }

    function changeCategory(categoryName) {
        todoController.switchCategory(categoryName);
        hideEditMenu();
        updatePage();
    }

    function displayCategoryPlaceholder() {
        const $categoryButton = document.createElement('button');
        const $listCategory = document.createElement('li');
        const $categoryIcon = document.createElement('span');
        const $categoryTitle = document.createElement('input');

        $categoryIcon.className = 'material-symbols-outlined';
        $categoryIcon.textContent = 'list';

        $categoryTitle.type = 'text';

        $listCategory.appendChild($categoryIcon);
        $listCategory.appendChild($categoryTitle);
        $categoryButton.appendChild($listCategory);

        document.querySelector('.custom-categories-list').appendChild($categoryButton);

        function submitCallback() {
            todoController.addCategory($categoryTitle.value)
            $categoryButton.dataset.category = $categoryTitle.value;

            //replace input by h3
            $listCategory.removeChild($categoryTitle);
            const setTitle = document.createElement('h3');
            setTitle.textContent = $categoryButton.dataset.category;
            $listCategory.appendChild(setTitle);

            $categoryButton.addEventListener('click', () => {
                changeCategory($categoryButton.dataset.category);
            })
        }

        $categoryTitle.focus();
        addTextInputEvents($categoryTitle, submitCallback);
    }

    function addToMainCategory(categoryName) {
        const id = document.querySelector('.todo-edit').dataset.id;
        todoController.addTodoToCategory(id, categoryName);
    }

    updatePage();

    return {
        changeCategory, 
        displayTodoPlaceholder,
        updateTodos,
        displayCategoryPlaceholder
        displayCategoryPlaceholder,
        addToMainCategory
    }
})()

