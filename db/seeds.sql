USE employee_tracker_db;

INSERT INTO department (`name`)
VALUES ("updog_financial");

INSERT INTO role (`title`, `salary`, `department_id`)
VALUES ("Engineer", 100000.00, 1);

INSERT INTO role (`title`, `salary`, `department_id`)
VALUES ("Manager", 200000.00, 1);

INSERT INTO employee (`first_name`, `last_name`, `role_id`, `manager_id`)
VALUES ("Kai", "Johnson", 2, 2);

INSERT INTO employee (`first_name`, `last_name`, `role_id`, `manager_id`)
VALUES ("Colin", "Mudie", 1, 2);