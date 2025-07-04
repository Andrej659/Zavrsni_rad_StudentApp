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
      <YearSelector selectedYear={selectedYear} onSelectYear={setSelectedYear} />
      <div className="content-wrapper">
        <SideMenu activeSection={activeSection} onChangeSection={setActiveSection} />
        <MainContent section={activeSection} year={selectedYear} />
      </div>
    </div>
  );
};

export default HomePage;
