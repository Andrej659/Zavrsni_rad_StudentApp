import React from 'react';
import '../css/MainContent.css';
import ChatBox from '../components/ChatBox';

interface Props {
  section: 'Chat' | 'Calendar' | 'Documents';
  academicYearId: number | null;
}

const MainContent: React.FC<Props> = ({ section, academicYearId }) => (
  <div className="main-content">
    <div className="content-box">
      {section === 'Chat' && academicYearId && <ChatBox academicYearId={academicYearId} />}
      {/* {section === 'Calendar' && ...} */}
      {/* {section === 'Documents' && ...} */}
    </div>
  </div>
);

export default MainContent;

