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

interface Event {
  eventID: number;
  eventName: string;
}

const EventsAdminContent: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedEventIdToRemove, setSelectedEventIdToRemove] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchFaculties();
    fetchEvents();
  }, []);

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/faculties", {
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

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (!selectedFacultyId) {
      setAcademicYears([]);
      return;
    }
    const fetchYears = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8080/api/academic-years/faculty/${selectedFacultyId}`,
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
  }, [selectedFacultyId]);

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

    const event = {
      eventName,
      eventDate,
      course: { courseID: selectedCourseId },
    };

    try {
      setLoading(true);
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
        setSelectedFacultyId(null);
        setSelectedYearId(null);
        setSelectedCourseId(null);
        setAcademicYears([]);
        setCourses([]);
        fetchEvents();
      } else {
        const msg = await res.text();
        console.error("Server error:", msg);
        alert("Failed to add event.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEvent = async () => {
    if (selectedEventIdToRemove === null) return;

    const confirmDelete = window.confirm(
      "Jesi li siguran da želiš obrisati ovaj događaj?"
    );
    if (!confirmDelete) return;

    try {
      setRemoving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/events/${selectedEventIdToRemove}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete event");
      alert("Događaj obrisan.");
      setSelectedEventIdToRemove(null);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Greška pri brisanju događaja.");
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
        <h3 style={{ marginBottom: "20px" }}>Add Event</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <label htmlFor="eventName">Event Name:</label>
          <input
            id="eventName"
            type="text"
            className="form-input"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Midterm"
          />

          <label htmlFor="eventDate">Date & Time:</label>
          <input
            id="eventDate"
            type="datetime-local"
            className="form-input"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />

          <label htmlFor="faculty">Select Faculty:</label>
          <select
            id="faculty"
            className="form-input"
            value={selectedFacultyId ?? ""}
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
            onChange={(e) => setSelectedYearId(Number(e.target.value))}
            disabled={!academicYears.length}
          >
            <option value="" disabled>
              {selectedFacultyId ? "-- Select Year --" : "Select Faculty First"}
            </option>
            {academicYears.map((y) => (
              <option key={y.acYrID} value={y.acYrID}>
                {y.acYrName}
              </option>
            ))}
          </select>

          <label htmlFor="course">Select Course:</label>
          <select
            id="course"
            className="form-input"
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

          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>

      <div style={{ flex: 1, minWidth: "300px" }}>
        <h3 style={{ marginBottom: "20px" }}>Remove Event</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label htmlFor="eventToRemove">Select Event:</label>
          <select
            id="eventToRemove"
            className="form-input"
            value={selectedEventIdToRemove ?? ""}
            onChange={(e) => setSelectedEventIdToRemove(Number(e.target.value))}
          >
            <option value="" disabled>
              -- Select Event --
            </option>
            {events.map((event) => (
              <option key={event.eventID} value={event.eventID}>
                {event.eventName}
              </option>
            ))}
          </select>

          <button
            onClick={handleRemoveEvent}
            className="add-btn"
            disabled={removing || selectedEventIdToRemove === null}
          >
            {removing ? "Removing..." : "Remove Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsAdminContent;
