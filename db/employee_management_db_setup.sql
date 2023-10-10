-- Drop the existing Employee_Management_db database if it exists
DROP DATABASE IF EXISTS Employee_Management_db;

-- Create a new Employee_Management_db database
CREATE DATABASE Employee_Management_db;

-- Use the Employee_Management_db database
USE Employee_Management_db;

-- Create the 'department' table
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(30)
);

-- Create the 'role' table
DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

-- Create the 'employee' table
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
