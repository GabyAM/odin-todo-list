//import { todoInterface } from "./todoInterface.js";
import { displayModule } from "./display.js";
//import { todoController } from "./todoList.js";

const $addTodoButton = document.querySelector('.add-todo-button');
$addTodoButton.addEventListener('click', () => {
    displayModule.displayTodoPlaceholder();
})

const $categoryButtons = document.querySelectorAll('aside ul button');
$categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        displayModule.changeCategory(button.dataset.category);
    })
})

const $addCategoryButton = document.querySelector('.add-category-button');
$addCategoryButton.addEventListener('click', () => {
    displayModule.displayCategoryPlaceholder();
})


