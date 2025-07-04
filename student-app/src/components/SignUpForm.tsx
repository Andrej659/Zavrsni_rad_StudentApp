import React, { useState } from 'react';

const faculties = [
  'FER',
  'FOI',
  'TVZ',
  'FERIT',
  'PMF',
  'FESB',
  'FSB',
  'Other'
];

interface Props {
  onSuccess: () => void;
}

const SignUpForm: React.FC<Props> = ({ onSuccess }) => {
  const [selectedFaculty, setSelectedFaculty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pretvaramo se da je uspješno
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" required />

      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" required />

      <label htmlFor="faculty">Select Your Faculty</label>
      <select
        id="faculty"
        name="faculty"
        value={selectedFaculty}
        onChange={(e) => setSelectedFaculty(e.target.value)}
        required
      >
        <option value="" disabled>-- Select Faculty --</option>
        {faculties.map((faculty) => (
          <option key={faculty} value={faculty}>{faculty}</option>
        ))}
      </select>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
