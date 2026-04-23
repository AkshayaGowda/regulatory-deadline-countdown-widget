import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function LoginPage({ setPage }) {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post("/login", form)
      .then((res) => {
        login(res.data.token);
        setPage("list");
      })
      .catch(() => alert("Login failed"));
  };

  return (
    <div className="p-5">
      <h2 className="text-xl mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full"
        />

        <button className="bg-blue-500 text-white px-4 py-2">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;