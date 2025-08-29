import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userID = payload.userID;

      fetch(`http://localhost:8080/api/users/${userID}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((user) => {
          if (allowedRoles.includes(user.isAdmin)) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        })
        .catch(() => setAuthorized(false))
        .finally(() => setLoading(false));
    } catch (e) {
      setAuthorized(false);
      setLoading(false);
    }
  }, [allowedRoles]);

  if (loading) return <p>Loading...</p>;

  if (!authorized) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;

