
import fs from 'fs';
import "dotenv/config";

const filename = process.env.DB_FILE;

export default class DB {
    static createDB() {
        if (fs.existsSync(filename)) {
            console.log('DB file already exists.');
            return false;
        }
        try {
            fs.writeFileSync(filename, '[]', 'uft-8');
            console.log('DB file create successfully.');
            return true;
        } catch (error) {
            throw new Error('can not write in ' + filename)
        }
    }


    static resetDB() {
        try {
            fs.writeFileSync(filename, '[]', 'utf-8');

            return true;
        } catch (error) {
            throw new Error('cant write in ' + filename);
        }
    }
    static DBExists() {
        if (fs.existsSync(filename)) {
            return true;
        }
        else {
            return false;
        }
    }


    static getTaskById(id) {
        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, 'utf-8')
        } else {
            DB.createDB();
            return false
        }
        try {
            data = JSON.parse(data);
            const task = data.find((t) => t.id === Number(id));
            return task ? task : false;
        } catch (e) {
            throw new Error("syntax error.\nplease check the DB file. ")
        }

    }


    static getTaskByTitle(title) {
        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, 'utf-8')
        } else {
            DB.createDB();
            return false
        }
        try {
            data = JSON.parse(data);
            const task = data.find((t) => t.title === title);
            return task ? task : false;
        } catch (e) {
            throw new Error("syntax error.\nplease check the DB file. ")
        }

    }


    static getAllTask() {
        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, 'utf-8')
        } else {
            DB.createDB();
            return false
        }
        try {
            data = JSON.parse(data);
            return data;
        } catch (e) {
            throw new Error("syntax error.\nplease check the DB file. ")
        }

    }

    static saveTask(title, completed = false, id = 0) {
        id = Number(id);
        if (id < 0 || id !== parseInt(id)) {
            throw new Error("id must  be an integer ,equal or greater than zero.")
        } else if (typeof title !== "string" || title.length < 3) {
            throw new Error("title most contain at least 3 letters.")
        }
        const task = DB.getTaskByTitle(title);
        if (task && task.id != id) {
            throw new Error("a task exists whith this title.")
        }
        let data;
        if (DB.DBExists()) {
            data = fs.readFileSync(filename, 'utf-8')
        } else {
            try {
                DB.createDB();
                data = "[]";
            } catch (e) {
                throw new Error(e.message);
            }
        }
        try {
            data = JSON.parse(data);
        } catch (error) {
            throw new Error("syntax erro.\nplease check the DB file.")

        }
        if (id === 0) {
            if (data.length === 0) {
                id = 1
            } else {
                id = data[data.length - 1].id + 1;
            }
            data.push({
                id,
                title,
                completed,
            });
            const str = JSON.stringify(data, null, "    ");
            try {
                fs.writeFileSync(filename, str, 'utf-8');
                return id;
            } catch (e) {
                throw new Error("can not save the task.");

            }

        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    data[i].title = title;
                    data[i].completed = completed;

                    const str = JSON.stringify(data, null, "    ");
                    try {
                        fs.writeFileSync(filename, str, 'utf-8');
                        return id;
                    } catch (e) {
                        throw new Error("can not save the task.");
                    }
                }
            }
            throw new Error("task not found.")
        }


    }



    static deleteTassk(id) {
        id = Number(id);
        if (id > 0 && id === parseInt(id)) {
            let data;
            try {
                data = fs.readFileSync(filename, 'utf-8');
                data = JSON.parse(data);

            } catch (e) {
                throw new Error("can not read DB file")
            }
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    data.splice(i, 1);
                    data = JSON.stringify(data, null, "    ");

                    try {
                        fs.writeFileSync(filename, data, 'utf-8');

                        return true
                    } catch (e) {
                        throw new Error("can not write in DB file.")
                    }
                }
            }

            return false;
        } else {
            throw new Error("Task id must be a positive integer.")
        }
    }

    static insertBulkData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data)
            } catch (e) {
                throw new Error("invalide data.");

            }
        }
        if (data instanceof Array) {
            data = JSON.stringify(data, null, "    ")
        } else {
            throw new Error("Invalid data.");
        }

        try {
            fs.writeFileSync(filename, data);

        } catch (e) {
            throw new Error("can not write to DB file.")
        }
    }
}