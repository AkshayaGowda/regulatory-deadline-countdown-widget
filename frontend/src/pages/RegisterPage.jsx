import { useState } from "react";

function RegisterPage({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    alert("Account created successfully (demo)");
    setPage("login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* 🔵 LEFT SIDE (NOW BLUE SAME AS LOGIN) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white items-center justify-center p-10">
        <div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Regulatory Tracker
          </h1>
          <p className="text-lg text-blue-100 max-w-md">
            Create your account and start managing deadlines efficiently.
          </p>
        </div>
      </div>

      {/* ⚪ RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-6">

        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm border border-gray-100">

          <h2 className="text-2xl font-bold text-center mb-2">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mb-5">
            Sign up to get started
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Register
            </button>

          </form>

          <p
            onClick={() => setPage("login")}
            className="text-center mt-5 text-blue-500 cursor-pointer hover:underline"
          >
            Back to Login
          </p>

        </div>

      </div>
    </div>
  );
}

export default RegisterPage;