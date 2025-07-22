package com.example.demo.controller;


import com.example.demo.models.entities.Faculty;
import com.example.demo.models.entities.Message;
import com.example.demo.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * Create a new Message.
     */
    @PostMapping
    public ResponseEntity<Message> create(@RequestBody Message message) {
        Message saved = messageService.save(message);
        return ResponseEntity
                .created(URI.create("/api/messages/" + saved.getMsgID()))
                .body(saved);
    }

    /**
     * Update an existing Message.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Message> update(@PathVariable Integer id, @RequestBody Message message) {
        message.setMsgID(id);
        Message updated = messageService.save(message);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get a Message by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Message> getById(@PathVariable Integer id) {
        Optional<Message> maybe = messageService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAll() {
        List<Message> list = messageService.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Get a Message by content.
     */
    @GetMapping("/search/by-content")
    public ResponseEntity<Message> getByContent(@RequestParam("content") String content) {
        Optional<Message> maybe = messageService.findByContent(content);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get a Message by date.
     */
    @GetMapping("/search/by-date")
    public ResponseEntity<Message> getByDate(@RequestParam("date") Date date) {
        Optional<Message> maybe = messageService.findByDate(date);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete a Message by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            messageService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
