package com.mtech.employee_directory.repository;

import com.mtech.employee_directory.model.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    List<Employee> findByNameContaining(String name);

    @Query(value = "SELECT * FROM employee WHERE name ILIKE '%" + ":name" + "%'", nativeQuery = true)
    List<Employee> searchByName(@Param("name") String name);
}