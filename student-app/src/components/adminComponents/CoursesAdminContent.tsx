import React, { useEffect, useState } from 'react';

interface Faculty {
    facultyID: number;
    facultyName: string;
    }

interface AcademicYear {
    acYrID: number;
    acYrName: string;
}

const CoursesAdminContent: React.FC = () => {
    const [courseName, setCourseName] = useState('');
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
    const [selectedYearId, setSelectedYearId] = useState<number | null>(null);


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

    useEffect(() => {

        const fetchAcademicYears = async () => {
            if (selectedFacultyId === null) {
            setAcademicYears([]);
            return;
            }
            try {

                const token = localStorage.getItem('token');
                
                const response = await fetch(`http://localhost:8080/api/academic-years/faculty/${selectedFacultyId}`, {
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch faculties');
                const data = await response.json();
                setAcademicYears(data);
            } catch (error) {
                console.error('Error fetching academic years:', error);
                setAcademicYears([]);
            }
        };
        fetchAcademicYears();
    }, [selectedFacultyId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!courseName || selectedFacultyId === null || selectedYearId === null) {
            alert('Please fill in all fields.');
        return;
        }

    const course = {
        courseName: courseName,
        academicYear: {
            acYrID: selectedYearId
            }
        };

        console.log(
            course
        );
        

        try {
            
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/courses', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(course),
            });

            if (response.ok) {
                alert('Course added successfully!');
                setCourseName('');
                setSelectedFacultyId(null);
                setSelectedYearId(null);
                setAcademicYears([]);
            } else {
                const msg = await response.text();
                console.error('Server error:', msg);
                alert('Failed to add course.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Network error.');
        }
    };

    return (
        <div className="content-box">
        <h3>Add Course</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
            <label htmlFor="courseName">Course Name:</label>
            <input
            id="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="e.g. Web Development"
            />

            <label htmlFor="faculty">Select Faculty:</label>
            <select
            id="faculty"
            value={selectedFacultyId ?? ''}
            required
            onChange={(e) => setSelectedFacultyId(Number(e.target.value))}
            >
            <option value="" disabled>-- Select Faculty --</option>
            {faculties.map(f => (
                <option key={f.facultyID} value={f.facultyID}>{f.facultyName}</option>
            ))}
            </select>

            <label htmlFor="year">Select Academic Year:</label>
            <select
            id="year"
            value={selectedYearId ?? ''}
            required
            onChange={(e) => setSelectedYearId(Number(e.target.value))}
            disabled={academicYears.length === 0}
            >
            <option value="" disabled>
                {selectedFacultyId ? '-- Select Year --' : 'Select Faculty First'}
            </option>
            {academicYears.map((yr) => (
            <option key={yr.acYrID} value={yr.acYrID}>{yr.acYrName}</option>
            ))}
            </select>

            <button type="submit" className="add-btn">Add Course</button>
        </form>
        </div>
    );
};

export default CoursesAdminContent;
