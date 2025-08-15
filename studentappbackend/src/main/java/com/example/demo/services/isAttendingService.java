package com.example.demo.services;

import com.example.demo.models.entities.Document;
import com.example.demo.models.entities.IsAttending;
import com.example.demo.models.entities.IsAttendingId;
import com.example.demo.models.entities.User;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.repository.IsAttendingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class isAttendingService {

    private final IsAttendingRepository isAttendingRepository;

    @Autowired
    public isAttendingService(IsAttendingRepository isAttendingRepository) {
        this.isAttendingRepository = isAttendingRepository;
    }

    // Create or update
    public IsAttending save(IsAttending isAttending) {
        return isAttendingRepository.save(isAttending);
    }

    @Transactional(readOnly = true)
    public List<IsAttending> findAll() {
        return isAttendingRepository.findAll();
    }

    // Find by ID
    @Transactional(readOnly = true)
    public Optional<IsAttending> findById(IsAttendingId id) {
        return isAttendingRepository.findById(id);
    }

    // Delete by ID
    public void deleteById(IsAttendingId id) {
        if (!isAttendingRepository.existsById(id)) {
            throw new IllegalArgumentException("Attendance with ID " + id + " not found");
        }
        isAttendingRepository.deleteById(id);
    }

    public List<IsAttending> findByUserID(Integer userId) {
        return isAttendingRepository.findById_UserID(userId);
    }

}
