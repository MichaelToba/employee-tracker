const inquirer = require("inquirer");

class MyInquirer {
    constructor(type, name, message, choices) {
        this.type = type;
        this.name = name;
        this.message = message;
        this.choices = choices;
    }

    createQuestion() {
        const question = {
            type: this.type,
            name: this.name,
            message: this.message
        };

        if (this.choices !== undefined) {
            question.choices = this.choices;
        }

        return question;
    }
}

module.exports = MyInquirer;
