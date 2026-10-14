package com.mtech.employee_directory;

import com.mtech.employee_directory.model.entity.Employee;
import com.mtech.employee_directory.repository.EmployeeRepository;
import com.mtech.employee_directory.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest
class EmployeeDirectoryApplicationTests {

    @SuppressWarnings("resource")
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("employees")
            .withUsername("postgres")
            .withPassword("postgres");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    EmployeeRepository repository;

    @Autowired
    EmployeeService service;

    @Test
    void contextLoads() {
    }

    @Test
    void saveAndFindEmployee() {
        Employee emp = new Employee();
        emp.setName("Test User");
        emp.setDepartment("Engineering");
        emp.setBio("Test bio");

        Employee saved = repository.save(emp);
        assertThat(saved.getId()).isNotNull();

        Employee found = repository.findById(saved.getId()).orElseThrow();
        assertThat(found.getName()).isEqualTo("Test User");
    }

    @Test
    void searchByNameIsSafeFromSqlInjection() {
        Employee emp = new Employee();
        emp.setName("John Doe");
        emp.setDepartment("Sales");
        emp.setBio("Bio");
        repository.save(emp);

        List<Employee> results = repository.searchByName("John' OR '1'='1");
        assertThat(results).isEmpty();

        results = repository.searchByName("John");
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getName()).isEqualTo("John Doe");
    }

    @Test
    void serviceLayerCrudOperations() {
        Employee emp = new Employee();
        emp.setName("Alice");
        emp.setDepartment("HR");
        emp.setBio("HR bio");
        Employee created = service.createEmployee(emp);
        assertThat(created.getId()).isNotNull();

        Employee found = service.getEmployeeById(created.getId());
        assertThat(found.getName()).isEqualTo("Alice");

        Employee updateEmp = new Employee();
        updateEmp.setName("Alice Updated");
        updateEmp.setDepartment("HR");
        updateEmp.setBio("New bio");
        Employee updated = service.updateEmployeeDetails(created.getId(), updateEmp);
        assertThat(updated.getName()).isEqualTo("Alice Updated");

        service.deleteEmployee(created.getId());
        assertThat(service.getAllEmployees()).doesNotContain(created);
    }
}