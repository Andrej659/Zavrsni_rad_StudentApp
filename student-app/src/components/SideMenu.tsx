import React from "react";
import "../css/SideMenu.css";

interface Props {
  activeSection: "Chat" | "Calendar" | "Documents" | "Events";
  onChangeSection: (section: "Chat" | "Calendar" | "Documents" | "Events") => void;
}

const SideMenu: React.FC<Props> = ({ activeSection, onChangeSection }) => {
  const sections: ("Chat" | "Calendar" | "Documents" | "Events")[] = [
    "Chat",
    "Calendar",
    "Documents",
    "Events",
  ];

  return (
    <div className="side-menu">
      {sections.map((section) => (
        <div
          key={section}
          className={`side-menu-option ${
            activeSection === section ? "active" : ""
          }`}
          onClick={() => onChangeSection(section)}
        >
          {section}
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
