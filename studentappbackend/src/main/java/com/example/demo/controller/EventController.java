package com.example.demo.controller;

import com.example.demo.models.entities.Event;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.sql.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * Create a new Event.
     */
    @PostMapping
    public ResponseEntity<Event> create(@RequestBody Event event) {
        Event saved = eventService.save(event);
        return ResponseEntity
                .created(URI.create("/api/events/" + saved.getEventID()))
                .body(saved);
    }

    /**
     * Update an existing Event.
     * If the ID in payload is null or does not exist, this will behave like create.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Event> update(
            @PathVariable Integer id,
            @RequestBody Event event) {

        event.setEventID(id);
        Event updated = eventService.save(event);
        return ResponseEntity.ok(updated);
    }

    /**
     * Fetch an Event by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Event> getById(@PathVariable Integer id) {
        Optional<Event> maybe = eventService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Fetch an Event by its name.
     */
    @GetMapping("/search/by-name")
    public ResponseEntity<Event> getByName(@RequestParam("name") String name) {
        Optional<Event> maybe = eventService.findByName(name);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Fetch an Event by its date.
     */
    @GetMapping("/search/by-date")
    public ResponseEntity<Event> getByDate(@RequestParam("date") Date eventDate) {
        Optional<Event> maybe = eventService.findByEventDate(eventDate);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete an Event by its ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            eventService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}

