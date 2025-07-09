package com.example.demo.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Faculties")
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "facultyID")
    private Integer facultyID;

    @Column(name = "facultyname", nullable = false, length = 30)
    private String facultyName;

    public Faculty() { }

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
}
