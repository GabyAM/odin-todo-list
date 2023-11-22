import { displayModule } from "./display.js";
import { mainCategoriesIDs } from "./todoList.js";

const $addTodoButton = document.querySelector('.add-todo-button');
$addTodoButton.addEventListener('click', () => {
    displayModule.displayTodoPlaceholder();
})

function assignIdToMainCategories() {
    const domAll = document.querySelector('.main-categories-list button:first-child');
    domAll.dataset.id = mainCategoriesIDs.all;
    const domUpcoming = document.querySelector('.main-categories-list button:nth-child(2)');
    domUpcoming.dataset.id = mainCategoriesIDs.upcoming;
    const domImportant = document.querySelector('.main-categories-list button:last-child');
    domImportant.dataset.id = mainCategoriesIDs.important;

    const addToUpcomingButton = document.querySelector('.upcoming');
    addToUpcomingButton.dataset.id = domUpcoming.dataset.id;
    const addToImportantButton = document.querySelector('.important');
    addToImportantButton.dataset.id = domImportant.dataset.id;
}
assignIdToMainCategories();

const $categoryButtons = document.querySelectorAll('aside ul button');
$categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        displayModule.changeCategory(button.dataset.id);
    })
})

const $addCategoryButton = document.querySelector('.add-category-button');
$addCategoryButton.addEventListener('click', () => {
    displayModule.displayCategoryPlaceholder();
})

const $closeEditMenuButton = document.querySelector('.close-menu-button');
$closeEditMenuButton.addEventListener('click', () => {
    displayModule.hideAndUnhighlight();
})


