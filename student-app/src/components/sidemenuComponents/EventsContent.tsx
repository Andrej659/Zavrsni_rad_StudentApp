import React, { useEffect, useState, useMemo } from "react";

interface AcademicYear {
  acYrID: number;
  acYrName: string;
}

interface Course {
  courseID: number;
  courseName: string;
}

const EventsContent: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | "">("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const facultyID = useMemo(() => {
    try {
      const facultyId = localStorage.getItem("facultyId");
      if (!facultyId) return null;
      return facultyId;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!facultyID) {
      setAcademicYears([]);
      return;
    }
    const fetchYears = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8080/api/academic-years/faculty/${facultyID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch academic years");
        const data = await res.json();
        setAcademicYears(data);
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };
    fetchYears();
  }, [facultyID]);

  useEffect(() => {
    if (!selectedYearId) {
      setCourses([]);
      return;
    }

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/courses/academic-year/${selectedYearId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [selectedYearId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName || !eventDate || !selectedCourseId) {
      alert("Please fill in all fields.");
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\sčćžšđČĆŽŠĐ]+$/;

    if (!eventName.trim()) {
      alert("Naziv događaja je obavezan.");
      return;
    }

    if (eventName.length > 50) {
      alert("Naziv događaja ne smije biti duži od 50 znakova.");
      return;
    }

    if (!nameRegex.test(eventName)) {
      alert("Naziv smije sadržavati samo slova i brojeve.");
      return;
    }

    const event = {
      eventName,
      eventDate,
      course: { courseID: selectedCourseId },
    };

    const selectedDate = new Date(eventDate);
    const now = new Date();
    if (selectedDate < now) {
      alert("Ne možeš odabrati datum u prošlosti.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      if (res.ok) {
        alert("Event added successfully!");
        setEventName("");
        setEventDate("");
        setSelectedYearId("");
        setSelectedCourseId(null);
        setAcademicYears([]);
        setCourses([]);
      } else {
        const msg = await res.text();
        console.error("Server error:", msg);
        alert("Failed to add event.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error.");
    }
  };

  return (
    <div className="content-box">
      <h3>Add an Event</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "300px",
        }}
      >
        <label htmlFor="eventName">Event Name:</label>
        <input
          id="eventName"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g. Midterm"
        />

        <label htmlFor="eventDate">Date & Time:</label>
        <input
          id="eventDate"
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <label htmlFor="year">Select Academic Year:</label>
        <select
          id="year"
          value={selectedYearId}
          onChange={(e) => setSelectedYearId(Number(e.target.value))}
        >
          <option value="">-- Select Academic Year --</option>
          {academicYears.map((y) => (
            <option key={y.acYrID} value={y.acYrID}>
              {y.acYrName}
            </option>
          ))}
        </select>

        <label htmlFor="course">Select Course:</label>
        <select
          id="course"
          value={selectedCourseId ?? ""}
          onChange={(e) => setSelectedCourseId(Number(e.target.value))}
          disabled={!courses.length}
        >
          <option value="" disabled>
            {selectedYearId ? "-- Select Course --" : "Select Year First"}
          </option>
          {courses.map((c) => (
            <option key={c.courseID} value={c.courseID}>
              {c.courseName}
            </option>
          ))}
        </select>

        <button type="submit" className="add-btn">
          Add Event
        </button>
      </form>
    </div>
  );
};

export default EventsContent;
