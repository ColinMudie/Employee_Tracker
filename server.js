const express = require('express');
const mysql = require('mysql');
const inquirer = require('inquirer');
const figlet = require('figlet');
const cTable = require('console.table');
const app = express();
const PORT = process.env.PORT || 8080;

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_PW,
    database: 'employee_tracker_db'
});

connection.connect((err) => {
    if (err) {
        console.error(`error connection: ${err.stack}`);
        return;
    }
    // console.log(`connected as id ${connection.threadId}`);
    figlet('Employee Tracker', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
        initInquirer();
    });

    // addDepartments();
});

const questions = [
    {
        type: "list",
        name: "path",
        message: 'What would you like to do?',
        choices: [
            'Add Departments',
            'Add Roles',
            'Add Employees',
            'View Departments',
            'View Roles',
            'View Employees',
            'Update Employee Roles',
            'Update Employee\'s Manager',
            'View all Managers',
            'Delete Employee',
            'Delete Role',
            'Delete Department',
            'View combined salaries',
            'Exit'
        ]
    },
    {
        type: 'confirm',
        name: 'exit',
        message: 'Are you sure you want to exit the application?',
        when: (data) => (data.path).includes('Exit')
    }
]

const readAll = () => {
    connection.query(`SELECT first_name, last_name, title, salary, department.name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;`,
        (err, res) => {
            if (err) throw err;
            console.log('\b');
            console.table(res)
            console.log('\b');
        });
}

function initInquirer() {
    inquirer.prompt(questions).then((data) => {
        // console.log(data);
        switch (data.path) {
            case 'Add Departments':
                console.clear()
                readAll();
                createDepartments()
                break;

            case 'Add Roles':
                console.clear()
                readAll();
                createRoles();
                break;

            case 'Add Employees':
                console.clear()
                readAll();
                createEmployee();
                break;

            case 'View Departments':
                console.clear()
                readAll();
                readTable('department');
                break;

            case 'View Roles':
                console.clear()
                readAll();
                readTable('role');
                break;

            case 'View Employees':
                console.clear()
                readAll();
                readTable('employee');
                break;

            case 'Update Employee Roles':
                console.clear()
                readAll();
                updateRole();
                break;

            case 'Update Employee\'s Manager':
                console.clear()
                readAll();
                updateEmployeeManagers()
                break;

            case 'View all Managers':
                console.clear()
                readAll();
                readManagers();
                break;

            case 'Delete Employee':
                console.clear()
                readAll();
                deleteItem('employee')
                break;

            case 'Delete Role':
                console.clear()
                readAll();
                deleteItem('role')
                break;

            case 'Delete Department':
                console.clear()
                readAll();
                deleteItem('department')
                break;

            case 'View combined salaries':
                console.clear()
                readAll();
                totalBudget();
                break;

            case 'Exit':
                // connection.end();
                break;
            default:
                break;
        }
        if (data.exit === false){
            initInquirer()
        }
    })
}

//CREATE Department
const createDepartments = () => {
    
    // readAll();
    inquirer.prompt([
        {
            type: "input",
            name: "addDepartmentName",
            message: 'What is the name of the department you would like to add?\n'
        }
    ])
        .then((data) => {
            const query = connection.query(`INSERT INTO department SET ?`,
                {
                    name: data.addDepartmentName
                },
                (err, res) => {
                    if (err) throw err;
                    // console.log(`${res.affectedRows} product inserted!\n`);
                    // console.log(`--------------------`);
                    initInquirer();
                }
            )
            // console.log(query.sql);
        });
}

// CREATE Role
const createRoles = () => {
    // first READ departments for list
    const currentDepartments = [];
    connection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            currentDepartments.push({name: res[i].name, id: res[i].id})
        }
        //Create Role Prompt
        inquirer.prompt([
            {
                type: "input",
                name: 'title',
                message: "What is the name of the role you would like to add?",
            },
            {
                type: "input",
                name: 'salary',
                message: (data) => `What is the Salary for ${data.title}?`,
            },
            {
                type: "list",
                name: 'departmentId',
                message: (data) => `What department does the ${data.title} belong to?`,
                choices: currentDepartments
            }
        ]).then((data) => {
            let chosenDepartment;
            for (let i = 0; i < currentDepartments.length; i++) {
                if (currentDepartments[i].name === data.departmentId){
                    chosenDepartment = currentDepartments[i].id
                }
                
            }
            // console.log(chosenDepartment);
            const query = connection.query(`INSERT INTO role SET ?`,
                {
                    title: data.title,
                    salary: data.salary,
                    department_id: chosenDepartment
                },
                (err, res) => {
                    if (err) throw err;
                    // console.log(`${res.affectedRows} product inserted!\n`);
                    // console.log(`--------------------`);
                    initInquirer();
                }
            )
            // console.log(query.sql);
        })
    })
}

