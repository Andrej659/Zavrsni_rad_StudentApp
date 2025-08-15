import React from "react";
import "../css/YearSelector.css";

interface AcademicYear {
  acYrID: number;
  acYrName: string;
}

interface Props {
  academicYears: AcademicYear[];
  selectedAcademicYearId: number | null;
  onSelectAcademicYear: (id: number) => void;
}

const YearSelector: React.FC<Props> = ({
  academicYears,
  selectedAcademicYearId,
  onSelectAcademicYear,
}) => (
  <div className="year-selector">
    {academicYears.map((year) => (
      <button
        key={year.acYrID}
        className={selectedAcademicYearId === year.acYrID ? "active" : ""}
        onClick={() => onSelectAcademicYear(year.acYrID)}
      >
        {year.acYrName}
      </button>
    ))}
  </div>
);

export default YearSelector;
