import { Todo } from "./todo.js";

function createCategory(name) {
    let todos = [];

    function getName () {
        return name;
    }

    function addTodo(todo) {
        todos.push(todo);
    }

    function removeTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
    }

    function editTodo(id, newTodo) {
        const todoIndex = todos.findIndex(todo => todo.id === id)
        todos[todoIndex] = newTodo;
    }

    function getTodos () {
        return [...todos];
    }

    function getTodoById(id) {
        return todos.find(todo => todo.id === id);
    }

    function hasTodo(id) {
        return getTodoById(id) !== undefined;
    }

    return {getName, addTodo, removeTodo, editTodo, getTodos, getTodoById, hasTodo}
}

export const todo = (function() {
    const allCategory = createCategory('all');
    const upcomingCategory = createCategory('upcoming');
    const importantCategory = createCategory('important');

    let todos = [
        allCategory,
        upcomingCategory,
        importantCategory
    ];

    function addTodo(category, todo) {
        category.addTodo(todo);
    }

    function removeTodo(category, id) {
        category.removeTodo(id);
    }   

    function editTodo(category, id, newTodo) {

        category.editTodo(id, newTodo);
    }

    function getCategoryByName(name) {
        return todos.find(category => category.getName() === name)
    }

    function addCategory(name) {
        const newCategory = createCategory(name);
        todos.push(newCategory);
    }

    return { 
        addTodo,
        removeTodo, 
        editTodo, 
        getCategoryByName, 
        addCategory
    }
})()

export const todoController = (function() {
    
    let currentCategory;
    switchCategory('all');

    function addTodo(newTodo) {
        todo.addTodo(currentCategory, newTodo);
        if(currentCategory.getName() !== 'all') {
            todo.addTodo(todo.getCategoryByName('all'), newTodo)
        }
    }

    function removeTodoFromCategory(id, categoryName = getCurrentCategoryName()) {
        if(categoryName === getCurrentCategoryName()) {
            currentCategory.removeTodo(id);
        } else {
            todo.getCategoryByName(categoryName).removeTodo(id);
        }
    }

    function updateTodoDate(id, newDate, isUpcoming) {
        const listTodo = currentCategory.getTodoById(id);
        const upcomingCategory = todo.getCategoryByName('upcoming');
        listTodo.dueDate = newDate;
        if(isUpcoming && !upcomingCategory.hasTodo(id)) {
            todo.addTodo(upcomingCategory, listTodo)
        }
    }

    function switchCategory(categoryName) {
        currentCategory = todo.getCategoryByName(categoryName);
    }

    function getCurrentCategoryName() {
        return currentCategory.getName();
    }

    function getTodos() {
        return currentCategory.getTodos();
    }

    function getTodoById(id) {
        return currentCategory.getTodoById(id);
    }

    function addCategory(name) {
        todo.addCategory(name);
    }

    addTodo(new Todo('todo 1', '', false, '', ''));
    addTodo(new Todo('todo 2', '', true, '', ''));

    return {
        addTodo,  
        addTodo,
        removeTodoFromCategory,
        addTodoToCategory,
        switchCategory, 
        getCurrentCategoryName,
        getTodos, 
        getTodoById,
        addCategory,
        updateTodoDate,
        isTodoInCategory
    }
})()

