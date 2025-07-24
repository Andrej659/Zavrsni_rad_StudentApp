package com.example.demo.services;

import com.example.demo.models.entities.AcademicYear;
import com.example.demo.repository.AcademicYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AcademicYrService {

    private final AcademicYearRepository academicYearRepository;

    @Autowired
    public AcademicYrService(AcademicYearRepository academicYearRepository) {
        this.academicYearRepository = academicYearRepository;
    }

    // Create or update academic year
    public AcademicYear save(AcademicYear academicYear) {
        return academicYearRepository.save(academicYear);
    }

    // Find academic year by ID
    @Transactional(readOnly = true)
    public Optional<AcademicYear> findById(Integer id) {
        return academicYearRepository.findById(id);
    }

    // Find academic year by name
    @Transactional(readOnly = true)
    public Optional<AcademicYear> findByName(String acYrName) {
        return academicYearRepository.findByAcYrName(acYrName);
    }

    @Transactional(readOnly = true)
    public List<AcademicYear> findByFaculty(Integer facultyID) {
        return academicYearRepository.findByFaculty_FacultyID(facultyID);
    }

    @Transactional(readOnly = true)
    public List<AcademicYear> findAll() {
        return academicYearRepository.findAll();
    }

    // Delete academic year by ID
    public void deleteById(Integer id) {
        if (!academicYearRepository.existsById(id)) {
            throw new IllegalArgumentException("Academic year with ID " + id + " not found");
        }
        academicYearRepository.deleteById(id);
    }
}
