package com.example.demo.services;

import com.example.demo.models.entities.Document;
import com.example.demo.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    // Create or update
    public Document save(Document document) {
        return documentRepository.save(document);
    }

    // Find by ID
    @Transactional(readOnly = true)
    public Optional<Document> findById(Integer id) {
        return documentRepository.findById(id);
    }

    // Find by name
    @Transactional(readOnly = true)
    public Optional<Document> findByName(String docName) {
        return documentRepository.findByDocName(docName);
    }


    // Delete by ID
    public void deleteById(Integer id) {
        if (!documentRepository.existsById(id)) {
            throw new IllegalArgumentException("Document with ID " + id + " not found");
        }
        documentRepository.deleteById(id);
    }
}
