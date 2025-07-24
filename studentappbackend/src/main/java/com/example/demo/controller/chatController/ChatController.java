package com.example.demo.controller.chatController;

import com.example.demo.models.entities.AcademicYear;
import com.example.demo.models.entities.ChatMessage;
import com.example.demo.models.entities.Message;
import com.example.demo.models.entities.User;
import com.example.demo.controller.dbControllers.AcademicYrService;
import com.example.demo.services.MessageService;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final MessageService messageService;
    private final UserService userService;
    private final AcademicYrService academicYearService;

    @Autowired
    public ChatController(
            MessageService messageService,
            UserService userService,
            AcademicYrService academicYearService
    ) {
        this.messageService = messageService;
        this.userService = userService;
        this.academicYearService = academicYearService;
    }

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public Message handleIncomingMessage(ChatMessage dto) {
        Message message = new Message();

        message.setMsgContent(dto.getMsgContent());
        message.setMsgTimeSent(dto.getMsgTimeSent());

        User user = userService.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AcademicYear year = academicYearService.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new RuntimeException("Academic year not found"));

        message.setUser(user);
        message.setAcademicYear(year);

        return messageService.save(message);
    }
}

