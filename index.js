const inquirer = require('inquirer');
const figlet = require('figlet');
const connection = require("./lib/SQL_login");
const commandMenuChoices = require('./lib/commandMenu');
const questions = require('./lib/questions');
const InquirerFunctions = require('./lib/inquirer');
const SQLquery = require('./lib/SQL_queries');

const inquirerTypes = ['input', 'confirm', 'list'];

console.log(figlet.textSync('Employee Management', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

mainMenu();

function mainMenu() {
    const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);
    
    inquirer.prompt([menuPrompt.ask()]).then(operation => {
        const query1 = "SELECT role.title FROM role";
        const compRolesArrayQuery = new SQLquery(query1);
        const depNameQuery = "SELECT department.name FROM department";
        const depNamesArrayQuery = new SQLquery(depNameQuery);

        switch (operation.menuChoice) {
            case commandMenuChoices[2]:
                return viewAllEmp();
            case commandMenuChoices[3]:
                depNamesArrayQuery.queryReturnResult(viewAllEmpDep);
                break;
            case commandMenuChoices[4]:
                const actionChoice5 = "VIEW BY MANAGER";
                dummyArr = [];
                EmpInfoPrompts(dummyArr, actionChoice5);
                break;
            case commandMenuChoices[5]:
                compRolesArrayQuery.getQueryNoRepeats(viewAllEmpRole);
                break;
            case commandMenuChoices[6]:
                return viewAllManager();
            case commandMenuChoices[11]:
                const actionChoice1 = "ADD";
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice1);
                break;
            case commandMenuChoices[12]:
                const actionChoice2 = "DELETE";
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice2);
                break;
            case commandMenuChoices[13]:
                const actionChoice3 = "UPDATE EMP ROLE";
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice3);
                break;
            case commandMenuChoices[14]:
                const actionChoice4 = "UPDATE EMP MANAGER";
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice4);
                break;
            case commandMenuChoices[1]:
                return viewAllRoles();
            case commandMenuChoices[9]:
                return addRole();
            case commandMenuChoices[10]:
                const actionChoice7 = "DELETE ROLE";
                compRolesArrayQuery.getQueryNoRepeats(deleteRole, actionChoice7);
                break;
            case commandMenuChoices[0]:
                return viewAllDep();
            case commandMenuChoices[7]:
                depNamesArrayQuery.queryReturnResult(addDep);
                break;
            case commandMenuChoices[8]:
                depNamesArrayQuery.queryReturnResult(removeDep);
                break;
        }
    });
}

function viewAllEmp() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                     FROM employee
                     INNER JOIN role on role.id = employee.role_id
                     INNER JOIN department on department.id = role.department_id;`

    const empTable = new SQLquery(query);
    empTable.generalTableQuery(mainMenu);
}

function viewAllEmpDep(depNamesArray) {
    const departmentNamePrompt = new InquirerFunctions(inquirerTypes[2], 'department_Name', questions.viewAllEmpByDep, depNamesArray);
    
    inquirer.prompt(departmentNamePrompt.ask()).then(userResp => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                        FROM employee
                        INNER JOIN role on role.id = employee.role_id
                        INNER JOIN department on department.id = role.department_id AND department.name = ? ;`

        const empByDepTable = new SQLquery(query, userResp.department_Name);
        empByDepTable.generalTableQuery(mainMenu);
    });
}

function viewAllEmpManager(managerObj, namesArr) {
    const chosenManager = new InquirerFunctions(inquirerTypes[2], 'manager_choice', questions.searchByManager, namesArr);

    inquirer.prompt([chosenManager.ask()]).then(userChoice => {
        console.log(`Manager Searched By: ${userChoice.manager_choice}`);
        let chosenManagerID = 0;
        const chosenManagerName = userChoice.manager_choice.split(" ", 2);

        for (manager of managerObj) {
            if (chosenManagerName[1] == manager.lastName) {
                chosenManagerID = manager.ID;
            }
        }

        const queryManagerSearch = `SELECT employee.last_name, employee.first_name, role.title, department.name
                                    FROM employee
                                    INNER JOIN role on role.id = employee.role_id
                                    INNER JOIN department on department.id = role.department_id
                                    WHERE employee.manager_id = (?) `

        const managerSearch = new SQLquery(queryManagerSearch, chosenManagerID);
        managerSearch.generalTableQuery(mainMenu);
    });
}

