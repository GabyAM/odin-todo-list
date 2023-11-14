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

    return {getName, addTodo, removeTodo, editTodo, getTodos}
}

export const todo = (function() {
    const todayCategory = createCategory('today');
    const weekCategory = createCategory('week');
    const importantCategory = createCategory('important');

    let todos = [
        todayCategory,
        weekCategory,
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
    switchCategory('today');

    function addTodo(newTodo) {
        todo.addTodo(currentCategory, newTodo);
    }

    function editTodo(todo) { //Placeholder! will use the ID here
        
    }

    function switchCategory(categoryName) {
        currentCategory = todo.getCategoryByName(categoryName);
    }

    function getTodos() {
        return currentCategory.getTodos();
    }

    addTodo(new Todo('todo 1', '', false, '', ''));
    addTodo(new Todo('todo 2', '', true, '', ''));

    return {addTodo, editTodo, switchCategory, getTodos}
})()

