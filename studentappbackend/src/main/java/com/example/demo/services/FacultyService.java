package com.example.demo.services;

import com.example.demo.models.entities.Faculty;
import com.example.demo.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FacultyService {

    private final FacultyRepository facultyRepository;

    @Autowired
    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    // Create or update faculty
    public Faculty save(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    // Find faculty by ID
    @Transactional(readOnly = true)
    public Optional<Faculty> findById(Integer id) {
        return facultyRepository.findById(id);
    }

    // Find all faculties
    @Transactional(readOnly = true)
    public List<Faculty> findAll() {
        return facultyRepository.findAll();
    }

    // Find faculty by name
    @Transactional(readOnly = true)
    public Optional<Faculty> findByName(String facultyName) {
        return facultyRepository.findByFacultyName(facultyName);
    }

    // Delete faculty by ID
    public void deleteById(Integer id) {
        Optional<Faculty> faculty = findById(id);
        if (faculty.isEmpty()) {
            throw new IllegalArgumentException("Faculty with ID " + id + " not found");
        }
        facultyRepository.deleteById(id);
    }

    // Get total count of faculties
    @Transactional(readOnly = true)
    public long count() {
        return facultyRepository.count();
    }

}
