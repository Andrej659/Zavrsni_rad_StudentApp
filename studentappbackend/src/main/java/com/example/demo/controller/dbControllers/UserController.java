package com.example.demo.controller.dbControllers;

import com.example.demo.models.entities.User;
import com.example.demo.models.entities.Faculty;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Create a new User.
     */
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) {
        User saved = userService.save(user);
        return ResponseEntity
                .created(URI.create("/api/users/" + saved.getUserID()))
                .body(saved);
    }

    /**
     * Update an existing User.
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Integer id, @RequestBody User user) {
        user.setUserID(id);
        User updated = userService.save(user);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get a User by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Integer id) {
        Optional<User> maybe = userService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get a User by username.
     */
    @GetMapping("/search")
    public ResponseEntity<User> getByUsername(@RequestParam("username") String username) {
        Optional<User> maybe = userService.findByUsername(username);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> list = userService.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Check if a User is an admin.
     */
    @GetMapping("/{id}/is-admin")
    public ResponseEntity<Boolean> isAdmin(@PathVariable Integer id) {
        try {
            boolean isAdmin = userService.isUserAnAdmin(id);
            return ResponseEntity.ok(isAdmin);
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get the Faculty of a User.
     */
    @GetMapping("/{id}/faculty")
    public ResponseEntity<Faculty> getFaculty(@PathVariable Integer id) {
        try {
            Faculty faculty = userService.findFacultyOfTheUser(id);
            return ResponseEntity.ok(faculty);
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a User by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            userService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
