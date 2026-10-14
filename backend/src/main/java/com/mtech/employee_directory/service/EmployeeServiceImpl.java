package com.mtech.employee_directory.service;

import com.mtech.employee_directory.model.entity.Employee;
import com.mtech.employee_directory.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository repo;

    public EmployeeServiceImpl(EmployeeRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Employee> getAllEmployees() { return repo.findAll(); }

    @Override
    public Employee getEmployeeById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    @Override
    public Employee createEmployee(Employee employee) {
        employee.setId(null);
        return repo.save(employee);
    }

    @Override
    public Employee updateEmployeeDetails(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        employee.setName(employeeDetails.getName());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setBio(employeeDetails.getBio());
        return repo.save(employee);
    }

    @Override
    public void deleteEmployee(Long id) { repo.deleteById(id); }

    @Override
    public List<Employee> searchEmployeesByName(String name) { return repo.findByNameContaining(name); }

    @Override
    public List<Employee> searchEmployeesByNameUnsafe(String name) { return repo.searchByName(name); }
}