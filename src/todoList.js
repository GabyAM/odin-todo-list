import { Todo } from "./todo.js";

function createCategory(name) {
    let todos = [];
    const id = crypto.randomUUID();

    function getName () {
        return name;
    }

    function getId() {
        return id;
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

    return {getName, addTodo, removeTodo, editTodo, getTodos, getTodoById, hasTodo, getId}
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

    function getCategoryById(id) {
        return todos.find(category => category.getId() === id)
    }

    function getAllCategory() {
        return allCategory;
    }

    function getUpcomingCategory() {
        return upcomingCategory;
    }

    function getImportantCategory() {
        return importantCategory;
    }

    function addCategory(name) {
        const newCategory = createCategory(name);
        todos.push(newCategory);
        return newCategory;
    }

    return { 
        addTodo,
        removeTodo, 
        editTodo,
        getAllCategory,
        getUpcomingCategory,
        getImportantCategory,
        getCategoryByName, 
        getCategoryById,
        addCategory
    }
})()

export const mainCategoriesIDs = {
    all: todo.getAllCategory().getId(),
    upcoming: todo.getUpcomingCategory().getId(),
    important: todo.getImportantCategory().getId()
}

export const todoController = (function() {
    
    let currentCategory;
    switchCategory(todo.getAllCategory().getId());

    function addTodo(newTodo) {
        todo.addTodo(currentCategory, newTodo);
        const allCategory = todo.getAllCategory();
        if(currentCategory.getId() !== allCategory.getId()) {
            allCategory.addTodo(newTodo);
            newTodo.isDynamic = true;
        }
    }

    function removeTodoFromCategory(id, categoryId = getCurrentCategoryId()) {
        if(categoryId === getCurrentCategoryId()) {
            currentCategory.removeTodo(id);
        } else {
            todo.getCategoryById(categoryId).removeTodo(id);
        }
    }

    function updateTodoDate(id, newDate, isUpcoming) {
        const listTodo = currentCategory.getTodoById(id);
        const upcomingCategory = todo.getUpcomingCategory();
        listTodo.dueDate = newDate;
        if(isUpcoming && !upcomingCategory.hasTodo(id)) {
            upcomingCategory.addTodo(listTodo);
            listTodo.isDynamic = true;
        }
        else if(listTodo.isDynamic && !isUpcoming && upcomingCategory.hasTodo(id)) {
            upcomingCategory.removeTodo(id);
        }
    }

    function updateTodoPriority(id, newPriority) {
        const listTodo = currentCategory.getTodoById(id);
        const importantCategory = todo.getImportantCategory();
        listTodo.priority = newPriority;
        if(newPriority === 'high' && !importantCategory.hasTodo(id)) {
            importantCategory.addTodo(listTodo);
            listTodo.isDynamic = true;
        }
        else if(listTodo.isDynamic && newPriority !== 'high' && importantCategory.hasTodo(id)) {
            importantCategory.removeTodo(id);
        }
    }

    function switchCategory(id) {
        currentCategory = todo.getCategoryById(id);
    }

    function getCurrentCategoryId() {
        return currentCategory.getId();
    }

    function getCurrentCategoryName() {
        return currentCategory.getName(); //used in title
    }

    function getTodos() {
        return currentCategory.getTodos();
    }

    function getTodoById(id) {
        return currentCategory.getTodoById(id);
    }

    function addCategory(name) {
        return todo.addCategory(name);

    }

    function addTodoToCategory(listTodo, categoryId = null) {
        const category = categoryId === null ? currentCategory : todo.getCategoryById(categoryId);
        category.addTodo(listTodo);
    }

    function isTodoInCategory(todoId, categoryId) {
        const category = todo.getCategoryById(categoryId);
        return category.hasTodo(todoId);
    }

    addTodo(new Todo('todo 1', '', false, '', ''));
    addTodo(new Todo('todo 2', '', true, '', ''));

    return {
        removeTodoFromCategory,
        addTodoToCategory,
        switchCategory, 
        getCurrentCategoryId,
        getCurrentCategoryName,
        getTodos, 
        getTodoById,
        addCategory,
        updateTodoDate,
        updateTodoPriority,
        isTodoInCategory
    }
})()

