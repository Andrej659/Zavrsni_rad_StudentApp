package com.example.demo.services;

import com.example.demo.models.entities.Faculty;
import com.example.demo.repository.FacultyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FacultyService {
    private final FacultyRepository repo;

    public FacultyService(FacultyRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public Faculty create(Faculty f) {
        return repo.save(f);
    }
}
