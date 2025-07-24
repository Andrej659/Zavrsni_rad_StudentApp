package com.example.demo.controller.dbControllers;

import com.example.demo.models.entities.Faculty;
import com.example.demo.services.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/faculties")
public class FacultyController {

    private final FacultyService facultyService;

    @Autowired
    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    /**
     * Create a new Faculty.
     */
    @PostMapping
    public ResponseEntity<Faculty> create(@RequestBody Faculty faculty) {
        Faculty saved = facultyService.save(faculty);
        return ResponseEntity
                .created(URI.create("/api/faculties/" + saved.getFacultyID()))
                .body(saved);
    }

    /**
     * Update an existing Faculty.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Faculty> update(@PathVariable Integer id, @RequestBody Faculty faculty) {
        faculty.setFacultyID(id);
        Faculty updated = facultyService.save(faculty);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get Faculty by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getById(@PathVariable Integer id) {
        Optional<Faculty> maybe = facultyService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get all Faculties.
     */
    @GetMapping
    public ResponseEntity<List<Faculty>> getAll() {
        List<Faculty> list = facultyService.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Get Faculty by name.
     */
    @GetMapping("/search")
    public ResponseEntity<Faculty> getByName(@RequestParam("name") String name) {
        Optional<Faculty> maybe = facultyService.findByName(name);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete Faculty by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            facultyService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get total count of Faculties.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        long count = facultyService.count();
        return ResponseEntity.ok(count);
    }
}