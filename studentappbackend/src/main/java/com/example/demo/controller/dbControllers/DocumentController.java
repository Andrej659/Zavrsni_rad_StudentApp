package com.example.demo.controller.dbControllers;

import com.example.demo.models.entities.Document;
import com.example.demo.services.DocumentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Create a new Document.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Document> create(
            @RequestPart("document") String documentJson,
            @RequestPart("file") MultipartFile file
    ) {
        try {
            Document document = objectMapper.readValue(documentJson, Document.class);

            String uploadDir = "uploads\\";
            String fileName = file.getOriginalFilename();
            String baseName = fileName != null ? fileName.substring(0, fileName.lastIndexOf('.')) : "file";
            String extension = fileName != null ? fileName.substring(fileName.lastIndexOf('.')) : "";
            String suffix = "";
            String filePath = uploadDir + fileName;

            int counter = 1;
            while (documentService.existsByDocLocation(filePath)) {
                suffix = "(" + counter + ")";
                fileName = baseName + suffix + extension;
                filePath = uploadDir + fileName;
                counter++;
            }

            Path path = (Path) Paths.get(filePath);

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            Files.copy(file.getInputStream(),
                    path,
                    StandardCopyOption.REPLACE_EXISTING);

            document.setDocName(fileName);
            document.setDocLocation(path.toString());

            Document saved = documentService.save(document);

            return ResponseEntity
                    .created(URI.create("/api/documents/" + saved.getDocID()))
                    .body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
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

    @GetMapping("/download/{docId}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Integer docId) {
        Document doc = documentService.findById(docId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        Path filePath = Paths.get(doc.getDocLocation());
        Resource resource;
        try {
            resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
            }
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Bad file path");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getDocName() + "\"")
                .body(resource);
    }


    @GetMapping("/faculty/{facultyID}")
    public ResponseEntity<List<Document>> getByFaculty(@PathVariable Integer facultyID) {
        return ResponseEntity.ok(documentService.findByFacultyID(facultyID));
    }

    @GetMapping("/user/{userID}")
    public ResponseEntity<List<Document>> getByUser(@PathVariable Integer userID) {
        return ResponseEntity.ok(documentService.findByUserID(userID));
    }

    @GetMapping("/course/{courseID}")
    public ResponseEntity<List<Document>> getByCourse(@PathVariable Integer courseID) {
        return ResponseEntity.ok(documentService.findByCourseID(courseID));
    }
}
