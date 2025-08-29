import React from 'react';
import '../../css/MainContent.css';
import UsersAdminContent from './UsersAdminContent';
import FacultiesAdminContent from './FacultiesAdminContent';
import AcademicYearAdminContent from './AcademicYearAdminContent';
import CoursesAdminContent from './CoursesAdminContent';
import EventsAdminContent from './EventsAdminContent';

interface Props {
  section: 'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' ;
}

const AdminMainContent: React.FC<Props> = ({ section }) => {

const renderSection = () => {

    switch (section) {
      case 'Users':
        return <UsersAdminContent />;
      case 'Faculties':
        return <FacultiesAdminContent />;
      case 'AcademicYear':
        return <AcademicYearAdminContent />;
      case 'Courses':
        return <CoursesAdminContent />;
      case 'Events':
        return <EventsAdminContent />;
      default:
        return <p>Unknown section</p>;
    }
  };


  return (
    <div className="main-content">
      {renderSection()}
    </div>
  );
};

export default AdminMainContent;
