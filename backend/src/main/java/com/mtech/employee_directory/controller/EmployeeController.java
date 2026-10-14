package com.mtech.employee_directory.controller;

import com.mtech.employee_directory.model.entity.Employee;
import com.mtech.employee_directory.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    private final EmployeeService service;

    public EmployeeController(EmployeeService employeeService) {
        this.service = employeeService;
    }

    @GetMapping
    public List<Employee> getAllEmployees() { return service.getAllEmployees(); }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) { return service.getEmployeeById(id); }

    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) { return service.createEmployee(employee); }

    @PutMapping("/{id}")
    public Employee updateEmployeeDetails(@PathVariable Long id, @RequestBody Employee employee) {
        return service.updateEmployeeDetails(id, employee);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable Long id) { service.deleteEmployee(id); }

    @GetMapping("/search")
    public List<Employee> searchEmployeesByName(@RequestParam String name) { return service.searchEmployeesByName(name); }

    @GetMapping("/search-unsafe")
    public List<Employee> searchEmployeesByNameUnsafe(@RequestParam String name) { return service.searchEmployeesByNameUnsafe(name); }
}