//CREATE Employee
const createEmployee = () => {
    const roleList = [];
    const roles = [];
    const managersList = ["none"];
    const managers = [];
    // READ roles for list of roles & role_id
    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roles.push({ id: res[i].id, title: res[i].title });
            roleList.push(res[i].title);
        }
        // READ employee for list of possible managers & manager_id
        connection.query(`SELECT first_name, last_name, id FROM employee WHERE id = manager_id`, (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                managers.push({ name: `${res[i].first_name} ${res[i].last_name}`, id: res[i].id });
                managersList.push(`${res[i].first_name} ${res[i].last_name}`);
            }
            //Create Employee Prompt
            inquirer.prompt([
                {
                    type: "input",
                    name: 'firstname',
                    message: "What is the First name of the employee?",
                },
                {
                    type: "input",
                    name: 'lastname',
                    message: (data) => `What is ${data.firstname}'s last name?`,
                },
                {
                    type: "list",
                    name: 'role',
                    message: (data) => `What role will ${data.firstname} fulfill?`,
                    choices: roleList
                },
                {
                    type: "list",
                    name: 'management',
                    message: (data) => `Who is ${data.firstname}'s manager?`,
                    choices: managersList
                }
            ])
                .then((data) => {
                    // gets role_id from selection
                    let chosenRole;
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i].title === data.role) {
                            chosenRole = roles[i].id;
                            // console.log(chosenRole);
                        }
                    }
                    //gets manager_id from selection
                    let chosenManager;
                    for (i = 0; i < managers.length; i++) {
                        if (managers[i].name === data.management) {
                            chosenManager = managers[i].id
                        }
                    }
                    const query = connection.query(`INSERT INTO employee SET ?`,
                        {
                            first_name: data.firstname,
                            last_name: data.lastname,
                            role_id: chosenRole,
                            manager_id: chosenManager
                        },
                        (err, res) => {
                            if (err) throw err;
                            // console.log(`${res.affectedRows} employee added!\n`);
                            // console.log(`--------------------`);
                            initInquirer();
                        }
                    )
                    // console.log(query.sql);
                })
        })
    });
}

//Read any table
const readTable = (table) => {
    table = table.replace('"', ' ');
    const query = connection.query(`SELECT * FROM ${table}`,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            initInquirer();
        })
    //     console.log(query.sql);
}

//Update Role
const updateRole = () => {
    const roles = [];
    const roleList = [];
    const employees = [];
    const employeesList = [];
    // READ roles for list of roles & role_id
    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roles.push({ id: res[i].id, title: res[i].title });
            roleList.push(res[i].title);
        }
        // READ employee for list of possible managers & manager_id
        connection.query(`SELECT first_name, last_name, id FROM employee`, (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                employees.push({ name: `${res[i].first_name} ${res[i].last_name}`, id: res[i].id });
                employeesList.push(`${res[i].first_name} ${res[i].last_name}`);
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: 'employee',
                    message: "Which employee should update their role?",
                    choices: employeesList
                },
                {
                    type: "list",
                    name: 'newRole',
                    message: (data) => `What should ${data.employee}'s new role be?`,
                    choices: roleList
                }
            ]).then((data) => {
                let pickRole;
                let pickEmployee;
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].title === data.newRole)
                        pickRole = roles[i].id;
                }
                for (let i = 0; i < employees.length; i++) {
                    if (employees[i].name === data.employee) {
                        pickEmployee = employees[i].id;
                    }
                }
                // console.log(pickRole);
                // console.log(pickEmployee);
                const query = connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [pickRole, pickEmployee],
                    (err, res) => {
                        if (err) throw err;
                        // console.log(`${res.affectedRows} ${data.employee} updated!\n`);
                        initInquirer();
                    }
                )

                // console.log(query.sql);
            });
        });
    });
}

