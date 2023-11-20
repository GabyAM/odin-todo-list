//will use the cdn until i need to use webpack
import {compareAsc, parseISO} from 'https://cdn.jsdelivr.net/npm/date-fns@2.30.0/+esm';

//import { displayModule } from "./display.js";
import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";
import { isDateUpcoming } from './utilities.js';

export const todoInterface = (function () {

    function updateTodoTitle(id, todoTitle) {
        const todoToEdit = todoController.getTodoById(id);
        if(todoToEdit) {
            todoToEdit.title = todoTitle;
        } else {
            throw new Error("can't find the todo by id on the list")
        }
    }

    function handleTodoSubmit(domTodo) {
        const todoTitle = domTodo.querySelector('.todo-title');

        function addNewTodo() {
            const newTodo = new Todo(todoTitle.value, '', false, '', '');
            todoController.addTodo(newTodo);
        }

        if(domTodo.dataset.id) {
            updateTodoTitle(domTodo.dataset.id, todoTitle.value);
        }
        else {
            domTodo.classList.remove('placeholder');
            if(todoTitle.value !== '') {
                addNewTodo();
            } else document.querySelector('.todo-list').removeChild(domTodo);
        }
    }

    function handleCompletedChange(id) {
        const todoInList = todoController.getTodoById(id);
        todoInList.toggleCompleted();
    }

    function handleDateChange(id, newDueDate) {
        todoController.updateTodoDate(id, newDueDate, isDateUpcoming(newDueDate));
    }

    function sortListByDueDate(todoList) {
        todoList.sort((a, b) => compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)));
    }

    function isTodoInCategory(id, categoryName) {
        return todoController.isTodoInCategory(id, categoryName);
    }

    function moveTodoToCategory(id, categoryName) {
        todoController.addTodoToCategory(id, categoryName);
        todoController.removeTodoFromCategory(id, categoryName);
    }

    return { 
        handleTodoSubmit, 
        updateTodoTitle, 
        handleCompletedChange, 
        handleDateChange, 
        sortListByDueDate,
        isTodoInCategory,
        moveTodoToCategory
     }
})()