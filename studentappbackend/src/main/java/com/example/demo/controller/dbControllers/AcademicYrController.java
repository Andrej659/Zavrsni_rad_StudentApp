package com.example.demo.controller.dbControllers;

import com.example.demo.models.entities.AcademicYear;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/academic-years")
public class AcademicYrController {

    private final AcademicYrService academicYrService;

    @Autowired
    public AcademicYrController(AcademicYrService academicYrService) {
        this.academicYrService = academicYrService;
    }

    /**
     * Create a new AcademicYear.
     */
    @PostMapping
    public ResponseEntity<AcademicYear> create(@RequestBody AcademicYear acYear) {
        AcademicYear saved = academicYrService.save(acYear);
        // Return 201 Created with Location header
        return ResponseEntity
                .created(URI.create("/api/academic-years/" + saved.getAcYrID()))
                .body(saved);
    }

    /**
     * Update an existing AcademicYear.
     * If the ID in payload is null or does not exist, this will behave like create.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AcademicYear> update(
            @PathVariable Integer id,
            @RequestBody AcademicYear acYear) {

        // ensure path ID matches payload ID
        acYear.setAcYrID(id);
        AcademicYear updated = academicYrService.save(acYear);
        return ResponseEntity.ok(updated);
    }

    /**
     * Fetch an AcademicYear by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AcademicYear> getById(@PathVariable Integer id) {
        Optional<AcademicYear> maybe = academicYrService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<AcademicYear>> getAllAcYr() {
        List<AcademicYear> list = academicYrService.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Fetch an AcademicYear by its name.
     */
    @GetMapping("/search")
    public ResponseEntity<AcademicYear> getByName(@RequestParam("name") String name) {
        Optional<AcademicYear> maybe = academicYrService.findByName(name);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/faculty/{facultyID}")
    public ResponseEntity<List<AcademicYear>> getByFaculty(@PathVariable("facultyID") Integer facultyID) {
        List<AcademicYear> list = academicYrService.findByFaculty(facultyID);
        return ResponseEntity.ok(list);
    }


    /**
     * Delete an AcademicYear by its ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            academicYrService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
