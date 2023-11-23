export class Todo {
    #id;
    constructor(title, description, completed, dueDate, priority, previousId = null, previousIsDynamic = null ) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.dueDate = dueDate;
        this.priority = priority;
        this.#id = previousId ? previousId : crypto.randomUUID();
        this.isDynamic = previousIsDynamic ? previousIsDynamic : false;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }

    get id(){
        return this.#id;
    }
}