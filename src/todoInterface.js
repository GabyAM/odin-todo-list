import {compareAsc, parseISO} from 'date-fns';

import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";
import { isDateUpcoming } from './utilities.js';

export const todoInterface = (function () {

    function updateTodoTitle(todoTitle, id) {
        const todoToEdit = todoController.getTodoById(id);
        if(todoToEdit) {
                todoToEdit.title = todoTitle;
        } else {
            throw new Error("can't find the todo by id on the list")
        }
    }

    function editTitle(title, id) {
        if(title.value !== '' && !isPreviousTitle(title.value, id)) {
            updateTodoTitle(title.value, id);
            return true
        } else if(title.value === '') {
            title.value = getPreviousTitle(id);
        }
        return false
    }

    function getPreviousTitle(id) {
        return todoController.getTodoById(id).title;
    }

    function isPreviousTitle(newTitle, id) {
        const previousTitle = getPreviousTitle(id);
        return newTitle === previousTitle;
    }

    function handleTodoSubmit(domTodo) {
        const todoTitle = domTodo.querySelector('.todo-title');

        function addNewTodo() {
            const newTodo = new Todo(todoTitle.value, '', false, '', '');
            todoController.addTodoToCategory(newTodo);
        }

        if(domTodo.dataset.id) {
            return editTitle(todoTitle, domTodo.dataset.id);
        }
        else {
            domTodo.classList.remove('placeholder');
            if(todoTitle.value !== '') {
                addNewTodo();
                return true
            } else {
                document.querySelector('.todo-list').removeChild(domTodo);
                return false;
            }
        }
    }

    function handleCategorySubmit(domCategory) {
        const $categoryTitle = domCategory.querySelector('input');
        const $categoryListItem = domCategory.querySelector('li');

        if($categoryTitle.value !== '') {
            const category = todoController.addCategory($categoryTitle.value);


            domCategory.dataset.category = category.getName();
            domCategory.dataset.id = category.getId();

            //replace input by h3
            $categoryListItem.removeChild($categoryTitle);
            const setTitle = document.createElement('h3');
            setTitle.textContent = domCategory.dataset.category;
            $categoryListItem.appendChild(setTitle);
            return true
        } else {
            document.querySelector('.custom-categories-list').removeChild(domCategory);
            return false
        }
    }

    function handleCompletedChange(id) {
        const todoInList = todoController.getTodoById(id);
        todoInList.toggleCompleted();
    }

    function handleDescriptionChange(id, newDescription) {
        const todo = todoController.getTodoById(id);
        if(todo.description !== newDescription) {
            todo.description = newDescription;
        }
    }

    function handleDateChange(id, newDueDate) {
        todoController.updateTodoDate(id, newDueDate, isDateUpcoming(newDueDate));
    }

    function handlePriorityChange(id, priority) {
        todoController.updateTodoPriority(id, priority)
    }

    function sortListByDueDate(todoList) {
        todoList.sort((a, b) => compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)));
    }

    function isTodoInCategory(todoId, categoryId) {
        return todoController.isTodoInCategory(todoId, categoryId);
    }

    function moveTodoToCategory(todoId, categoryId) {
        const todo = todoController.getTodoById(todoId);
        todoController.addTodoToCategory(todo, categoryId);
        todoController.removeTodoFromCategory(todoId);
    }

    function wasListModified(previousLength) {
        return previousLength !== getTodos().length;
    }

    function addToMainCategory(categoryId) {
        const todoId = document.querySelector('.todo-edit').dataset.id;
        const listTodo = todoController.getTodoById(todoId);

        todoController.addTodoToCategory(listTodo, categoryId);
    }

    function getTodos() {
        return todoController.getCurrentCategory().getTodos();
    }

    function getCurrentCategoryName() {
        return todoController.getCurrentCategory().getName();
    }

    function getCurrentCategoryId() {
        return todoController.getCurrentCategory().getId();
    }

    function getEditingTodo() {
        const id = document.querySelector('.todo-edit').dataset.id;
        return todoController.getTodoById(id);
    }

    function removeEditingTodo() {
        todoController.removeTodoFromCategory(getEditingTodo().id);
    }

    function switchCategory(categoryId) {
        if(categoryId !== getCurrentCategoryId()) {
            todoController.switchCategory(categoryId);
        }
    }

    return { 
        handleTodoSubmit,
        handleCategorySubmit, 
        editTitle, 
        handleCompletedChange, 
        handleDescriptionChange,
        handleDateChange, 
        handlePriorityChange,
        sortListByDueDate,
        isTodoInCategory,
        moveTodoToCategory,
        wasListModified,
        addToMainCategory,
        getTodos,
        getCurrentCategoryName,
        getCurrentCategoryId,
        getEditingTodo,
        removeEditingTodo,
        switchCategory
     }
})()