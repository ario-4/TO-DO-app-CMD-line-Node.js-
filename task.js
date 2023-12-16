import util from 'util';

import chalk from 'chalk';

import DB from './db.js';


export default class Task {
    #id = 0;
    #title;
    #completed;
    constructor(title, completed = false) {
        this.title = title;
        this.completed = completed;
    }
    get id() {
        return this.#id
    }

    get title() {
        return this.#title
    }

    get completed() {
        return this.#completed;
    }

    set title(value) {
     
        this.#title = value;

    }

    set completed(value) {
        this.#completed = Boolean(value);
    }
    [util.inspect.custom]() {
        return `Task{
            id:  ${chalk.yellowBright(this.id)}
            title:  ${chalk.green('"' + this.title + '"')}
            completed:  ${chalk.blueBright(this.completed)}
        }`;
    }

    save() {
        try {
            let id = DB.saveTask(this.#title, this.#completed, this.#id);
            this.#id = id
        } catch (e) {
            throw new Error(e.message);

        }
    }


    static getTaskById(id) {
        const task = DB.getTaskById(id);
        if (task) {
            const item = new Task(this.title, this.completed);
            item.#id = task.id;
            return item;

        } else {
            return false
        }
    }


    static getTaskByTitle(title) {
        const task = DB.getTaskByTitle(title);
        if (task) {
            const item = new Task(this.title, this.completed);
            item.#id = task.id;
            return item;

        } else {
            return false;
        }
    }

    static getAllTask(){
        const tasks = DB.getAllTask();
        const items = [];
        for(let task of tasks){
            const item = new Task(task.title , task.completed);
            item.#id = task.id;
            items.push(item)
        }
        return items;
    } 



}