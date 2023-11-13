
function createTodo(todo = '') {
    const $listItem = document.createElement('li');
    const $todoText = document.createElement('input');
    $todoText.type = 'text';
    $todoText.value = todo;
    
    $listItem.appendChild($todoText);
    return $listItem
}

function displayCategory(category) {
    const $list = document.querySelector('.todo-list');
    category.getTodos().forEach(todo => {
        const $listTodo = createTodo(todo);
        $list.appendChild($listTodo)
    })
}
export {displayCategory};