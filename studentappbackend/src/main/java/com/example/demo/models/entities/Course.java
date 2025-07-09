package com.example.demo.models.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer courseID;

    @Column(nullable = false, length = 30)
    private String courseName;

    // Veza na academicYear (m:1)
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "acYrID", nullable = false)
    private AcademicYear academicYear;

    // Many-to-many veza na Users preko isAttending
    @ManyToMany(mappedBy = "courses")
    private Set<User> attendees = new HashSet<>();

    public Course() {}


    public Integer getCourseID() {
        return courseID;
    }

    public void setCourseID(Integer courseID) {
        this.courseID = courseID;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public AcademicYear getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYear academicYear) {
        this.academicYear = academicYear;
    }

    public Set<User> getAttendees() {
        return attendees;
    }

    public void setAttendees(Set<User> attendees) {
        this.attendees = attendees;
    }
}

