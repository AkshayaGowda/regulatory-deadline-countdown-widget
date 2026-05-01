import { useState } from "react";

function ResetPassword({ setPage }) {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      setError("All fields are required");
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
    setSuccess("");

    // 🔵 Simulate API call
    setTimeout(() => {
      setSuccess("Password reset successful");

      // redirect to login
      setTimeout(() => {
        setPage("login");
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* 🔵 LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white items-center justify-center p-10">
        <div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Regulatory Tracker
          </h1>

          <p className="text-lg text-blue-100 max-w-md">
            Set a new password to secure your account and continue your workflow.
          </p>
        </div>
      </div>

      {/* ⚪ RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-6">

        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm border border-gray-100">

          <h2 className="text-2xl font-bold text-center mb-2">
            Reset Password
          </h2>

          <p className="text-center text-gray-500 mb-5">
            Enter your new password
          </p>

          {/* ❌ ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {/* ✅ SUCCESS */}
          {success && (
            <div className="bg-green-100 text-green-600 text-sm p-2 rounded mb-4 text-center">
              {success}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Reset Password
            </button>

          </form>

          {/* BACK */}
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

export default ResetPassword;