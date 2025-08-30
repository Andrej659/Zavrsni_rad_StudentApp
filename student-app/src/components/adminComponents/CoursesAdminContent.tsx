import React, { useEffect, useState } from "react";
import "../../css/MainContent.css";

interface Faculty {
  facultyID: number;
  facultyName: string;
}

interface AcademicYear {
  acYrID: number;
  acYrName: string;
}

interface Course {
  courseID: number;
  courseName: string;
}

const CoursesAdminContent: React.FC = () => {
  const [courseName, setCourseName] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [selectedCourseIdToRemove, setSelectedCourseIdToRemove] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchFaculties();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedFacultyId !== null) {
      fetchAcademicYearsByFaculty(selectedFacultyId);
    } else {
      setAcademicYears([]);
    }
  }, [selectedFacultyId]);

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/faculties", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch faculties");
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  const fetchAcademicYearsByFaculty = async (facultyId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/academic-years/faculty/${facultyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch academic years");
      const data = await response.json();
      setAcademicYears(data);
    } catch (error) {
      console.error("Error fetching academic years:", error);
      setAcademicYears([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName || selectedFacultyId === null || selectedYearId === null) {
      alert("Please fill in all fields.");
      return;
    }

    const course = {
      courseName: courseName,
      academicYear: {
        acYrID: selectedYearId,
      },
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        alert("Course added successfully!");
        setCourseName("");
        setSelectedFacultyId(null);
        setSelectedYearId(null);
        setAcademicYears([]);
        fetchCourses();
      } else {
        const msg = await response.text();
        console.error("Server error:", msg);
        alert("Failed to add course.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    if (selectedCourseIdToRemove === null) return;

    const confirmDelete = window.confirm(
      "Jesi li siguran da želiš obrisati ovaj kolegij?"
    );
    if (!confirmDelete) return;

    try {
      setRemoving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${selectedCourseIdToRemove}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete course");

      alert("Kolegij obrisan.");
      setSelectedCourseIdToRemove(null);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Greška pri brisanju kolegija.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div
      className="content-box"
      style={{
        display: "flex",
        gap: "48px",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: "300px" }}>
        <h3 style={{ marginBottom: "20px" }}>Add Course</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <label htmlFor="courseName">Course Name:</label>
          <input
            id="courseName"
            type="text"
            className="form-input"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g. Web Development"
          />

          <label htmlFor="faculty">Select Faculty:</label>
          <select
            id="faculty"
            className="form-input"
            value={selectedFacultyId ?? ""}
            required
            onChange={(e) => setSelectedFacultyId(Number(e.target.value))}
          >
            <option value="" disabled>
              -- Select Faculty --
            </option>
            {faculties.map((f) => (
              <option key={f.facultyID} value={f.facultyID}>
                {f.facultyName}
              </option>
            ))}
          </select>

          <label htmlFor="year">Select Academic Year:</label>
          <select
            id="year"
            className="form-input"
            value={selectedYearId ?? ""}
            required
            onChange={(e) => setSelectedYearId(Number(e.target.value))}
            disabled={academicYears.length === 0}
          >
            <option value="" disabled>
              {selectedFacultyId ? "-- Select Year --" : "Select Faculty First"}
            </option>
            {academicYears.map((yr) => (
              <option key={yr.acYrID} value={yr.acYrID}>
                {yr.acYrName}
              </option>
            ))}
          </select>

          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Course"}
          </button>
        </form>
      </div>

      <div style={{ flex: 1, minWidth: "300px" }}>
        <h3 style={{ marginBottom: "20px" }}>Remove Course</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label htmlFor="courseToRemove">Select Course:</label>
          <select
            id="courseToRemove"
            className="form-input"
            value={selectedCourseIdToRemove ?? ""}
            onChange={(e) =>
              setSelectedCourseIdToRemove(Number(e.target.value))
            }
          >
            <option value="" disabled>
              -- Select Course --
            </option>
            {courses.map((course) => (
              <option key={course.courseID} value={course.courseID}>
                {course.courseName}
              </option>
            ))}
          </select>

          <button
            onClick={handleRemoveCourse}
            className="add-btn"
            disabled={removing || selectedCourseIdToRemove === null}
          >
            {removing ? "Removing..." : "Remove Course"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesAdminContent;
