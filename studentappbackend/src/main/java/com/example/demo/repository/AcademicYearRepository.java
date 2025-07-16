package com.example.demo.repository;

import com.example.demo.models.entities.AcademicYear;
import com.example.demo.models.entities.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Integer> {

    // Find by academic year name
    Optional<AcademicYear> findByAcYrName(String acYrName);

}