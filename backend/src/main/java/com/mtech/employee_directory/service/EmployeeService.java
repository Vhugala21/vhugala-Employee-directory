package com.mtech.employee_directory.service;

import com.mtech.employee_directory.model.entity.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Long id);
    Employee createEmployee(Employee employee);
    Employee updateEmployeeDetails(Long id, Employee employeeDetails);
    void deleteEmployee(Long id);
    List<Employee> searchEmployeesByName(String name);
    List<Employee> searchEmployeesByNameUnsafe(String name);
}