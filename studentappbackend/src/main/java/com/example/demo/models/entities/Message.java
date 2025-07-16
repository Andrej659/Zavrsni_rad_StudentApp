package com.example.demo.models.entities;


import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "msgID")
    private Integer msgID;

    @Column(name = "msgcontent", nullable = false, length = 200)
    private String msgContent;

    @Column(name = "msgtimesent", nullable = false)
    private Date msgTimeSent;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "acyrid", nullable = false)
    private AcademicYear academicYear;

    public Message() {
    }

    public Message(String msgContent, Date msgTimeSent, User user, AcademicYear academicYear) {
        this.msgContent = msgContent;
        this.msgTimeSent = msgTimeSent;
        this.user = user;
        this.academicYear = academicYear;
    }

    public Integer getDocID() {
        return msgID;
    }

    public void setDocID(Integer docID) {
        this.msgID = docID;
    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Message that = (Message) o;
        return msgID != null && msgID.equals(that.msgID);
    }

    @Override
    public String toString() {
        return "Message{" +
                "msgID=" + msgID +
                ", msgContent='" + msgContent + '\'' +
                ", msgTimeSent='" + msgTimeSent + '\'' +
                ", user='" + user + '\'' +
                ", academicYear=" + academicYear +
                '}';
    }

    @Override
    public int hashCode() {
        return msgID != null ? msgID.hashCode() : 0;
    }
}
