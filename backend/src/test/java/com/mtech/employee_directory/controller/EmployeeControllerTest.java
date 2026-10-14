package com.mtech.employee_directory.controller;

import com.mtech.employee_directory.model.entity.Employee;
import com.mtech.employee_directory.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeControllerTest {
    @Mock
    private EmployeeService service;

    @InjectMocks
    private EmployeeController controller;

    @Test
    void getAllEmployeesDelegatesToService() {
        List<Employee> employees = List.of(new Employee());
        when(service.getAllEmployees()).thenReturn(employees);

        assertThat(controller.getAllEmployees()).isSameAs(employees);
        verify(service).getAllEmployees();
    }

    @Test
    void getEmployeeByIdDelegatesToService() {
        Employee employee = new Employee();
        when(service.getEmployeeById(7L)).thenReturn(employee);

        assertThat(controller.getEmployeeById(7L)).isSameAs(employee);
        verify(service).getEmployeeById(7L);
    }

    @Test
    void createEmployeeDelegatesToService() {
        Employee employee = new Employee();
        when(service.createEmployee(employee)).thenReturn(employee);

        assertThat(controller.createEmployee(employee)).isSameAs(employee);
        verify(service).createEmployee(employee);
    }

    @Test
    void updateEmployeeDelegatesIdAndBodyToService() {
        Employee employee = new Employee();
        when(service.updateEmployeeDetails(7L, employee)).thenReturn(employee);

        assertThat(controller.updateEmployeeDetails(7L, employee)).isSameAs(employee);
        verify(service).updateEmployeeDetails(7L, employee);
    }

    @Test
    void deleteEmployeeDelegatesToService() {
        controller.deleteEmployee(7L);

        verify(service).deleteEmployee(7L);
    }

    @Test
    void searchEmployeesByNameDelegatesQuery() {
        List<Employee> employees = List.of(new Employee());
        when(service.searchEmployeesByName("Ada")).thenReturn(employees);

        assertThat(controller.searchEmployeesByName("Ada")).isSameAs(employees);
        verify(service).searchEmployeesByName("Ada");
    }

    @Test
    void unsafeNamedSearchDelegatesToService() {
        List<Employee> employees = List.of(new Employee());
        when(service.searchEmployeesByNameUnsafe("Ada")).thenReturn(employees);

        assertThat(controller.searchEmployeesByNameUnsafe("Ada")).isSameAs(employees);
        verify(service).searchEmployeesByNameUnsafe("Ada");
    }
}