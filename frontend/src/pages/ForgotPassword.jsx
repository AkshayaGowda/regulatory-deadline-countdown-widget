import { useState } from "react";

function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    // 👉 Backend later
    alert("Password reset link sent (demo)");

    setPage("login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200">

      <div className="bg-white shadow-xl rounded-xl p-6 w-80">

        <h2 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 mb-4">
          Enter your email to reset password
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded focus:ring-2 focus:ring-green-400"
          />

          <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
            Send Reset Link
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

export default ForgotPassword;