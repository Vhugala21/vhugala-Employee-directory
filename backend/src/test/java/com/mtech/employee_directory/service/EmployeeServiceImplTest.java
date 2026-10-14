package com.mtech.employee_directory.service;

import com.mtech.employee_directory.model.entity.Employee;
import com.mtech.employee_directory.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {
    @Mock
    private EmployeeRepository repository;

    @InjectMocks
    private EmployeeServiceImpl service;

    @Test
    void getAllEmployeesReturnsRepositoryResults() {
        List<Employee> employees = List.of(new Employee());
        when(repository.findAll()).thenReturn(employees);

        assertThat(service.getAllEmployees()).isSameAs(employees);
    }

    @Test
    void getEmployeeByIdReturnsMatchingEmployee() {
        Employee employee = new Employee();
        when(repository.findById(7L)).thenReturn(Optional.of(employee));

        assertThat(service.getEmployeeById(7L)).isSameAs(employee);
    }

    @Test
    void getEmployeeByIdThrowsNotFoundWhenMissing() {
        when(repository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getEmployeeById(7L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(exception -> ((ResponseStatusException) exception).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void createEmployeeClearsIdBeforeSaving() {
        Employee employee = new Employee();
        employee.setId(7L);
        when(repository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Employee created = service.createEmployee(employee);

        assertThat(created.getId()).isNull();
        verify(repository).save(employee);
    }

    @Test
    void updateEmployeeCopiesMutableFieldsAndSaves() {
        Employee stored = employee("Old name", "Old department", "Old bio");
        Employee changes = employee("New name", "New department", "New bio");
        when(repository.findById(7L)).thenReturn(Optional.of(stored));
        when(repository.save(stored)).thenReturn(stored);

        Employee updated = service.updateEmployeeDetails(7L, changes);

        assertThat(updated.getName()).isEqualTo("New name");
        assertThat(updated.getDepartment()).isEqualTo("New department");
        assertThat(updated.getBio()).isEqualTo("New bio");
        verify(repository).save(stored);
    }

    @Test
    void updateEmployeeDoesNotSaveWhenEmployeeIsMissing() {
        when(repository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateEmployeeDetails(7L, new Employee()))
                .isInstanceOf(ResponseStatusException.class);
        verify(repository, never()).save(any(Employee.class));
    }

    @Test
    void deleteEmployeeDelegatesToRepository() {
        service.deleteEmployee(7L);

        verify(repository).deleteById(7L);
    }

    @Test
    void searchMethodsDelegateToTheirRepositoryQueries() {
        List<Employee> employees = List.of(new Employee());
        when(repository.findByNameContaining("Ada")).thenReturn(employees);
        when(repository.searchByName("Ada")).thenReturn(employees);

        assertThat(service.searchEmployeesByName("Ada")).isSameAs(employees);
        assertThat(service.searchEmployeesByNameUnsafe("Ada")).isSameAs(employees);
        verify(repository).findByNameContaining("Ada");
        verify(repository).searchByName("Ada");
    }

    private Employee employee(String name, String department, String bio) {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setDepartment(department);
        employee.setBio(bio);
        return employee;
    }
}