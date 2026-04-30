import { useState } from "react";
import ListPage from "./pages/ListPage";
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import DetailPage from "./pages/DetailPage";
import Analytics from "./pages/Analytics";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  const [page, setPage] = useState("login");
  const [editData, setEditData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // 🔴 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
    <AuthProvider>
      <div>

        {/* 🔐 AUTH PAGES (NO NAVBAR) */}
        {page === "login" && <LoginPage setPage={setPage} />}
        {page === "register" && <RegisterPage setPage={setPage} />}
        {page === "forgot" && <ForgotPassword setPage={setPage} />}

        {/* 🌐 NAVBAR (ONLY AFTER LOGIN) */}
        {!["login", "register", "forgot"].includes(page) && (
          <div className="p-3 flex flex-wrap gap-2 bg-gray-100">

            <button
              onClick={() => setPage("dashboard")}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Dashboard
            </button>

            <button
              onClick={() => setPage("list")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              List
            </button>

            <button
              onClick={() => setPage("analytics")}
              className="bg-purple-500 text-white px-3 py-1 rounded"
            >
              Analytics
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>

          </div>
        )}

        {/* 📊 DASHBOARD */}
        {page === "dashboard" && (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}

        {/* 📋 LIST */}
        {page === "list" && (
          <ProtectedRoute>
            <ListPage
              setEditData={setEditData}
              setPage={setPage}
              setSelectedId={setSelectedId}
            />
          </ProtectedRoute>
        )}

        {/* 📝 FORM */}
        {page === "form" && (
          <ProtectedRoute>
            <FormPage editData={editData} setPage={setPage} />
          </ProtectedRoute>
        )}

        {/* 🔍 DETAIL */}
        {page === "detail" && (
          <ProtectedRoute>
            <DetailPage
              id={selectedId}
              setPage={setPage}
              setEditData={setEditData}
            />
          </ProtectedRoute>
        )}

        {/* 📈 ANALYTICS */}
        {page === "analytics" && (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        )}

      </div>
    </AuthProvider>
  );
}

export default App;