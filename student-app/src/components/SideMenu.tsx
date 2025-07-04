import React from 'react';
import '../css/SideMenu.css';

interface Props {
  activeSection: 'Chat' | 'Calendar' | 'Documents';
  onChangeSection: (section: 'Chat' | 'Calendar' | 'Documents') => void;
}

const SideMenu: React.FC<Props> = ({ activeSection, onChangeSection }) => {
  const sections: ('Chat' | 'Calendar' | 'Documents')[] = ['Chat', 'Calendar', 'Documents'];

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

export default SideMenu;
