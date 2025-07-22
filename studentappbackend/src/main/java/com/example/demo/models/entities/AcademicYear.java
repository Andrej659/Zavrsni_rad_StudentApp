package com.example.demo.models.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "academicyear")
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "acyrid")
    private Integer acYrID;

    @Column(name = "acyrname", nullable = false, length = 30)
    private String acYrName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facultyid", nullable = false)
    private Faculty faculty;

    // Default constructor
    public AcademicYear() {}

    // Constructor with parameters
    public AcademicYear(String acYrName, Faculty faculty) {
        this.acYrName = acYrName;
        this.faculty = faculty;
    }

    public String getAcYrName() {
        return acYrName;
    }

    public void setAcYrName(String acYrName) {
        this.acYrName = acYrName;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public Integer getAcYrID() {
        return acYrID;
    }

    public void setAcYrID(Integer acYrID) {
        this.acYrID = acYrID;
    }

    // toString method
    @Override
    public String toString() {
        return "AcademicYear{" +
                "acYrID=" + acYrID +
                ", acYrName='" + acYrName + '\'' +
                ", faculty=" + faculty +
                '}';
    }

    // equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AcademicYear that = (AcademicYear) o;
        return acYrID != null && acYrID.equals(that.acYrID);
    }

    @Override
    public int hashCode() {
        return acYrID != null ? acYrID.hashCode() : 0;
    }
}