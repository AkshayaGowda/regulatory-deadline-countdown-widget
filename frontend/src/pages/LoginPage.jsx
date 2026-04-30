import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function LoginPage({ setPage }) {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    API.post("/login", form)
      .then((res) => {
        login(res.data.token); // store token
        setPage("list");
      })
      .catch((err) => {
        console.error(err);
        setError("Invalid username or password");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">

      <div className="bg-white shadow-xl rounded-xl p-6 w-80">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-4">
          Login to your account
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Links */}
        <div className="text-center mt-4 text-sm">

          <p
            onClick={() => setPage("forgot")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Forgot Password?
          </p>

          <p className="mt-2 text-gray-600">
            New user?{" "}
            <span
              onClick={() => setPage("register")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Create Account
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}

export default LoginPage;