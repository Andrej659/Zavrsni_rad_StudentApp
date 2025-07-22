import React from 'react';
import '../css/MainContent.css';
import ChatBox from '../components/ChatBox';

interface Props {
  section: 'Chat' | 'Calendar' | 'Documents';
  year: number;
}

const MainContent: React.FC<Props> = ({ section, year }) => {
  return (
    <div className="main-content">
      <h2>{section} - {year}. Year</h2>
      <div className="content-box">
        {section === 'Chat' && <ChatBox />}
      </div>
    </div>
  );
};

export default MainContent;
