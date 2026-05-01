import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, setPage }) {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      setPage("login"); // 🔥 proper redirect
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return children;
}

export default ProtectedRoute;