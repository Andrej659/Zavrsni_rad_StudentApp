package com.example.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eventid")
    private Integer eventID;

    @Column(name = "eventname", nullable = false, length = 50)
    private String eventName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm", timezone = "UTC")
    @Column(name = "eventdate", nullable = false)
    private Date eventDate;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "courseid", nullable = false)
    private Course course;

    public Event() {
    }

    public Event(String eventName, Date eventDate, Course course) {
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.course = course;
    }

    public Integer getEventID() {
        return eventID;
    }

    public void setEventID(Integer eventID) {
        this.eventID = eventID;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Date getEventDate() {
        return eventDate;
    }

    public void setEventDate(Date eventDate) {
        this.eventDate = eventDate;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Event that = (Event) o;
        return eventID != null && eventID.equals(that.eventID);
    }

    @Override
    public String toString() {
        return "Event{" +
                "eventID=" + eventID +
                ", eventName='" + eventName + '\'' +
                ", course=" + course +
                '}';
    }

    @Override
    public int hashCode() {
        return eventID != null ? eventID.hashCode() : 0;
    }
}
