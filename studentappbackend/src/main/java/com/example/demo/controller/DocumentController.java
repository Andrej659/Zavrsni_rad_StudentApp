package com.example.demo.controller;

import com.example.demo.models.entities.Document;
import com.example.demo.services.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /**
     * Create a new Document.
     */
    @PostMapping
    public ResponseEntity<Document> create(@RequestBody Document document) {
        Document saved = documentService.save(document);
        return ResponseEntity
                .created(URI.create("/api/documents/" + saved.getDocID()))
                .body(saved);
    }

    /**
     * Update an existing Document.
     * If the ID in payload is null or does not exist, this will behave like create.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Document> update(
            @PathVariable Integer id,
            @RequestBody Document document) {

        document.setDocID(id);
        Document updated = documentService.save(document);
        return ResponseEntity.ok(updated);
    }

    /**
     * Fetch a Document by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Document> getById(@PathVariable Integer id) {
        Optional<Document> maybe = documentService.findById(id);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAll() {
        List<Document> list = documentService.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     * Fetch a Document by its name.
     */
    @GetMapping("/search")
    public ResponseEntity<Document> getByName(@RequestParam("name") String name) {
        Optional<Document> maybe = documentService.findByName(name);
        return maybe
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Delete a Document by its ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            documentService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
