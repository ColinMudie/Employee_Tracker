# Employee Tracker

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Description
This app is a Content Management System designed to interact with a database on MYSQL using CRUD methods. In the future, I would like to add more safety to the delete functions, such as not being able to delete the role "Managers" or a confirmation for each choice. 

## Table of Contents

* [User Story](#user-story)
* [Usage](#usage)
* [Features](#features)
* [Questions](#questions)
* [Credits](#credits)
* [License](#license)

## User Story
```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```


## Usage
![test](./assets/Employee_Tracker_Test_GIF.gif)

- Begin by installing the npm packages required by entering "npm install" into your command terminal.
- next type "npm start" to being the app.
- You will be presented with the following options:
    - Add Departments
        - Asks Name of a department and create the department.
    - Add Roles
        - Asks Name of role, the salary for the role, and which department it belongs to.
    - Add Employees
        - Asks Name, which role, and asks who the employees manager will be.
    - View Departments
        - Displays the department table
    - View Roles
        - Displays the role table
    - View Employees
        - Displays the employee table
    - Update Employee Roles
        - Asks which employee to be updated and then to which role.
    - Update Employee's Manager
        - Asks which employee to update and then who will be their new manager
    - View all Managers
        - Displays every employee with a role of "Manager"
    - Delete Employee
        - Asks which employee then removes them from the employee table
    - Delete Role
        - Asks which role then removes them from the role table
    - Delete Department
        - Asks which department then removes them from the department table
    - View combined salaries
        - Asks which department then displays the combined value of the salaries for employee in that department.
    - Exit
        - Exits the application.


## Features
- [node.js](https://nodejs.org/en/)
- [express.js](https://expressjs.com/)
- [mysql](https://www.npmjs.com/package/mysql)
- [inquirer](https://www.npmjs.com/package/inquirer)
- [figlet](https://www.npmjs.com/package/figlet)
- [console.table](https://www.npmjs.com/package/console.table)

## Questions
Github: [ColinMudie](https://github.com/ColinMudie/)  
Email: [csmudie1@gmail.com](csmudie1@gmail.com)

## License
MIT License
Copyright (c) [2021] [Colin Mudie]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
