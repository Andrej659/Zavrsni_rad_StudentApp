package com.example.demo.services;

import com.example.demo.models.entities.Message;
import com.example.demo.models.entities.User;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // Create or update
    public Message save(Message document) {
        return messageRepository.save(document);
    }

    @Transactional(readOnly = true)
    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    // Find by ID
    @Transactional(readOnly = true)
    public Optional<Message> findById(Integer id) {
        return messageRepository.findById(id);
    }

    // Find by name
    @Transactional(readOnly = true)
    public Optional<Message> findByContent(String content) {
        return messageRepository.findByMsgContent(content);
    }

    @Transactional(readOnly = true)
    public Optional<Message> findByDate(Date date) {
        return messageRepository.findByMsgTimeSent(date);
    }


    // Delete by ID
    public void deleteById(Integer id) {
        if (!messageRepository.existsById(id)) {
            throw new IllegalArgumentException("Message ID " + id + " not found");
        }
        messageRepository.deleteById(id);
    }
}
