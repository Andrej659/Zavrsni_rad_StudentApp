import React from 'react';
import '../../css/MainContent.css';
import UsersAdminContent from './UsersAdminContent';
import FacultiesAdminContent from './FacultiesAdminContent';
import AcademicYearAdminContent from './AcademicYearAdminContent';
import CoursesAdminContent from './CoursesAdminContent';
import EventsAdminContent from './EventsAdminContent';
import IsAttendingAdminContent from './IsAttendingAdminContent';

interface Props {
  section: 'Users' | 'Faculties' | 'AcademicYear' | 'Courses' | 'Events' | 'IsAttending';
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
      case 'IsAttending':
        return <IsAttendingAdminContent />;
      default:
        return <p>Unknown section</p>;
    }
  };


  return (
    <div className="main-content">
      <h2>{section}</h2>
      {renderSection()}
    </div>
  );
};

export default AdminMainContent;
