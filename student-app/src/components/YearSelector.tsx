import React from 'react';
import '../css/YearSelector.css';

interface Props {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

const YearSelector: React.FC<Props> = ({ selectedYear, onSelectYear }) => {
  return (
    <div className="year-selector">
      {[1, 2, 3].map((year) => (
        <button
          key={year}
          className={selectedYear === year ? 'active' : ''}
          onClick={() => onSelectYear(year)}
        >
          {year}. Year
        </button>
      ))}
    </div>
  );
};

export default YearSelector;
