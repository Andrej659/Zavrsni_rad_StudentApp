package com.example.demo.services;

import com.example.demo.models.entities.Event;
import com.example.demo.models.entities.User;
import com.example.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Create or update
    public Event save(Event event) {
        return eventRepository.save(event);
    }

    // Find by ID
    @Transactional(readOnly = true)
    public Optional<Event> findById(Integer id) {
        return eventRepository.findById(id);
    }

    // Find by name
    @Transactional(readOnly = true)
    public Optional<Event> findByName(String eventName) {
        return eventRepository.findByEventName(eventName);
    }

    @Transactional(readOnly = true)
    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    // Find by date
    @Transactional(readOnly = true)
    public Optional<Event> findByEventDate(Date eventDate) {
        return eventRepository.findByEventDate(eventDate);
    }

    // Delete by ID
    public void deleteById(Integer id) {
        if (!eventRepository.existsById(id)) {
            throw new IllegalArgumentException("Event with ID " + id + " not found");
        }
        eventRepository.deleteById(id);
    }
}
