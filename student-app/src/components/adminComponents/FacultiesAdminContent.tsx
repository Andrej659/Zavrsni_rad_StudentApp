import React, { useState } from 'react';
import '../../css/MainContent.css'; // koristi postojeći stil content-boxa

const FacultiesContent: React.FC = () => {
  const [facultyName, setFacultyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!facultyName.trim()) {
      alert('Faculty name is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/faculties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facultyName: facultyName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add faculty');
      }

      const data = await response.json();
      alert(`Faculty "${data.name}" added!`);
      setFacultyName('');
      
    } catch (error) {
      console.error(error);
      alert('There was an error adding the faculty.');
    }
  };

  return (
    <div className="content-box">
      <h3>Add New Faculty</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
        <label htmlFor="facultyName">Faculty Name:</label>
        <input
          id="facultyName"
          type="text"
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
          placeholder="Enter faculty name"
        />
        <button type="submit" className="add-btn">Add Faculty</button>
      </form>
    </div>
  );
};

export default FacultiesContent;
