import React, { useEffect, useState } from 'react';

interface Faculty {
    facultyID: number;
    facultyName: string;
}

interface AcademicYear {
    acYrID: number;
    acYrName: string;
}

interface Course {
    courseID: number;
    courseName: string;
}

const EventsAdminContent: React.FC = () => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
    const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    // Fetch faculties on load
    useEffect(() => {
        const fetchFaculties = async () => {
        const res = await fetch('http://localhost:8080/api/faculties');
        const data = await res.json();
        setFaculties(data);
        };
    fetchFaculties();
    }, []);

  // Fetch academic years after faculty selected
    useEffect(() => {
    if (!selectedFacultyId) {
        setAcademicYears([]);
        return;
    }
    const fetchYears = async () => {
        const res = await fetch(`http://localhost:8080/api/academic-years/faculty/${selectedFacultyId}`);
        const data = await res.json();
        setAcademicYears(data);
        };
    fetchYears();
    }, [selectedFacultyId]);

  // Fetch courses after academic year selected
    useEffect(() => {
        if (!selectedYearId) {
            setCourses([]);
            return;
        }
        const fetchCourses = async () => {
        const res = await fetch(`http://localhost:8080/api/courses/academic-year/${selectedYearId}`);
        const data = await res.json();
        setCourses(data);
        };
    fetchCourses();
    }, [selectedYearId]);

  // Submit
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName || !eventDate || !selectedCourseId) {
        alert('Please fill in all fields.');
        return;
    }

    const event = {
        eventName,
        eventDate,
        course: { courseID: selectedCourseId },
    };
    console.log('Submitting event:', event);

    try {
        const res = await fetch('http://localhost:8080/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        });

        if (res.ok) {
            alert('Event added successfully!');
            setEventName('');
            setEventDate('');
            setSelectedFacultyId(null);
            setSelectedYearId(null);
            setSelectedCourseId(null);
            setAcademicYears([]);
            setCourses([]);
        } else {
            const msg = await res.text();
            console.error('Server error:', msg);
            alert('Failed to add event.');
        }
        } catch (err) {
        console.error('Submit error:', err);
        alert('Network error.');
        }
    };

    return (
        <div className="content-box">
        <h3>Add Event</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
            <label htmlFor="eventName">Event Name:</label>
            <input
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Midterm"
            />

            <label htmlFor="eventDate">Date & Time:</label>
            <input
            id="eventDate"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            />

            <label htmlFor="faculty">Select Faculty:</label>
            <select
            id="faculty"
            value={selectedFacultyId ?? ''}
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
            onChange={(e) => setSelectedYearId(Number(e.target.value))}
            disabled={!academicYears.length}
            >
            <option value="" disabled>
                {selectedFacultyId ? '-- Select Year --' : 'Select Faculty First'}
            </option>
            {academicYears.map(y => (
                <option key={y.acYrID} value={y.acYrID}>{y.acYrName}</option>
            ))}
            </select>

            <label htmlFor="course">Select Course:</label>
            <select
            id="course"
            value={selectedCourseId ?? ''}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            disabled={!courses.length}
            >
            <option value="" disabled>
                {selectedYearId ? '-- Select Course --' : 'Select Year First'}
            </option>
            {courses.map(c => (
                <option key={c.courseID} value={c.courseID}>{c.courseName}</option>
            ))}
            </select>

            <button type="submit" className="add-btn">Add Event</button>
        </form>
        </div>
    );
};

export default EventsAdminContent;
