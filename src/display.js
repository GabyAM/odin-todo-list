//import { Todo } from "./todo.js";
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
            if(document.querySelector('.todo-edit').style.visibility === 'hidden') {
                showEditMenu();
                highlightTodo(id);
                updateEditMenu($listItem);
            }
            else {
                highlightTodo(id);
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
            if(todoInterface.handleTodoSubmit($listItem)) { //if return true, update page!
                updatePage();
            }
            toggleAddTodoButton('enabled');
        }
        function checkboxCallback() {
            todoInterface.handleCompletedChange($listItem.dataset.id);
            updatePage();
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
            displayTodos(todoInterface.getTodos());
            updatingTodos = false;
        }
    }
    
    function unhighlightEditingTodo() {
        const domTodos = [...document.querySelectorAll('.todo')];
        const editingTodo = domTodos.find(todo => todo.classList.contains('active'));
        if(editingTodo) {
            editingTodo.classList.remove('active');
        }
    }

    function highlightTodo(id) {
        unhighlightEditingTodo()
        const domTodos = [...document.querySelectorAll('.todo')]
        const todo = domTodos.find(todo => todo.dataset.id === id);
        todo.classList.add('active');
    }

    function updatePage() {
        updateTitle();
        updateTodos();
        if(document.querySelector('.todo-edit').hasAttribute('data-id')) {
            highlightTodo(document.querySelector('.todo-edit').dataset.id);
            updateEditMenuFields();
        }
    }

    function toggleAddTodoButton(type) {
        const $addTodoButton = document.querySelector('.add-todo-button');
        $addTodoButton.disabled = type === 'disabled' ? true : false;
    }

    function displayTodoPlaceholder() {
        toggleAddTodoButton('disabled');

        hideAndUnhighlight();

        const $todoList = document.querySelector('.todo-list');
        const $todo = createTodo();
        $todo.classList.add('placeholder');
        $todo.querySelector('.todo-options').style.visibility = 'hidden';

        $todoList.appendChild($todo);

        const $todoTitle = document.querySelector('.placeholder .todo-title')
        addTextInputEvents($todoTitle);

        $todoTitle.focus();
    }

    function hideEditMenu() {
        document.querySelector('.todo-edit').style.visibility = 'hidden';
        document.querySelector('.todo-edit').removeAttribute('data-id');
    }

    function hideAndUnhighlight() {
        hideEditMenu();
        unhighlightEditingTodo()
    }

    function showEditMenu() {
        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.style.visibility = 'visible';
    }   

    function createCustomCategorySection() {
        function createDropdownMenu() {
            const options = document.createElement('select');
            const placeholderOption = document.createElement('option');
            placeholderOption.selected = true;
            placeholderOption.hidden = true;
            placeholderOption.textContent = 'Select category'
            options.appendChild(placeholderOption)
            const customCategories = [...document.querySelectorAll('.custom-categories-list button')];
            customCategories.forEach(categoryElement => {
                if(categoryElement.dataset.id !== todoInterface.getCurrentCategoryId()) {
                    const title = categoryElement.dataset.category;
                    const categoryOption = document.createElement('option');
                    categoryOption.value = categoryElement.dataset.id;
                    categoryOption.textContent = title; 
                    options.appendChild(categoryOption);
                }
            })

            options.addEventListener('change', () => {
                const todoId = document.querySelector('.todo-edit').dataset.id;
                todoInterface.moveTodoToCategory(todoId, options.value);
                updateTodos();
                hideAndUnhighlight();
            })
            return options;
        }
        const optionsContainer = document.createElement('div');
        const categoryOptions = createDropdownMenu();
        const optionsTitle = document.createElement('h3');
        optionsTitle.textContent = 'Move to';
        optionsContainer.appendChild(optionsTitle);
        optionsContainer.appendChild(categoryOptions);
        optionsContainer.className = 'custom-categories-container';

        return optionsContainer;
    }

    function updateEditMenuFields() {
        const listTodo = todoInterface.getEditingTodo();
        document.querySelector('.edit-completed').checked = listTodo.completed;
        document.querySelector('.edit-title').value = listTodo.title;
        document.querySelector('.edit-description').value = listTodo.description;
        document.querySelector('.edit-due-date').value = listTodo.dueDate;
        if(listTodo.priority !== '') {
            document.querySelector(`#${listTodo.priority}-priority`).checked = true;
        } else {
            document.querySelectorAll('[name="priority"]').forEach(radio => radio.checked = false);
        }
    }

    const editMenuListeners = {
        dateListener: null,
        priorityListeners: [],
        categoryButtonsListeners: []
    }
    
    function updateEditMenu(todo) {

        const $todoEditMenu = document.querySelector('.todo-edit');
        $todoEditMenu.dataset.id = todo.dataset.id;

        function handleCheckboxEvent() {
            const $editCompleted = document.querySelector('.edit-completed');

            function checkboxCallback() {
                todoInterface.handleCompletedChange($todoEditMenu.dataset.id)
                updateTodos();
                updateEditMenuFields();
            }

            addCheckboxEvents($editCompleted, checkboxCallback);
        }

        function handleTitleEvents() {
            const $editTitle = $todoEditMenu.querySelector('.edit-title');

            function submitCallback() {
                if(todoInterface.editTitle($editTitle, $todoEditMenu.dataset.id)) {
                    updatePage();
                }
                //updateEditMenuFields($todoEditMenu.dataset.id);
            }

            addTextInputEvents($editTitle, submitCallback);
        }

        function handleDescriptionEvent() {
            const $editDescription = $todoEditMenu.querySelector('textarea');

            function submitCallback() {
                todoInterface.handleDescriptionChange($todoEditMenu.dataset.id, $editDescription.value)
            }

            addTextInputEvents($editDescription, submitCallback);
        }

        function handleDateEvent() {
            const $editDueDate = $todoEditMenu.querySelector('.edit-due-date');
            const todoQuantity = document.querySelectorAll('.todo').length;
            $editDueDate.removeEventListener('change', editMenuListeners.dateListener)

            function onDateChange() {
                todoInterface.handleDateChange($todoEditMenu.dataset.id, $editDueDate.value)
                updateTodos();
                if(todoInterface.wasListModified(todoQuantity)) {
                    hideEditMenu();
                }
            }

            $editDueDate.addEventListener('change', onDateChange)
            editMenuListeners.dateListener = onDateChange;
    
        }

        function handlePriorityEvent() {
            //idea to know if a todo was deleted: count the length of the list before and after the interface function
            const $priorityInputs = $todoEditMenu.querySelectorAll('[name="priority"]');
            const todoQuantity = document.querySelectorAll('.todo').length;

            function callback(e) {
                todoInterface.handlePriorityChange($todoEditMenu.dataset.id, e.target.value)
                if(todoInterface.wasListModified(todoQuantity)) {
                    updateTodos();
                    hideEditMenu();
                }
            }

            $priorityInputs.forEach((input, index) => {
                input.removeEventListener('change', editMenuListeners.priorityListeners[index])
                input.addEventListener('change', callback)
                editMenuListeners.priorityListeners[index] = callback;
            })  
        }

        function handleCategoryButtonsEvents() {
            const $addToCategoryButtons = document.querySelectorAll('.add-to-category-button');

            function categoryAdd(event) {
                const button = event.target;
                if(!todoInterface.isTodoInCategory($todoEditMenu.dataset.id, button.dataset.id)) {
                    button.disabled = true;
                    todoInterface.addToMainCategory(button.dataset.id);      
                }
            } 
    
            function handleCategoryAdd(e) {
                categoryAdd(e);
            }

            $addToCategoryButtons.forEach((button, index) => {
                button.disabled = todoInterface.isTodoInCategory($todoEditMenu.dataset.id, button.dataset.id);
                button.removeEventListener('click', editMenuListeners.categoryButtonsListeners[index])
                button.addEventListener('click', handleCategoryAdd)
                editMenuListeners.categoryButtonsListeners[index] = handleCategoryAdd;
            })
        }

        function handleDeleteButtonEvent() {
            const $deleteTodoButton = $todoEditMenu.querySelector('.delete-todo-button');
            
            function callback () { 
                todoInterface.removeEditingTodo();
                hideAndUnhighlight();
                updateTodos();
            }

            if(!$deleteTodoButton.hasAttribute('data-event-bound')) {
                $deleteTodoButton.addEventListener('click', callback)
                $deleteTodoButton.setAttribute('data-event-bound', true);
            }
        }

        function handleCategorySelectEvents() {
            const $todoEditFields = $todoEditMenu.querySelector('.edit-fields');
            if(document.querySelectorAll('.custom-categories-list > *').length > 0) {
                if($todoEditFields.querySelector('select') !== null) { 
                    $todoEditFields.removeChild(document.querySelector('.custom-categories-container'));
                }
                const $optionsContainer = createCustomCategorySection();
                $todoEditFields.appendChild($optionsContainer);
            }
        }
        
        updateEditMenuFields();

        handleCheckboxEvent();
        handleTitleEvents();
        handleDescriptionEvent();
        handleDateEvent();
        handlePriorityEvent();
        handleCategoryButtonsEvents();
        handleCategorySelectEvents();
        handleDeleteButtonEvent();
    }

    function updateTitle() {
        const title = document.querySelector('h1');
        const categoryName = todoInterface.getCurrentCategoryName();
        title.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    }

    function changeCategory(categoryId) {
        todoInterface.switchCategory(categoryId);
        hideEditMenu();
        updatePage();
    }

    function displayCategoryPlaceholder() {
        hideAndUnhighlight();
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
            if(todoInterface.handleCategorySubmit($categoryButton)) {
                $categoryButton.addEventListener('click', () => {
                    changeCategory($categoryButton.dataset.id);
                })
            }
        }

        $categoryTitle.focus();
        addTextInputEvents($categoryTitle, submitCallback);
    }

    document.querySelector('.todo-edit').style.visibility = 'hidden';
    updatePage();

    return {
        changeCategory, 
        displayTodoPlaceholder,
        updateTodos,
        displayCategoryPlaceholder,
        hideAndUnhighlight
    }
})()

