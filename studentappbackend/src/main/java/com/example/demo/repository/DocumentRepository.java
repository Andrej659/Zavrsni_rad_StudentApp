package com.example.demo.repository;

import com.example.demo.models.entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

    Optional<Document> findByDocName(String docName);
    boolean existsByDocLocation(String filePath);
    List<Document> findByUser_Faculty_FacultyID(Integer facultyID);
    List<Document> findByUser_UserID(Integer userID);
    List<Document> findByCourse_CourseID(Integer courseID);
}
