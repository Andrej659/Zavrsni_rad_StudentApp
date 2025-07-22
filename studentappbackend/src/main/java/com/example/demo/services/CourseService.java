package com.example.demo.services;

import com.example.demo.models.entities.Course;
import com.example.demo.models.entities.AcademicYear;
import com.example.demo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Create or update course
    public Course save(Course course) {
        return courseRepository.save(course);
    }

    // Find course by ID
    @Transactional(readOnly = true)
    public Optional<Course> findById(Integer id) {
        return courseRepository.findById(id);
    }

    // Find all courses
    @Transactional(readOnly = true)
    public List<Course> findAll() {
        return courseRepository.findAll();
    }

    // Find course by name
    @Transactional(readOnly = true)
    public Optional<Course> findByName(String courseName) {
        return courseRepository.findByCourseName(courseName);
    }

    // Delete course by ID
    public void deleteById(Integer id) {
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Course with ID " + id + " not found");
        }
        courseRepository.deleteById(id);
    }

    // Delete course
    public void delete(Course course) {
        courseRepository.delete(course);
    }

    public List<Course> getCoursesByAcYr(Integer acYrID){
        return courseRepository.findByAcademicYear_AcYrID(acYrID);
    }
}