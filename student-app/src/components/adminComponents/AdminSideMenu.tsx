import React from 'react';
import '../../css/SideMenu.css';

interface Props {
  activeSection: 'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' | 'IsAttending';
  onChangeSection: (
    section: 'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' | 'IsAttending'
  ) => void;
}

const AdminSideMenu: React.FC<Props> = ({ activeSection, onChangeSection }) => {
  const sections: Props['activeSection'][] = [
    'Users',
    'Faculties',
    'AcademicYear',
    'Courses',
    'Events',
    'IsAttending',
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
