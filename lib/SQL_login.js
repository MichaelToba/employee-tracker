const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "C0d!ng101520",
    database: "employee_management_db"

});

module.exports = connection;