package com.example.demo.controller;

import com.example.demo.models.entities.Faculty;
import com.example.demo.models.entities.IsAttending;
import com.example.demo.models.entities.IsAttendingId;
import com.example.demo.services.isAttendingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/is-attending")
public class IsAttendingController {

    private final isAttendingService isAttendingService;

    @Autowired
    public IsAttendingController(isAttendingService isAttendingService) {
        this.isAttendingService = isAttendingService;
    }

    /**
     * Create a new IsAttending record.
     */
    @PostMapping
    public ResponseEntity<IsAttending> create(@RequestBody IsAttending isAttending) {
        IsAttending saved = isAttendingService.save(isAttending);
        // Use both keys for URI
        return ResponseEntity
                .created(URI.create("/api/is-attending/" + saved.getCourse().getCourseID()
                        + "/" + saved.getUser().getUserID()))
                .body(saved);
    }

    @GetMapping
    public ResponseEntity<List<IsAttending>> getAll() {
        List<IsAttending> list = isAttendingService.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Get an IsAttending by composite key (courseId, userId).
     */
    @GetMapping("/{courseId}/{userId}")
    public ResponseEntity<IsAttending> getById(
            @PathVariable Integer courseId,
            @PathVariable Integer userId) {
        IsAttendingId id = new IsAttendingId(courseId, userId);
        Optional<IsAttending> maybe = isAttendingService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete an IsAttending by composite key (courseId, userId).
     */
    @DeleteMapping("/{courseId}/{userId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer courseId,
            @PathVariable Integer userId) {
        IsAttendingId id = new IsAttendingId(courseId, userId);
        try {
            isAttendingService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