// Update the manager_id on an employee
const updateEmployeeManagers = () => {
    const employeeList = [];
    const managerList = [];
    connection.query(`SELECT * FROM employee_tracker_db.employee;`,
        (err, res) => {
            if (err) throw error;
            for (let i = 0; i < res.length; i++) {
                employeeList.push({ name: `${res[i].first_name} ${res[i].last_name}`, id: res[i].id });
                if (res[i].role_id === 2) {
                    managerList.push({ name: `${res[i].first_name} ${res[i].last_name}`, id: res[i].id })
                }
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: 'employee',
                    message: "Which employee should update their role?",
                    choices: employeeList
                },
                {
                    type: "list",
                    name: 'newManager',
                    message: (data) => `Who will be ${data.employee}'s new manager?`,
                    choices: managerList
                }
            ]).then((data) => {
                // console.log(data);
                let pickManager;
                let pickEmployee;
                for (let i = 0; i < employeeList.length; i++) {
                    if (employeeList[i].name === data.employee) {
                        pickEmployee = employeeList[i].id
                    }
                }
                for (let i = 0; i < managerList.length; i++) {
                    if (managerList[i].name === data.newManager) {
                        pickManager = managerList[i].id
                    }
                }
                // console.log(pickEmployee);
                // console.log(pickManager);
                connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [pickManager, pickEmployee],
                    (err, res) => {
                        if (err) throw err;
                        initInquirer();
                    }
                )
            })
        }
    )
}

//Read current managers
const readManagers = () => {
    const query = connection.query(`SELECT first_name, last_name FROM employee WHERE role_id = 2`,
        (err, res) => {
            if (err) throw err;
            console.table(res);
            initInquirer();
        }
    )
    // console.log(query.sql);
}

//Delete any id from any table
const deleteItem = (table) => {
    const tableList = [];
    connection.query(`SELECT * FROM ${table}`, (err, res) => {
        if (err) throw err;
        switch (table) {
            case "employee":
                for (let i = 0; i < res.length; i++) {
                    tableList.push({ name: `${res[i].first_name} ${res[i].last_name}`, id: res[i].id, });
                }
                break;

            case "role":
                for (let i = 0; i < res.length; i++) {
                    tableList.push({ name: res[i].title, id: res[i].id, });
                }
                break;

            case "department":
                for (let i = 0; i < res.length; i++) {
                    tableList.push({ name: res[i].name, id: res[i].id, });
                }
                break;

            default:
                break;
        }

        // console.log(tableList);
        inquirer.prompt([
            {
                type: "list",
                name: 'deleteName',
                message: `Which ${table} would you like to delete?`,
                choices: tableList
            }
        ]).then((data) => {
            // console.log(data);
            let deleteId;
            for (let i = 0; i < tableList.length; i++) {
                if (data.deleteName === tableList[i].name) {
                    deleteId = tableList[i].id
                }
            }
            // console.log(deleteId);
            const query = connection.query(`DELETE FROM ?? WHERE id = ?`,
                [table, deleteId],
                (err, res) => {
                    if (err) throw err;
                    initInquirer();
                });
            // console.log(query.sql);
        });
    });
}

//view total budget of selected department
const totalBudget = () => {
    const departments = [];
    const salaries = [];
    let chosenId;
    connection.query(`SELECT * FROM department`,
        (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                departments.push({ name: res[i].name, id: res[i].id })
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: 'departmentName',
                    message: `Which department would you like to see the budget for?`,
                    choices: departments
                }
            ])
                .then((data) => {
                    for (let i = 0; i < departments.length; i++) {
                        if (departments[i].name === data.departmentName) {
                            chosenId = departments[i].id
                        }
                    }
                    connection.query(`SELECT salary FROM employee_tracker_db.role 
                        LEFT JOIN employee_tracker_db.employee 
                        ON role.id = employee.role_id WHERE ?`,
                        {
                            department_id: chosenId,
                        },
                        (err, res) => {
                            if (err) throw err;
                            for (let i = 0; i < res.length; i++) {
                                salaries.push(res[i].salary);
                            }
                            console.log(salaries.reduce((a, b) => a + b, 0));
                            initInquirer();
                        }
                    )
                })
        });
}


