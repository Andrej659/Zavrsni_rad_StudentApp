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
          `${import.meta.env.VITE_BACKEND_URL}/api/academic-years/faculty/${facultyID}`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/courses/academic-year/${selectedYearId}`,
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
      const res = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/events", {
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
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      <div
        style={{
          flex: 1,
          background: "#f6f9ff",
          borderRadius: 12,
          padding: 28,
          minWidth: 270,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Dodaj novi događaj</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div>
            <label htmlFor="eventName">Naziv događaja:</label>
            <input
              id="eventName"
              type="text"
              className="form-input"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="npr. Midterm"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #bbb",
                marginTop: "4px",
              }}
            />
          </div>

          <div>
            <label htmlFor="eventDate">Datum i vrijeme:</label>
            <input
              id="eventDate"
              type="datetime-local"
              className="form-input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #bbb",
                marginTop: "4px",
              }}
            />
          </div>

          <div>
            <label htmlFor="year">Akademska godina:</label>
            <select
              id="year"
              className="form-input"
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #bbb",
                marginTop: "4px",
              }}
            >
              <option value="">-- Odaberi godinu --</option>
              {academicYears.map((y) => (
                <option key={y.acYrID} value={y.acYrID}>
                  {y.acYrName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="course">Predmet:</label>
            <select
              id="course"
              className="form-input"
              value={selectedCourseId ?? ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              disabled={!courses.length}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #bbb",
                marginTop: "4px",
                backgroundColor: !courses.length ? "#f3f3f3" : "#fff",
              }}
            >
              <option value="" disabled>
                {selectedYearId
                  ? "-- Odaberi predmet --"
                  : "Prvo odaberi godinu"}
              </option>
              {courses.map((c) => (
                <option key={c.courseID} value={c.courseID}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="add-btn"
            style={{
              padding: "10px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Dodaj događaj
          </button>
        </form>
      </div>
    </div>
  );
};
export default EventsContent;
