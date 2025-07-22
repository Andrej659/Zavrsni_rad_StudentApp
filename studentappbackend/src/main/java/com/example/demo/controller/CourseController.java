package com.example.demo.controller;

import com.example.demo.models.entities.AcademicYear;
import com.example.demo.models.entities.Course;
import com.example.demo.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    /**
     * Create a new Course.
     */
    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        Course saved = courseService.save(course);
        return ResponseEntity
                .created(URI.create("/api/courses/" + saved.getCourseID()))
                .body(saved);
    }

    /**
     * Update an existing Course.
     * If the ID in payload is null or does not exist, this will behave like create.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Course> update(
            @PathVariable Integer id,
            @RequestBody Course course) {

        course.setCourseID(id);
        Course updated = courseService.save(course);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get a Course by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable Integer id) {
        Optional<Course> maybe = courseService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get all Courses.
     */
    @GetMapping
    public ResponseEntity<List<Course>> getAll() {
        List<Course> list = courseService.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Get a Course by its name.
     */
    @GetMapping("/search")
    public ResponseEntity<Course> getByName(@RequestParam("name") String name) {
        Optional<Course> maybe = courseService.findByName(name);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete a Course by its ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            courseService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/academic-year/{acYrID}")
    public ResponseEntity<List<Course>> getByFaculty(@PathVariable("acYrID") Integer acYrID) {
        List<Course> list = courseService.getCoursesByAcYr(acYrID);
        return ResponseEntity.ok(list);
    }
}
