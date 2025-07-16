package com.example.demo.models.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "docid")
    private Integer docID;

    @Column(name = "docname", nullable = false, length = 30)
    private String docName;

    @Column(name = "doclocation", nullable = false, length = 100)
    private String docLocation;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "courseid", nullable = false)
    private Course course;

    public Document() {
    }

    public Document(String docname, String doclocation, User user, Course course) {
        this.docName = docname;
        this.docLocation = doclocation;
        this.user = user;
        this.course = course;
    }

    public String getDocname() {
        return docName;
    }

    public void setDocname(String docName) {
        this.docName = docName;
    }

    public String getDoclocation() {
        return docLocation;
    }

    public void setDoclocation(String docLocation) {
        this.docLocation = docLocation;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

        Document that = (Document) o;
        return docID != null && docID.equals(that.docID);
    }

    @Override
    public String toString() {
        return "Document{" +
                "docID=" + docID +
                ", docName='" + docName + '\'' +
                ", user='" + user + '\'' +
                ", course=" + course +
                '}';
    }

    @Override
    public int hashCode() {
        return docID != null ? docID.hashCode() : 0;
    }
}
