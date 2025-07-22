package com.example.demo.repository;

import com.example.demo.models.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    Optional<Course> findByCourseName(String courseName);

    List<Course> findByAcademicYear_AcYrID(Integer acYrID);

}
