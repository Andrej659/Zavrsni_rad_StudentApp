import React, { useEffect, useState } from 'react';

interface Faculty {
  facultyID: number;
  facultyName: string;
}

interface SignUpFormProps {
  onSuccess: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/faculties');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || selectedFacultyId === null) {
      alert('Please fill out all fields');
      return;
    }

    const newUser = {
      username,
      password,
      isAdmin: 1, // SignUp uvijek obični korisnik!
      faculty: { facultyID: selectedFacultyId }
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      alert(`Korisnik "${username}" je uspješno kreiran!`);
      setUsername('');
      setPassword('');
      setSelectedFacultyId(null);
      onSuccess(); // Preusmjeri nakon uspješne registracije!
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Greška pri registraciji korisnika.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <label htmlFor="signup-username">Username:</label>
      <input
        id="signup-username"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        autoComplete="username"
      />

      <label htmlFor="signup-password">Password:</label>
      <input
        id="signup-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="new-password"
      />

      <label htmlFor="signup-faculty">Faculty:</label>
      <select
        id="signup-faculty"
        value={selectedFacultyId ?? ''}
        onChange={e => setSelectedFacultyId(Number(e.target.value))}
      >
        <option value="" disabled>
          -- Select Faculty --
        </option>
        {faculties.map(faculty => (
          <option key={faculty.facultyID} value={faculty.facultyID}>
            {faculty.facultyName}
          </option>
        ))}
      </select>

      <button type="submit" className="signup-btn" disabled={loading}>
        {loading ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;
