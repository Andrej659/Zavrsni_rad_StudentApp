import React from "react";
import "../css/MainContent.css";
import ChatBox from "./sidemenuComponents/ChatBox";
import CalendarContent from "./sidemenuComponents/CalendarContent";
import DocumentsContent from "./sidemenuComponents/DocumentContent";

interface Props {
  section: "Chat" | "Calendar" | "Documents";
  academicYearId: number | null;
}

const MainContent: React.FC<Props> = ({ section, academicYearId }) => (
  <div className="main-content">
    <div className="content-box">
      {section === "Chat" && academicYearId && (
        <ChatBox academicYearId={academicYearId} />
      )}
      {section === "Calendar" && <CalendarContent />}
      {section === "Documents" && <DocumentsContent />}
    </div>
  </div>
);

export default MainContent;
