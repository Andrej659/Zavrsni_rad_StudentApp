package com.example.demo.services;

import com.example.demo.models.entities.Document;
import com.example.demo.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public Document save(Document document) {
        return documentRepository.save(document);
    }

    @Transactional(readOnly = true)
    public Optional<Document> findById(Integer id) {
        return documentRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Document> findAll() {
        return documentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Document> findByName(String docName) {
        return documentRepository.findByDocName(docName);
    }

    public boolean existsByDocLocation(String filePath) {
        return documentRepository.existsByDocLocation(filePath);
    }

    public List<Document> findByFacultyID(Integer facultyID) {
        return documentRepository.findByUser_Faculty_FacultyID(facultyID);
    }

    public List<Document> findByUserID(Integer userID) {
        return documentRepository.findByUser_UserID(userID);
    }

    public List<Document> findByCourseID(Integer courseID) {
        return documentRepository.findByCourse_CourseID(courseID);
    }

    public void deleteById(Integer id) {
        if (!documentRepository.existsById(id)) {
            throw new IllegalArgumentException("Document with ID " + id + " not found");
        }
        documentRepository.deleteById(id);
    }
}