function viewAllEmpRole(compRoles, actionChoice) {
    const rolePrompt = new InquirerFunctions(inquirerTypes[2], 'role_Title', questions.viewAllEmpByRole, compRoles);
    inquirer.prompt(rolePrompt.ask()).then(userResp => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                        FROM employee 
                        INNER JOIN role on role.id = employee.role_id AND role.title = (?)
                        INNER JOIN department on department.id = role.department_id;`;

        const empByRoleTable = new SQLquery(query, userResp.role_Title);
        empByRoleTable.generalTableQuery(mainMenu);
    });
}

function viewAllManager() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, department.name
                    FROM employee
                    INNER JOIN role on role.id = employee.role_id
                    INNER JOIN department on department.id = role.department_id
                    WHERE employee.id IN ( SELECT employee.manager_id FROM employee );`;

    const managerTable = new SQLquery(query);
    managerTable.generalTableQuery(mainMenu);
}

function EmpInfoPrompts(compRoles, actionChoice) {
    const query = "SELECT id, first_name, last_name FROM employee WHERE employee.id IN ( SELECT employee.manager_id FROM employee )";
    connection.query(query, function (err, res) {
        if (err) throw err;
        let managerNamesArr = [];
        let managerObjArr = [];
        for (let i = 0; i < res.length; i++) {
            let name = res[i].first_name + " " + res[i].last_name;
            let managersobj = {
                ID: res[i].id,
                firstName: res[i].first_name,
                lastName: res[i].last_name
            }
            managerObjArr.push(managersobj);
            managerNamesArr.push(name);
        }
        const first_name = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
        const last_name = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2);
        const role_id = new InquirerFunctions(inquirerTypes[2], 'role_id', questions.addEmployee3, compRoles);
        const manager_id = new InquirerFunctions(inquirerTypes[2], 'manager_id', questions.addEmployee4, managerNamesArr);

        inquirer.prompt([first_name.ask(), last_name.ask(), role_id.ask(), manager_id.ask()]).then(userResp => {
            let newEmp = [userResp.first_name, userResp.last_name, userResp.role_id];
            let chosenManagerID = 0;
            for (manager of managerObjArr) {
                if (userResp.manager_id == manager.firstName + " " + manager.lastName) {
                    chosenManagerID = manager.ID;
                }
            }
            newEmp.push(chosenManagerID);
            if (actionChoice == "ADD") {
                SQLquery.prototype.addQuery(newEmp);
            }
            if (actionChoice == "DELETE") {
                SQLquery.prototype.deleteQuery(newEmp);
            }
            if (actionChoice == "UPDATE EMP ROLE") {
                SQLquery.prototype.updateQuery(newEmp, actionChoice);
            }
            if (actionChoice == "UPDATE EMP MANAGER") {
                SQLquery.prototype.updateQuery(newEmp, actionChoice);
            }
        });
    });
}

function viewAllRoles() {
    const query = `SELECT role.id, role.title, department.name, role.salary
                     FROM role
                     INNER JOIN department on department.id = role.department_id;`;

    const roleTable = new SQLquery(query);
    roleTable.generalTableQuery(mainMenu);
}

function addRole() {
    const depNameQuery = "SELECT department.name FROM department";
    const depNamesArrayQuery = new SQLquery(depNameQuery);

    depNamesArrayQuery.queryReturnResult((depNamesArray) => {
        const roleName = new InquirerFunctions(inquirerTypes[0], 'title', questions.addRole1);
        const roleSalary = new InquirerFunctions(inquirerTypes[0], 'salary', questions.addRole2);
        const roleDepartment = new InquirerFunctions(inquirerTypes[2], 'department_id', questions.addRole3, depNamesArray);

        inquirer.prompt([roleName.ask(), roleSalary.ask(), roleDepartment.ask()]).then(userResp => {
            const query = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ?, (SELECT id FROM department WHERE name = ?));`;

            const roleToAdd = [userResp.title, userResp.salary, userResp.department_id];
            const addRoleQuery = new SQLquery(query, roleToAdd);
            addRoleQuery.addQuery();
        });
    });
}

function deleteRole(compRoles, actionChoice) {
    const query = "SELECT role.id, role.title, department.name FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        let rolesNamesArr = [];
        let rolesObjArr = [];
        for (let i = 0; i < res.length; i++) {
            let name = res[i].title + " in " + res[i].name;
            let rolesobj = {
                ID: res[i].id,
                title: res[i].title,
                depName: res[i].name
            }
            rolesObjArr.push(rolesobj);
            rolesNamesArr.push(name);
        }
        const roleChoice = new InquirerFunctions(inquirerTypes[2], 'role_id', questions.deleteRole, rolesNamesArr);

        inquirer.prompt([roleChoice.ask()]).then(userResp => {
            let roleToDelete = [];
            let depID;
            for (role of rolesObjArr) {
                if (userResp.role_id == role.title + " in " + role.depName) {
                    depID = role.ID;
                }
            }
            roleToDelete.push(depID);
            if (actionChoice == "DELETE ROLE") {
                SQLquery.prototype.deleteQuery(roleToDelete, actionChoice);
            }
        });
    });
}

function viewAllDep() {
    const query = "SELECT department.id, department.name FROM department";
    const depTable = new SQLquery(query);
    depTable.generalTableQuery(mainMenu);
}

function addDep(depNamesArray) {
    const newDepName = new InquirerFunctions(inquirerTypes[0], 'name', questions.addDep);
    
    inquirer.prompt([newDepName.ask()]).then(userResp => {
        const query = `INSERT INTO department (name) VALUES (?);`;
        const depToAdd = [userResp.name];
        const addDepQuery = new SQLquery(query, depToAdd);
        addDepQuery.addQuery();
    });
}

function removeDep(depNamesArray) {
    const depNameToRemove = new InquirerFunctions(inquirerTypes[2], 'department_Name', questions.removeDep, depNamesArray);
    
    inquirer.prompt([depNameToRemove.ask()]).then(userResp => {
        const query = `DELETE FROM department WHERE name = ?;`;
        const depToRemove = [userResp.department_Name];
        const removeDepQuery = new SQLquery(query, depToRemove);
        removeDepQuery.deleteQuery();
    });
}
