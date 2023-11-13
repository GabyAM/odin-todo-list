import { todoController } from "./todoList.js";

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
function changeCategoryScreen(categoryName) {
    document.querySelector('.todo-list').innerHTML = '';
    todoController.switchCategory(categoryName);
}

const $categoryButtons = document.querySelectorAll('aside ul button');
$categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        console.log('kaching!')
        changeCategoryScreen(button.dataset.category);
    })
})

export {displayCategory};