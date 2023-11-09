class Todo {
    constructor(title, description, completed, dueDate, priority ) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.dueDate = dueDate;
        this.priority = priority; 
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}