package com.example.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class ChatMessage {

    private String msgContent;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm", timezone = "UTC")
    private Date msgTimeSent;
    private Integer userId;
    private Integer academicYearId;

    public String getMsgContent() {
        return msgContent;
    }

    public void setMsgContent(String msgContent) {
        this.msgContent = msgContent;
    }

    public Date getMsgTimeSent() {
        return msgTimeSent;
    }

    public void setMsgTimeSent(Date msgTimeSent) {
        this.msgTimeSent = msgTimeSent;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getAcademicYearId() {
        return academicYearId;
    }

    public void setAcademicYearId(Integer academicYearId) {
        this.academicYearId = academicYearId;
    }
}

