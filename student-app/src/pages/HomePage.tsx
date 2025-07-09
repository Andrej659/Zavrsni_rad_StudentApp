import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YearSelector from '../components/YearSelector';
import SideMenu from '../components/SideMenu';
import MainContent from '../components/MainContent';
import '../css/HomePage.css';

const HomePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [activeSection, setActiveSection] = useState<'Chat' | 'Calendar' | 'Documents'>('Chat');

const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('user'); 
  navigate('/');
};

const handleProfile = () => {
  navigate('/profile');
};


  return (
    <div className="home-container">
      <header className="main-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-white">Student</span><span className="logo-orange">App</span>
          </h1>
          <div className="year-options">
            <YearSelector selectedYear={selectedYear} onSelectYear={setSelectedYear} />
          </div>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={handleProfile}>Profile</button>
          <button className="header-btn logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="content-wrapper">
        <SideMenu activeSection={activeSection} onChangeSection={setActiveSection} />
        <MainContent section={activeSection} year={selectedYear} />
      </div>
    </div>
  );
};

export default HomePage;
