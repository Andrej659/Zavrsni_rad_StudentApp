import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YearSelector from "../components/YearSelector";
import SideMenu from "../components/SideMenu";
import MainContent from "../components/MainContent";
import "../css/HomePage.css";
import menuIcon from "../assets/menu.png";

interface AcademicYear {
  acYrID: number;
  acYrName: string;
}

const HomePage: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<
    number | null
  >(null);
  const [activeSection, setActiveSection] = useState<
    "Chat" | "Calendar" | "Documents" | "Events"
  >("Chat");
  const [sideMenuVisible, setSideMenuVisible] = useState(true);

  const handleNoToken = () => {
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId: number | null = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.userID;
      } catch {
        userId = null;
      }

      if (!userId) {
        handleNoToken();
        alert("No user ID found in token");
        return;
      }
    } else {
      handleNoToken();
      alert("No token found in localStorage");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((user) => {
        const facultyId = user.faculty?.facultyID;
        if (facultyId) {
          localStorage.setItem("facultyId", facultyId);
        } else {
          console.error("Faculty ID not found in user data");
          return;
        }

        fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/academic-years/faculty/${facultyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data: AcademicYear[]) => {
            setAcademicYears(data);
            if (data.length > 0) setSelectedAcademicYearId(data[0].acYrID);
          });
      });
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("facultyId");
    navigate("/");
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-row">
          <h1
            className="logo"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <span className="logo-white">Student</span>
            <span className="logo-orange">App</span>
          </h1>
          <button className="header-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="sub-header-row">
          <button
            className={`toggle-menu-icon ${sideMenuVisible ? "active" : ""}`}
            onClick={() => setSideMenuVisible((prev) => !prev)}
          >
            <img src={menuIcon} alt="Toggle menu" />
          </button>

          {activeSection === "Chat" && (
            <YearSelector
              academicYears={academicYears}
              selectedAcademicYearId={selectedAcademicYearId}
              onSelectAcademicYear={setSelectedAcademicYearId}
            />
          )}
        </div>
      </header>

      <div className="content-wrapper">
        {sideMenuVisible && (
          <SideMenu
            activeSection={activeSection}
            onChangeSection={setActiveSection}
          />
        )}

        <MainContent
          section={activeSection}
          academicYearId={selectedAcademicYearId}
        />
      </div>
    </div>
  );
};

export default HomePage;
