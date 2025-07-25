package com.example.demo.repository;

import com.example.demo.models.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface MessageRepository  extends JpaRepository<Message, Integer> {

    Optional<Message> findByMsgContent(String msgContent);
    Optional<Message> findByMsgTimeSent(Date msgTimeSent);
    List<Message> findByAcademicYear_AcYrID(Integer acYrID);

}
