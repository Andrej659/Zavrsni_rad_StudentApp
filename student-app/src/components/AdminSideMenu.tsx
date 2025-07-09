import React from 'react';
import '../css/SideMenu.css'; // koristi isti CSS kao user SideMenu

interface Props {
  activeSection: 'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' | 'Documents';
  onChangeSection: (
    section: 'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' | 'Documents'
  ) => void;
}

const AdminSideMenu: React.FC<Props> = ({ activeSection, onChangeSection }) => {
  const sections: Props['activeSection'][] = [
    'Users',
    'Faculties',
    'AcademicYear',
    'Courses',
    'Events',
    'Documents',
  ];

  return (
    <div className="side-menu">
      {sections.map((section) => (
        <div
          key={section}
          className={`side-menu-option ${activeSection === section ? 'active' : ''}`}
          onClick={() => onChangeSection(section)}
        >
          {section}
        </div>
      ))}
    </div>
  );
};

export default AdminSideMenu;
