import { useState } from "react";

function RegisterPage({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    // 👉 Backend integration later
    alert("Account created successfully (demo)");

    setPage("login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">

      <div className="bg-white shadow-xl rounded-xl p-6 w-80">

        <h2 className="text-2xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-4">
          Register to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            placeholder="Full Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="border p-2 w-full rounded focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="border p-2 w-full rounded focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="border p-2 w-full rounded focus:ring-2 focus:ring-purple-400"
          />

          <button className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700">
            Register
          </button>

        </form>

        {/* Back */}
        <p
          onClick={() => setPage("login")}
          className="text-center mt-4 text-blue-500 cursor-pointer hover:underline"
        >
          Back to Login
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;