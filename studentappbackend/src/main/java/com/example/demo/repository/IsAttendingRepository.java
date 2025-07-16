package com.example.demo.repository;

import com.example.demo.models.entities.IsAttending;
import com.example.demo.models.entities.IsAttendingId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface IsAttendingRepository extends JpaRepository<IsAttending, Integer> {

    Optional<IsAttending> findByID(IsAttendingId aID);
}
