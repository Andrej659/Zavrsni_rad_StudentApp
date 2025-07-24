import React, { useEffect, useState } from 'react';

interface Faculty {
    facultyID: number;
    facultyName: string;
}

const AcademicYearAdminContent: React.FC = () => {
    const [acYrName, setAcYrName] = useState('');
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);

  // Dohvati fakultete
    useEffect(() => {
        const fetchFaculties = async () => {
            try {

            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/faculties', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch faculties');
            const data = await response.json();
            setFaculties(data);

            } catch (error) {
                console.error('Error fetching faculties:', error);
            }
        };

        fetchFaculties();
    }, []);


        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!acYrName || selectedFacultyId === null) {
                alert('Please enter year name and select faculty.');
                return;
            }

            const academicYear = {
                acYrName: acYrName,
                faculty: {
                facultyID: selectedFacultyId,
                },
            };


            try {

                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:8080/api/academic-years', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(academicYear),
                });

                if (response.ok) {
                    alert('Academic year added successfully!');
                    setAcYrName('');
                    setSelectedFacultyId(null);
                } else {
                    console.error('Server error:', await response.text());
                    alert('Failed to add academic year.');
                }

            } catch (error) {
                console.error('Error submitting academic year:', error);
                alert('Network error.');
            }
        };

    return (
        <div className="content-box">
        <h3>Add Academic Year</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
        <label htmlFor="yearName">Academic Year Name:</label>
            <input
            id="yearName"
            type="text"
            value={acYrName}
            onChange={(e) => setAcYrName(e.target.value)}
            
            />

        <label htmlFor="faculty">Select Faculty:</label>
            <select
            id="faculty"
            required
            value={selectedFacultyId ?? ''}
            onChange={(e) => setSelectedFacultyId(Number(e.target.value))}
            >
            <option value="" disabled>-- Select Faculty --</option>
            {faculties.map((faculty) => (
                <option key={faculty.facultyID} value={faculty.facultyID}>
                {faculty.facultyName}
                </option>
            ))}
            </select>

        <button type="submit" className="add-btn">Add Academic Year</button>
        </form>
        </div>
    );
};

export default AcademicYearAdminContent;
