import React, { useState } from 'react';
import YearSelector from '../components/YearSelector';
import SideMenu from '../components/SideMenu';
import MainContent from './MainContent';
import '../css/HomePage.css';

const HomePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [activeSection, setActiveSection] = useState<'Chat' | 'Calendar' | 'Documents'>('Chat');

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
          <button className="header-btn">Profile</button>
          <button className="header-btn logout">Logout</button>
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
