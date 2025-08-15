package com.example.demo.controller.dbControllers;

import com.example.demo.models.entities.IsAttending;
import com.example.demo.models.entities.IsAttendingId;
import com.example.demo.models.entities.User;
import com.example.demo.services.UserService;
import com.example.demo.services.isAttendingService;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/is-attending")
public class IsAttendingController {

    private final isAttendingService isAttendingService;
    private final UserService userService;

    @Autowired
    public IsAttendingController(isAttendingService isAttendingService, UserService userService) {
        this.isAttendingService = isAttendingService;
        this.userService = userService;
    }

    /**
     * Create a new IsAttending record.
     */
    @PostMapping
    public ResponseEntity<IsAttending> create(@RequestBody IsAttending isAttending) {
        IsAttending saved = isAttendingService.save(isAttending);
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

    @GetMapping("/user")
    public ResponseEntity<List<IsAttending>> getCoursesForLoggedInUser(
            @RequestHeader("Authorization") String authHeader) {

        try {
            String token = authHeader.replace("Bearer ", "");
            String username = JwtUtil.extractUsername(token);
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            List<IsAttending> attending = isAttendingService.findByUserID(user.getUserID());
            return ResponseEntity.ok(attending);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
