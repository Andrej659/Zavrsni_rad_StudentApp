import React, { useEffect, useState } from "react";
import "../../css/MainContent.css";

interface Faculty {
  facultyID: number;
  facultyName: string;
}

interface AcademicYear {
  acYrID: number;
  acYrName: string;
  faculty: Faculty;
}

const AcademicYearAdminContent: React.FC = () => {
  const [acYrName, setAcYrName] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYearIdToRemove, setSelectedYearIdToRemove] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchFaculties();
    fetchAcademicYears();
  }, []);

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

  const fetchAcademicYears = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/academic-years", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch academic years");
      const data = await response.json();
      setAcademicYears(data);
    } catch (error) {
      console.error("Error fetching academic years:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acYrName || selectedFacultyId === null) {
      alert("Please enter year name and select faculty.");
      return;
    }

    const academicYear = {
      acYrName,
      faculty: {
        facultyID: selectedFacultyId,
      },
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/academic-years", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(academicYear),
      });

      if (response.ok) {
        alert("Academic year added successfully!");
        setAcYrName("");
        setSelectedFacultyId(null);
        fetchAcademicYears();
      } else {
        console.error("Server error:", await response.text());
        alert("Failed to add academic year.");
      }
    } catch (error) {
      console.error("Error submitting academic year:", error);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveYear = async () => {
    if (selectedYearIdToRemove === null) return;

    const confirmDelete = window.confirm(
      "Jesi li siguran da želiš obrisati akademsku godinu?"
    );
    if (!confirmDelete) return;

    try {
      setRemoving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/academic-years/${selectedYearIdToRemove}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete academic year");

      alert("Akademska godina obrisana.");
      setSelectedYearIdToRemove(null);
      fetchAcademicYears();
    } catch (error) {
      console.error("Error deleting academic year:", error);
      alert("Greška pri brisanju akademske godine.");
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
        <h3 style={{ marginBottom: "20px" }}>Add Academic Year</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <label htmlFor="yearName">Academic Year Name:</label>
          <input
            id="yearName"
            type="text"
            className="form-input"
            value={acYrName}
            onChange={(e) => setAcYrName(e.target.value)}
          />

          <label htmlFor="faculty">Select Faculty:</label>
          <select
            id="faculty"
            required
            className="form-input"
            value={selectedFacultyId ?? ""}
            onChange={(e) => setSelectedFacultyId(Number(e.target.value))}
          >
            <option value="" disabled>
              -- Select Faculty --
            </option>
            {faculties.map((faculty) => (
              <option key={faculty.facultyID} value={faculty.facultyID}>
                {faculty.facultyName}
              </option>
            ))}
          </select>

          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Academic Year"}
          </button>
        </form>
      </div>

      <div style={{ flex: 1, minWidth: "300px" }}>
        <h3 style={{ marginBottom: "20px" }}>Remove Academic Year</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label htmlFor="yearToRemove">Select Academic Year:</label>
          <select
            id="yearToRemove"
            className="form-input"
            value={selectedYearIdToRemove ?? ""}
            onChange={(e) => setSelectedYearIdToRemove(Number(e.target.value))}
          >
            <option value="" disabled>
              -- Select Year --
            </option>
            {academicYears.map((year) => (
              <option key={year.acYrID} value={year.acYrID}>
                {year.acYrName} ({year.faculty.facultyName})
              </option>
            ))}
          </select>

          <button
            onClick={handleRemoveYear}
            className="add-btn"
            disabled={removing || selectedYearIdToRemove === null}
          >
            {removing ? "Removing..." : "Remove Academic Year"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearAdminContent;
