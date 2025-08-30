import React, { useState, useEffect } from "react";
import "../../css/MainContent.css";

interface Faculty {
  facultyID: number;
  facultyName: string;
}

const FacultiesContent: React.FC = () => {
  const [facultyName, setFacultyName] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyIdToRemove, setSelectedFacultyIdToRemove] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/faculties`, {
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
      alert("Greška pri dohvaćanju fakulteta.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facultyName.trim()) {
      alert("Faculty name is required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/faculties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ facultyName }),
      });

      if (!response.ok) throw new Error("Failed to add faculty");

      const data = await response.json();
      alert(`Faculty "${data.facultyName}" added!`);
      setFacultyName("");
      fetchFaculties();
    } catch (error) {
      console.error(error);
      alert("There was an error adding the faculty.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFaculty = async () => {
    if (selectedFacultyIdToRemove === null) return;

    const confirmDelete = window.confirm(
      "Jesi li siguran da želiš obrisati ovaj fakultet?"
    );
    if (!confirmDelete) return;

    try {
      setRemoving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/faculties/${selectedFacultyIdToRemove}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete faculty");

      alert("Fakultet obrisan.");
      setSelectedFacultyIdToRemove(null);
      fetchFaculties();
    } catch (error) {
      console.error("Error deleting faculty:", error);
      alert("Greška pri brisanju fakulteta.");
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
        <h3 style={{ marginBottom: "20px" }}>Add New Faculty</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <label htmlFor="facultyName">Faculty Name:</label>
          <input
            id="facultyName"
            type="text"
            className="form-input"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            placeholder="Enter faculty name"
          />
          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Faculty"}
          </button>
        </form>
      </div>

      <div style={{ flex: 1, minWidth: "300px" }}>
        <h3 style={{ marginBottom: "20px" }}>Remove Faculty</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label htmlFor="facultyToRemove">Select Faculty:</label>
          <select
            id="facultyToRemove"
            className="form-input"
            value={selectedFacultyIdToRemove ?? ""}
            onChange={(e) =>
              setSelectedFacultyIdToRemove(Number(e.target.value))
            }
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

          <button
            onClick={handleRemoveFaculty}
            className="add-btn"
            disabled={removing || selectedFacultyIdToRemove === null}
          >
            {removing ? "Removing..." : "Remove Faculty"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultiesContent;
