export class Todo {
    #id;
    constructor(title, description, completed, dueDate, priority ) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.dueDate = dueDate;
        this.priority = priority;
        this.#id = crypto.randomUUID();
        this.isDynamic = false;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    get id(){
        return this.#id;
    }
}