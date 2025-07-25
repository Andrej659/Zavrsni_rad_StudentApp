import React, { useEffect, useState } from 'react';
import YearSelector from '../components/YearSelector';
import SideMenu from '../components/SideMenu';
import MainContent from '../components/MainContent';
import '../css/HomePage.css';

interface AcademicYear {
  acYrID: number;
  acYrName: string;
}

const HomePage: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<'Chat' | 'Calendar' | 'Documents'>('Chat');

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId: number | null = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userID;
      } catch { userId = null; }
    }
    if (!userId || !token) {
      console.log("Nema userId-a ili tokena, izlazim iz useEffect-a");
      return;
    } 

    fetch(`http://localhost:8080/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
      return res.json();
    })
      .then(user => {
        const facultyId = user.faculty?.facultyID;
        console.log(facultyId)
        if (!facultyId) return;

        // Fetch academic years za faculty
        fetch(`http://localhost:8080/api/academic-years/faculty/${facultyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
          .then(res => {
            return res.json();
          })
          .then((data: AcademicYear[]) => {
            setAcademicYears(data);
            if (data.length > 0) setSelectedAcademicYearId(data[0].acYrID);
          });
      });
  }, []);

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-white">Student</span>
            <span className="logo-orange">App</span>
          </h1>
          <YearSelector
            academicYears={academicYears}
            selectedAcademicYearId={selectedAcademicYearId}
            onSelectAcademicYear={setSelectedAcademicYearId}
          />
        </div>
        {/* Dodaj header actions po potrebi */}
      </header>

      <div className="content-wrapper">
        <SideMenu activeSection={activeSection} onChangeSection={setActiveSection} />
        <MainContent
          section={activeSection}
          academicYearId={selectedAcademicYearId}
        />
      </div>
    </div>
  );
};

export default HomePage;
