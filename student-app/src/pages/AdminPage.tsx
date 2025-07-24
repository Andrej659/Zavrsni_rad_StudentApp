import React, { useState } from 'react';
import SideMenu from '../components/AdminSideMenu';
import AdminMainContent from '../components/AdminMainContent';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' | 'IsAttending'
  >('Users');

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-white">Student</span>
            <span className="logo-orange">App</span>
          </h1>
        </div>
        <div className="header-actions">
          <button className="header-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="content-wrapper">
        <SideMenu activeSection={activeSection} onChangeSection={setActiveSection} />
        <AdminMainContent section={activeSection} />
      </div>
    </div>
  );
};

export default AdminPage;
