import React, { useState, useEffect } from "react";
import "../../css/MainContent.css";

interface Faculty {
  facultyID: number;
  facultyName: string;
}

interface User {
  userID: number;
  username: string;
}

const UsersAdminContent: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState<number>(1);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIdToRemove, setSelectedUserIdToRemove] = useState<
    number | null
  >(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
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
        alert("Greška pri dohvaćanju fakulteta.");
      }
    };

    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Greška pri dohvaćanju korisnika.");
      }
    };

    fetchFaculties();
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || selectedFacultyId === null) {
      alert("Please fill out all fields");
      return;
    }

    const newUser = {
      username,
      password,
      isAdmin,
      faculty: {
        facultyID: selectedFacultyId,
      },
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to create user");
      const savedUser = await response.json();
      alert(`User "${savedUser.username}" added successfully.`);

      setUsername("");
      setPassword("");
      setIsAdmin(1);
      setSelectedFacultyId(null);

      const updatedUsers = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const updatedData = await updatedUsers.json();
      setUsers(updatedData);
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Greška pri dodavanju korisnika.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async () => {
    if (selectedUserIdToRemove === null) return;

    const confirm = window.confirm(
      "Jesi li siguran da želiš obrisati ovog korisnika?"
    );
    if (!confirm) return;

    try {
      setRemoving(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${selectedUserIdToRemove}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");
      alert("Korisnik obrisan.");

      const updatedUsers = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const updatedData = await updatedUsers.json();
      setUsers(updatedData);
      setSelectedUserIdToRemove(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Greška pri brisanju korisnika.");
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
        <h3 style={{ marginBottom: "20px" }}>Add New User</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="isAdmin">Is Admin:</label>
          <select
            id="isAdmin"
            className="form-input"
            value={isAdmin}
            onChange={(e) => setIsAdmin(Number(e.target.value))}
          >
            <option value={1}>Ne</option>
            <option value={2}>Da</option>
          </select>

          <label htmlFor="faculty">Faculty:</label>
          <select
            id="faculty"
            value={selectedFacultyId ?? ""}
            className="form-input"
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

          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </button>
        </form>
      </div>

      <div style={{ flex: 1, minWidth: "300px" }}>
        <h3 style={{ marginBottom: "20px" }}>Remove User</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label htmlFor="userToRemove">Select User:</label>
          <select
            id="userToRemove"
            value={selectedUserIdToRemove ?? ""}
            className="form-input"
            onChange={(e) => setSelectedUserIdToRemove(Number(e.target.value))}
          >
            <option value="" disabled>
              -- Select User --
            </option>
            {users.map((user) => (
              <option key={user.userID} value={user.userID}>
                {user.username}
              </option>
            ))}
          </select>

          <button
            onClick={handleRemoveUser}
            className="add-btn"
            disabled={removing || selectedUserIdToRemove === null}
          >
            {removing ? "Removing..." : "Remove User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersAdminContent;
