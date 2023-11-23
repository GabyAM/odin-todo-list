import { Todo } from "./todo.js";

function createCategory(name, previousId = null) {
    let todos = [];
    const id = previousId ? previousId : crypto.randomUUID();

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

    function getTodos () {
        return [...todos];
    }

    function getTodoById(id) {
        return todos.find(todo => todo.id === id);
    }

    function hasTodo(id) {
        return getTodoById(id) !== undefined;
    }

    return {getName, addTodo, removeTodo, getTodos, getTodoById, hasTodo, getId}
}

export const todo = (function() {

    let todos = loadState();
    const allCategory = todos[0];
    const upcomingCategory = todos[1];
    const importantCategory = todos[2];

    function addTodo(category, todo) {
        category.addTodo(todo);
        saveState();
    }

    function removeTodo(categoryId, todoId) {
        const category = getCategoryById(categoryId);
        category.removeTodo(todoId);
        saveState();
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
        saveState();
        return newCategory;
    }

    function saveState() {
        const serializedTodos = todos.map(category => {
            const serializedCategoryTodos = category.getTodos().map(todo => {
                return {
                    title: todo.title,
                    id: todo.id,
                    completed: todo.completed,
                    description: todo.description,
                    dueDate: todo.dueDate,
                    priority: todo.priority,
                    isDynamic: todo.isDynamic
                }
            })
            return {
                name: category.getName(),
                id: category.getId(),
                todos: serializedCategoryTodos
            }
        })

        localStorage.setItem('todos', JSON.stringify(serializedTodos));
    }

    function loadState() {
        const storageTodos = localStorage.getItem('todos');
        if(storageTodos) {
            const deserializedTodos = JSON.parse(storageTodos).map(category => {
                const deserializedCategoryTodos = category.todos.map(todo => {
                    return new Todo(
                        todo.title, 
                        todo.description,
                        todo.completed,
                        todo.dueDate,
                        todo.priority,
                        todo.id,
                        todo.isDynamic
                    );
                })
                const deserializedCategory = createCategory(category.name, category.id);
                deserializedCategoryTodos.forEach(todo => {
                    deserializedCategory.addTodo(todo);
                })
                return deserializedCategory;
            })
            return deserializedTodos;
        }
        return [
            createCategory('all'),
            createCategory('upcoming'),
            createCategory('important')
        ]
    }

    return { 
        addTodo,
        removeTodo, 
        getAllCategory,
        getUpcomingCategory,
        getImportantCategory,
        getCategoryByName, 
        getCategoryById,
        addCategory,
        saveState,
    }
})()

export const mainCategoriesIDs = {
    all: todo.getAllCategory().getId(),
    upcoming: todo.getUpcomingCategory().getId(),
    important: todo.getImportantCategory().getId()
}

export const todoController = (function() {
    
    let currentCategory = todo.getAllCategory();

    function removeTodoFromCategory(id, categoryId = currentCategory.getId()) {
        todo.removeTodo(categoryId, id); 
    }

    function updateTodoDate(id, newDate, isUpcoming) {
        const listTodo = currentCategory.getTodoById(id);
        const upcomingCategory = todo.getUpcomingCategory();
        listTodo.dueDate = newDate;
        if(isUpcoming && !upcomingCategory.hasTodo(id)) {
            todo.addTodo(upcomingCategory, listTodo);
            listTodo.isDynamic = true;
        }
        else if(listTodo.isDynamic && !isUpcoming && upcomingCategory.hasTodo(id)) {
            upcomingCategory.removeTodo(id);
            todo.saveState();
        }
    }

    function updateTodoPriority(id, newPriority) {
        const listTodo = currentCategory.getTodoById(id);
        const importantCategory = todo.getImportantCategory();
        listTodo.priority = newPriority;
        if(newPriority === 'high' && !importantCategory.hasTodo(id)) {
            todo.addTodo(importantCategory, listTodo);
            listTodo.isDynamic = true;
        }
        else if(listTodo.isDynamic && newPriority !== 'high' && importantCategory.hasTodo(id)) {
            importantCategory.removeTodo(id);
            todo.saveState();
        }
    }

    function switchCategory(id) {
        currentCategory = todo.getCategoryById(id);
    }

    function getCurrentCategory() {
        return currentCategory;
    }

    function getTodoById(id) {
        return currentCategory.getTodoById(id);
    }

    function addCategory(name) {
        return todo.addCategory(name);

    }

    function addTodoToCategory(newTodo, categoryId = null) {
        const category = categoryId === null ? currentCategory : todo.getCategoryById(categoryId);
        todo.addTodo(category, newTodo);
        const allCategory = todo.getAllCategory();
        if(category.getId() !== allCategory.getId()) {
            todo.addTodo(allCategory, newTodo);
            newTodo.isDynamic = true;
        }
    }

    function isTodoInCategory(todoId, categoryId) {
        const category = todo.getCategoryById(categoryId);
        return category.hasTodo(todoId);
    }

    return {
        removeTodoFromCategory,
        addTodoToCategory,
        switchCategory, 
        getCurrentCategory,
        getTodoById,
        addCategory,
        updateTodoDate,
        updateTodoPriority,
        isTodoInCategory,
    }
})()

