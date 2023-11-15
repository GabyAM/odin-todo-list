//import { displayModule } from "./display.js";
import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";

export const todoInterface = (function () {

    function handleTodoSubmit(domTodo) {
        const todoTitle = domTodo.children[0];

        function addNewTodo() {
            const newTodo = new Todo(todoTitle.value, '', false, '', '');
            todoController.addTodo(newTodo);
        }
    
        function updateTodoTitle() {
            const id = domTodo.dataset.id;
    
            const todoToEdit = todoController.getTodoById(id);
            if(todoToEdit) {
                todoToEdit.title = todoTitle.value;
            } else {
                throw new Error("can't find the todo by id on the list")
            }
        }

        if(domTodo.dataset.id) {
            updateTodoTitle();
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

    return { handleTodoSubmit, handleCompletedChange }
})()