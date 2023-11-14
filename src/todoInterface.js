import { Todo } from "./todo.js";
import { todoController } from "./todoList.js";

export const todoInterface = (function () {

    function handleTodoSubmit(domTodo) {
        const todoTitle = domTodo.children[0];

        function addNewTodo() {
            const newTodo = new Todo(todoTitle.value, '', false, '', '');
            todoController.addTodo(newTodo);
            domTodo.dataset.id = newTodo.id;
        }
    
        function editExistingTodo() {
            const id = domTodo.dataset.id;
    
            const todoToEdit = todoController.getTodoById(id);
            todoToEdit.title = todoTitle.value;
        }

        if(domTodo.classList.contains('placeholder')) {
            domTodo.classList.remove('placeholder');
            document.querySelector('.todo-list').removeChild(domTodo);
            if(todoTitle.value !== '') {
                addNewTodo();
            }
        }
        else {
            editExistingTodo();
        }
    }

    return { handleTodoSubmit}
})()