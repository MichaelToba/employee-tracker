const mysql = require("mysql");
const connection = require("./SQL_login");
const asTable = require('as-table').configure({ delimiter: ' | ', dash: '-' });

class MySQLQueries {

    constructor(query, values) {
        this.query = query;
        this.values = values;
    }

    runGeneralTableQuery(nextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err;
            console.log("\n");
            console.log(asTable(res));
            console.log("\n");
            nextStep();
        });
    }

    runQueryNoRepeats(nextStep, parameterToPassToNextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err;
            let titleArr = [];
            for (let i = 0; i < res.length; i++) {
                if (!titleArr.includes(res[i].title)) {
                    titleArr.push(res[i].title);
                }
            }
            nextStep(titleArr, parameterToPassToNextStep);
        });
    }

    runDeleteQuery(nextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err;
            console.log("Delete Successful!");
            nextStep();
        });
    }

    runUpdateQuery(nextStep, message) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err;
            console.log(message);
            nextStep();
        });
    }

    runQueryReturnResult(nextStep) {
        connection.query(this.query, this.values, function (err, res) {
            if (err) throw err;
            nextStep(res);
        });
    }
}

module.exports = MySQLQueries;
