package com.example.demo.repository;

import com.example.demo.models.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Integer> {

    Optional<Event> findByEventName(String eventName);
    Optional<Event> findByEventDate(Date eventDate);
}
