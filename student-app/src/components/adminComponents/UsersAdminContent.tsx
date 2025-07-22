import React, { useState, useEffect } from 'react';
import '../../css/MainContent.css';

interface Faculty {
facultyID: number;
facultyName: string;
}

const UsersAdminContent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState<number>(1); 
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

useEffect(() => {

const fetchFaculties = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/faculties'); // prilagodi adresu
        if (!response.ok) throw new Error('Failed to fetch faculties');
        const data = await response.json();
        setFaculties(data);

    } catch (error) {
        console.error('Error fetching faculties:', error);
        alert('Greška pri dohvaćanju fakulteta.');
    }
};

fetchFaculties();
}, []);

// ✅ Dodavanje korisnika
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

if (!username || !password || selectedFacultyId === null) {
    alert('Please fill out all fields');
    return;
}

const newUser = { 
    username,
    password,
    isAdmin,
    faculty: {
    facultyID: selectedFacultyId
    }
};

try {
    setLoading(true);
    const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
    });

    if (!response.ok) throw new Error('Failed to create user');

    const savedUser = await response.json();
    alert(`User "${savedUser.username}" added successfully.`);

    // Resetiraj polja
    setUsername('');
    setPassword('');
    setIsAdmin(1);
    setSelectedFacultyId(null);
} catch (error) {
    console.error('Error creating user:', error);
    alert('Greška pri dodavanju korisnika.');
} finally {
    setLoading(false);
}
};

return (
    <div className="content-box">
    <h3>Add New User</h3>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
        <label htmlFor="username">Username:</label>
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label htmlFor="isAdmin">Is Admin:</label>
        <select
        id="isAdmin"
        value={isAdmin}
        onChange={(e) => setIsAdmin(Number(e.target.value))}
        >
        <option value={1}>Ne</option>
        <option value={2}>Da</option>
        </select>

        <label htmlFor="faculty">Faculty:</label>
        <select
        id="faculty"
        value={selectedFacultyId ?? ''}
        onChange={(e) => setSelectedFacultyId(Number(e.target.value))}
        >
        <option value="" disabled>
            -- Select Faculty --
        </option>
        {faculties.map((faculty) => (
        <option key={faculty.facultyID} value={faculty.facultyID}>
            {faculty.facultyName}
        </option>
        ))}
        </select>

        <button type="submit" className="add-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
        </button>
    </form>
    </div>
);
};


export default UsersAdminContent;