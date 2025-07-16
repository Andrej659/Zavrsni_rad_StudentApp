package com.example.demo.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "courseid")
    private Integer courseID;

    @Column(name = "coursename", nullable = false, length = 30)
    private String courseName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acyrid", nullable = false)
    private AcademicYear academicYear;


    // Default constructor
    public Course() {}

    // Constructor with parameters
    public Course(String courseName, AcademicYear academicYear) {
        this.courseName = courseName;
        this.academicYear = academicYear;
    }

    // Getters and Setters
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

    // toString method
    @Override
    public String toString() {
        return "Course{" +
                "courseID=" + courseID +
                ", courseName='" + courseName + '\'' +
                ", academicYear=" + academicYear +
                '}';
    }

    // equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Course course = (Course) o;
        return courseID != null && courseID.equals(course.courseID);
    }

    @Override
    public int hashCode() {
        return courseID != null ? courseID.hashCode() : 0;
    }
}

