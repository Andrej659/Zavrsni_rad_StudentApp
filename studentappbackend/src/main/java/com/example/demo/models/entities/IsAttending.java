package com.example.demo.models.entities;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "isattending")
public class IsAttending {

    @EmbeddedId
    private IsAttendingId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseID")
    @JoinColumn(name = "courseid", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userID")
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    public IsAttending() {}

    public IsAttending(Course course, User user) {
        this.course = course;
        this.user   = user;
        this.id     = new IsAttendingId(course.getCourseID(), user.getUserID());
    }

    public IsAttendingId getId() {
        return id;
    }

    public void setId(IsAttendingId id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
        if (this.id == null) {
            this.id = new IsAttendingId();
        }
        this.id.setCourseID(course.getCourseID());
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (this.id == null) {
            this.id = new IsAttendingId();
        }
        this.id.setUserID(user.getUserID());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IsAttending that = (IsAttending) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "IsAttending{" +
                "courseID=" + id.getCourseID() +
                ", userID=" + id.getUserID() +
                '}';
    }
}
