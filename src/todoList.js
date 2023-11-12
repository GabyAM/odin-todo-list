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

    return {getName, addTodo, removeTodo}
}

const todo = (function() {
    const importantCategory = createCategory('important');
    const upcomingCategory = createCategory('upcoming');

    let todos = {
        allCategory,
        importantCategory,
        upcomingCategory
    };

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

})()

