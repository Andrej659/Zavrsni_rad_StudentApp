package com.example.demo.services;

import com.example.demo.models.entities.Faculty;
import com.example.demo.models.entities.User;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional(readOnly = true)
    public boolean isUserAnAdmin(Integer userID) {

        User user = userRepository.findById(userID)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userID));
        Integer admin = user.getIsAdmin();

        if (admin == 1){
            return true;
        } else return admin == 0;
    }

    @Transactional(readOnly = true)
    public Faculty findFacultyOfTheUser(Integer userID) {

        User user = userRepository.findById(userID)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + userID));
        return user.getFaculty();
    }

    public void deleteById(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User with ID " + id + " not found");
        }
        userRepository.deleteById(id);
    }
}
