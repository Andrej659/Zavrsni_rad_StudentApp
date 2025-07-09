import React from 'react';
import '../css/MainContent.css';

interface Props {
  section: 'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' | 'Documents';
}

const AdminMainContent: React.FC<Props> = ({ section }) => {
  return (
    <div className="main-content">
      <h2>{section}</h2>
      <div className="content-box">
        {/* Ovdje ide sadržaj za sekciju: {section} */}
        <p>This is the {section} section (content coming soon).</p>
      </div>
    </div>
  );
};

export default AdminMainContent;
