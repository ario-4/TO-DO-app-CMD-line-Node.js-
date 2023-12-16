import fs, { access } from 'fs';

import chalk from 'chalk';
import inquirer from 'inquirer';
import axcios from 'axios';
import { parse as parseSync, stringify as stringifySync } from "csv/sync";

import DB from './db.js';
import Task from './task.js';

const error = chalk.redBright.bold;
const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class Action {
    static list() {
        const tasks = DB.getAllTask();
        if (tasks.length) {
            console.table(tasks);
        } else {
            console.log(warn("there is not any task"));
        }
    }
    static async add() {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Entre task title. ",
                validate: (value) => {
                    if (value.length < 3) {
                        return warn("The title be must contain at 3 letters.")
                    }
                    return true;
                }
            }, {
                type: "confirm",
                name: "completed",
                message: "Is this task completed?",
                default: false
            }
        ])
        try {
            const task = new Task(answers.title, answers.completed);
            task.save();
        } catch (e) {
            console.log(error(e.message));

        }

    }
    static async delete() {
        const tasks = Task.getAllTask();
        const choices = [];

        for (let task of tasks) {
            choices.push(task.title)

        }
        const answer = await inquirer.prompt({
            type: "list",
            name: "title",
            message: "select the task to delete",
            choices
        });
        const task = Task.getTaskByTitle(answer.title);

        try {

            DB.deleteTassk(task.id);
            console.log(success("selected task deleted successfully"));
        } catch (e) {
            console.log(e.message);
        }

    }


    static async deleteAll() {

        const answer = await inquirer.prompt({
            type: "confirm",
            name: "result",
            message: "are you sure for delete all tasks?"

        });
        if (answer.result) {
            try {
                DB.resetDB();
                console.log(success("All tasks deleted successfuly"));
            } catch (e) {
                console.log(error(e.message));
            }
        }
    }

    static async edit() {
        const tasks = Task.getAllTask();
        const choices = [];

        for (let task of tasks) {
            choices.push(task.title)

        }

        const selectedTassk = await inquirer.prompt({
            type: "list",
            name: "title",
            message: "select a task to edit",
            choices
        });

        const task = Task.getTaskByTitle(selectedTassk.title);

        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Entre task title",
                default: selectedTassk.title
            },
            {
                type: "confirm",
                name: "completed",
                message: "Is this task completed?",
                default: false
            }
        ]);
        console.log(task.id);
        console.log(answers.title);
        console.log(answers.completed);

        try {
            DB.saveTask(answers.title, answers.completed, task.id);
            console.log(success("selected task edited successfuly."));
        } catch (e) {
            console.log(error(e.message));
        }
    }
    static async export() {
        const answer = await inquirer.prompt({
            type: "input",
            name: "filename",
            message: "intre output filename",
            validate: (value) => {
                if (!/^[\w .-]{1,50}$/.test(value)) {
                    return "please entre a valid filename."
                } else {

                    return true;
                }

            }
        });
        const tasks = DB.getAllTask();
        const output = stringifySync(tasks, {
            header: true,
            cast: {
                boolean: (value, context) => {
                    return String(value)
                },
            },
        });
        try {
            answer.filename = answer.filename + ".csv"
            fs.writeFileSync(answer.filename, output);
            console.log(success("Tasks exported successfully"));
        } catch (e) {
            console.log(error("can not write to " + answer.filename));
        }
    }

    static async import() {
        const answer = await inquirer.prompt({
            type: "input",
            name: "filename",
            message: "Entre input filename."
        });

        if (fs.existsSync(answer.filename)) {

            try {
                const input = fs.readFileSync(answer.filename);
                const data = parseSync(input, {
                    columns: true,
                    cast: (value, context) => {
                        if (context.column === "id") {
                            return Number(value);

                        }
                        else if (context.column === "completed") {
                            return value.toLowerCase() === "true" ? true : false;
                        }
                        return value;
                    }

                });
                DB.insertBulkData(data);
                console.log(success("data imported successfully."));
            } catch (e) {
                console.log(error(e.message));
            }
        } else {
            console.log(error("Specified file does not exists."));
        }
    }

}