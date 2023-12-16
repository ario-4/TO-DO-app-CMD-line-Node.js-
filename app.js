console.clear();

import "dotenv/config"
import chalk from 'chalk';

import Action from './action.js';
import Task from "./task.js";

const command = process.argv[2];
const commands = [
    "list",
    "add",
    "delete",
    "delete-all",
    "edite",
    "export",
    "import",

];

const error = chalk.redBright.bold;
const warn = chalk.yellowBright.bold;

if (command) {
    if (command === "add") {
        Action.add();
    }
    else if (command === "list") {
        Action.list();
    }
    else if (command === "delete") {
        Action.delete();
    }
    else if (command === "delete-all") {
        Action.deleteAll();
    }
    else if (command === "edit") {
        Action.edit();
    }
    else if (command === "export") {
        Action.export();
    }
    else if (command === "import") {
        Action.import();
    }
    else if (command === "download") {
        Action.download();
    } else {
        const message = `${error("Unknown command")}
    Available command are:
    ${warn(commands.join("\n"))}`
        console.log(message);
    }

} else {
    const message = `${error("you must enter a command EX: node app add")}
    Available command are:
    ${warn(commands.join("\n"))}`
    console.log(message);

}



