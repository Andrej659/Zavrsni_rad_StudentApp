package com.example.demo.models.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;


@Embeddable
public class IsAttendingId implements Serializable {

    @Column(name = "courseid", nullable = false)
    private Integer courseID;

    @Column(name = "userid", nullable = false)
    private Integer userID;

    public IsAttendingId() {}

    public IsAttendingId(Integer courseID, Integer userID) {
        this.courseID = courseID;
        this.userID = userID;
    }

    public Integer getCourseID() {
        return courseID;
    }

    public void setCourseID(Integer courseID) {
        this.courseID = courseID;
    }

    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer userID) {
        this.userID = userID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IsAttendingId that = (IsAttendingId) o;
        return Objects.equals(courseID, that.courseID) &&
                Objects.equals(userID, that.userID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseID, userID);
    }
}