import React, { useEffect, useState } from "react";

interface Faculty {
  facultyID: number;
  facultyName: string;
}

interface SignUpFormProps {
  onSuccess: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/faculties`);
        if (!response.ok) throw new Error("Failed to fetch faculties");
        const data = await response.json();
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        alert("Greška pri dohvaćanju fakulteta.");
      }
    };
    fetchFaculties();
  }, []);

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email je obavezan";
    if (email.length > 50) return "Email ne smije imati više od 50 znakova";
    if (!/^[A-Za-z0-9._%+-]+@skolezd\.hr$/.test(email))
      return "Email mora završavati na @skolezd.hr";
    return null;
  };

  const validatePassword = (pwd: string): string | null => {
    if (!pwd) return "Lozinka je obavezna";
    if (pwd.length > 25) return "Lozinka ne smije imati više od 25 znakova";
    if (!/^[A-Za-z0-9]+$/.test(pwd))
      return "Lozinka smije sadržavati samo slova i brojeve";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameErr = validateEmail(username);
    const passwordErr = validatePassword(password);
    setUsernameError(usernameErr);
    setPasswordError(passwordErr);

    if (!username || !password || selectedFacultyId === null) {
      alert("Please fill out all fields");
      return;
    }

    const newUser = {
      username,
      password,
      isAdmin: 1,
      faculty: { facultyID: selectedFacultyId },
    };

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to create user");
      alert(`Korisnik "${username}" je uspješno kreiran!`);
      setUsername("");
      setPassword("");
      setSelectedFacultyId(null);
      onSuccess();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Greška pri registraciji korisnika.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = (): boolean => {
    return (
      username.trim() !== "" &&
      password.trim() !== "" &&
      selectedFacultyId !== null &&
      !validateEmail(username) &&
      !validatePassword(password)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <label htmlFor="signup-username">Email :</label>
      <input
        id="signup-username"
        type="email"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setUsernameError(validateEmail(e.target.value));
        }}
        autoComplete="username"
      />
      {usernameError && <span className="error">{usernameError}</span>}

      <label htmlFor="signup-password">Password:</label>
      <input
        id="signup-password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError(validatePassword(e.target.value));
        }}
        autoComplete="new-password"
      />
      {passwordError && <span className="error">{passwordError}</span>}

      <label htmlFor="signup-faculty">Faculty:</label>
      <select
        id="signup-faculty"
        value={selectedFacultyId ?? ""}
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

      <button
        type="submit"
        className="button"
        disabled={loading || !isFormValid()}
      >
        {loading ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;
