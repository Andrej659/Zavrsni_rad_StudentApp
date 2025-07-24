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

interface User {
    userID: number;
    username: string;
    faculty: Faculty;
}

const IsAttendingContent: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [faculty, setFaculty] = useState<Faculty | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    // Fetch all users with faculty info on mount
    useEffect(() => {
    const fetchUsers = async () => {
        const res = await fetch('http://localhost:8080/api/users');
        const data = await res.json();
        setUsers(data);
        };
        fetchUsers();
    }, []);

  // Kad se promijeni user, pronađi faculty i sve courses s tog fakulteta
    useEffect(() => {
        const loadCoursesForFaculty = async () => {
        if (!selectedUserId) {
            setFaculty(null);
            setCourses([]);
            return;
        }
        const user = users.find(u => u.userID === selectedUserId);
        if (!user) {
            setFaculty(null);
            setCourses([]);
            return;
        }
        setFaculty(user.faculty);

        const yearsRes = await fetch(`http://localhost:8080/api/academic-years/faculty/${user.faculty.facultyID}`);
        const yearsData: AcademicYear[] = await yearsRes.json();

        let allCourses: Course[] = [];
        for (const year of yearsData) {
            const coursesRes = await fetch(`http://localhost:8080/api/courses/academic-year/${year.acYrID}`);
            const coursesData: Course[] = await coursesRes.json();
            allCourses = allCourses.concat(coursesData);
        }
        setCourses(allCourses);
        };
        loadCoursesForFaculty();
    }, [selectedUserId, users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !selectedCourseId) {
        alert('Please select both user and course.');
        return;
        }
        const isAttending = {
        user: { userID: selectedUserId },
        course: { courseID: selectedCourseId }
        };
        try {
        const res = await fetch('http://localhost:8080/api/is-attending', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isAttending)
        });
        if (res.ok) {
            alert('Saved!');
            setSelectedUserId(null);
            setFaculty(null);
            setCourses([]);
            setSelectedCourseId(null);
        } else {
            alert('Save failed.');
        }
        } catch {
        alert('Network error.');
        }
    };

    return (
        <div className="content-box">
        <h3>Add IsAttending</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px'}}>
            <label htmlFor="user">Select User:</label>
            <select
            id="user"
            value={selectedUserId ?? ''}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
            >
            <option value="" disabled>-- Select User --</option>
            {users.map(u => (
                <option key={u.userID} value={u.userID}>{u.username}</option>
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
                {faculty ? '-- Select Course --' : 'Select User First'}
            </option>
            {courses.map(c => (
                <option key={c.courseID} value={c.courseID}>{c.courseName}</option>
            ))}
            </select>

            <button type="submit" className="add-btn">Save</button>
        </form>
        </div>
    );
};

export default IsAttendingContent;
