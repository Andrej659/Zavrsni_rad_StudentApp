package com.example.demo.repository;

import com.example.demo.models.entities.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Integer> {

    // Find by faculty name
    Optional<Faculty> findByFacultyName(String facultyName);

}
