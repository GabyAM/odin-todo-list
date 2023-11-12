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

    function getTodos () {
        return todos;
    }

    return {getName, addTodo, removeTodo, getTodos}
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
        todos[category].addTodo(todo);
    }

    function removeTodo(category, id) {
        todos[category] = todos.category.filter(todo => todo.id !== id);
    }   

    function editTodo(category, id, todo) {
        const todoIndex = todos[category].findIndex(todo => todo.id === id)
        todos[category][todoIndex] = todo;
    }

    function getCategoryByName(name) {
        return todos.find(category => category.getName() === name)
    }

    function getCategoryTodos(categoryName) {
        const category = getCategoryByName(categoryName);
        console.log()
        return category.getTodos()
    }

    return { addTodo, removeTodo, editTodo, getCategoryTodos}
})()

export const todoController = (function() {
    
    let currentCategory;
    switchCategory('today');

    function addTodo(todo) {
        todo.addTodo(currentCategory, todo);
    }

    function switchCategory(newCategory) {
        currentCategory = newCategory;
        displayCategory(currentCategory);
    }

    switchCategory('week')

    return {addTodo, switchCategory}
})()

