package com.example.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "faculties")
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facultyid")
    private Integer facultyID;

    @Column(name = "facultyname", nullable = false, length = 50)
    private String facultyName;

    public Faculty() {}

    public Faculty(String facultyName) {
        this.facultyName = facultyName;
    }

    public Integer getFacultyID() {
        return facultyID;
    }

    public void setFacultyID(Integer facultyID) {
        this.facultyID = facultyID;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    @Override
    public String toString() {
        return "Faculty{" +
                "facultyID=" + facultyID +
                ", facultyName='" + facultyName + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Faculty faculty = (Faculty) o;
        return facultyID != null && facultyID.equals(faculty.facultyID);
    }

    @Override
    public int hashCode() {
        return facultyID != null ? facultyID.hashCode() : 0;
    }
}
