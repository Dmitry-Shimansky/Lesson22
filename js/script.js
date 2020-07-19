'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDOList')));
        console.log(this.todoData);
    }

    addToStorage() {
        localStorage.setItem('toDOList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>`);

        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }


    addTodo (e) {
        e.preventDefault();

        if (this.input.value.trim() !='') {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        } else {
            alert('Пустое дело добавить нельзя!');
            this.input.value = '';
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(parent) {

        this.todoData.delete(parent);

        this.render();
    }

    completeItem(parent) {

        const changeObj = this.todoData.get(parent);
        if (changeObj.completed) {
            changeObj['completed'] = false;
        } else {
            changeObj['completed'] = true;
        }
        //this.todoData.set(parent, changeObj);

        this.render();
    }

    handler () {
        const btns = document.querySelector('.todo-container');

        btns.addEventListener('click', (event) => {
            const target = event.target;

            if (target.className !== 'todo-remove' && target.className !== 'todo-complete') {
                return;
            }

            const parent = target.closest('.todo-item').key;

            if (target.className === 'todo-remove') {

                this.deleteItem(parent);
            } else {
                this.completeItem(parent);
            } 
        });
}

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }

}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');


todo.init();
todo.handler();
