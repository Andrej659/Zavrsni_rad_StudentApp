import React, { useEffect, useState, useMemo } from "react";

interface Course {
  courseID: number;
  courseName: string;
  academicYear: { acYrID: number; acYrName: string };
}

interface User {
  userID: number;
  username: string;
}

interface DocumentType {
  docID: number;
  docName: string;
  filePath: string;
  user: User;
  course: Course;
}

const DocumentsContent: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      setAllCourses([]);
      return;
    }
    const loadCoursesForFaculty = async () => {
      try {
        const token = localStorage.getItem("token");
        const yearsRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/academic-years/faculty/${facultyID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!yearsRes.ok) throw new Error("Failed to fetch academic years");
        const yearsData = await yearsRes.json();

        let allCourses: Course[] = [];
        for (const year of yearsData) {
          const coursesRes = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/courses/academic-year/${year.acYrID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!coursesRes.ok)
            throw new Error(
              "Failed to fetch courses for academic year " + year.acYrID
            );
          const coursesData = await coursesRes.json();
          allCourses = allCourses.concat(coursesData);
        }
        setAllCourses(allCourses);
      } catch (error) {
        setAllCourses([]);
        console.error("Error loading courses for faculty:", error);
      }
    };
    loadCoursesForFaculty();
  }, [facultyID]);

  const filteredDocuments = documents.filter((doc) =>
    doc.docName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDocuments = async () => {
    if (!facultyID) {
      setDocuments([]);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/documents/faculty/${facultyID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      setDocuments([]);
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [facultyID]);

  function parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Molimo odaberite datoteku prije objave.");
      return;
    }

    if (!selectedCourseId || selectedCourseId === null) {
      alert("Molimo odaberite predmet prije objave.");
      return;
    }

    if (selectedFile.name.trim().length === 0) {
      alert("Naziv datoteke nije valjan.");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const userID = token ? parseJwt(token)?.userID : null;
      if (!userID) throw new Error("User not authenticated");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(
        "document",
        JSON.stringify({
          docName: selectedFile.name,
          user: { userID: userID },
          course: { courseID: selectedCourseId },
        })
      );

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/documents`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Upload failed");
      setSelectedFile(null);
      setSelectedCourseId("");
      fetchDocuments();
    } catch (e) {
      alert("Greška pri uploadu!");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docId: number, docName: string) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Downloading document:", docId, docName);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/documents/download/${docId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Neuspješno preuzimanje dokumenta");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = docName;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Greška pri preuzimanju dokumenta.");
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
        <h3 style={{ marginBottom: 20 }}>Objavi novi dokument</h3>
        <div
          style={{
            border: "2px dashed #1976d2",
            borderRadius: 10,
            minHeight: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            cursor: "pointer",
            background: selectedFile ? "#e6f4ff" : "#f9f9f9",
          }}
          onClick={() =>
            (document.getElementById("fileInput") as HTMLInputElement)?.click()
          }
        >
          {selectedFile ? (
            <span>{selectedFile.name}</span>
          ) : (
            <span style={{ color: "#888" }}>
              Klikni ovdje ili odaberi datoteku...
            </span>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          style={{ display: "none" }}
          onChange={(e) =>
            setSelectedFile(e.target.files ? e.target.files[0] : null)
          }
        />
        <div style={{ marginBottom: 16 }}>
          <select
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 7,
              border: "1px solid #bbb",
            }}
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            disabled={allCourses.length === 0}
          >
            <option value="">Odaberi predmet</option>
            {allCourses.map((c) => (
              <option key={c.courseID} value={c.courseID}>
                {c.courseName} ({c.academicYear.acYrName})
              </option>
            ))}
          </select>
        </div>
        <button
          className="button"
          onClick={handleUpload}
          disabled={!selectedFile || !selectedCourseId || uploading}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: 7,
            background: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            cursor: uploading ? "not-allowed" : "pointer",
            marginBottom: 8,
          }}
        >
          {uploading ? "Objavljujem..." : "Objavi dokument"}
        </button>
      </div>

      <div
        style={{
          flex: 2,
          background: "#fff",
          borderRadius: 12,
          padding: 28,
          minWidth: 400,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <h3 style={{ marginBottom: 18 }}>Dokumenti za tvoj faks</h3>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <input
            type="text"
            placeholder="Pretraži po nazivu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #bbb",
            }}
          />
          <button
            onClick={() => {}}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Pretraži
          </button>
        </div>

        {documents.length === 0 ? (
          <div style={{ color: "#888", fontStyle: "italic" }}>
            Nema dostupnih dokumenata.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f7fa" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Naziv</th>
                <th style={{ padding: 10, textAlign: "left" }}>Predmet</th>
                <th style={{ padding: 10, textAlign: "left" }}>Objavio</th>
                <th style={{ padding: 10 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((d) => (
                <tr key={d.docID}>
                  <td style={{ padding: 10 }}>{d.docName}</td>
                  <td style={{ padding: 10 }}>{d.course.courseName}</td>
                  <td style={{ padding: 10 }}>
                    {d.user.username.split("@")[0]}
                  </td>
                  <td style={{ padding: 10 }}>
                    <button
                      onClick={() => handleDownload(d.docID, d.docName)}
                      style={{
                        color: "#1976d2",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DocumentsContent;
