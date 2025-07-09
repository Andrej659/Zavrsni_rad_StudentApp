package com.example.demo.controller;

import com.example.demo.models.entities.Faculty;
import com.example.demo.services.FacultyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculties")
public class FacultyController {
    private final FacultyService service;

    public FacultyController(FacultyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Faculty> createFaculty(@RequestBody Faculty f) {
        System.out.println(f);
        Faculty saved = service.create(f);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}