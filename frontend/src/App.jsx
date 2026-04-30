import { useState } from "react";
import ListPage from "./pages/ListPage";
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import DetailPage from "./pages/DetailPage";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  const [page, setPage] = useState("login");
  const [editData, setEditData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
    <AuthProvider>
      <div>

        {page === "login" && <LoginPage setPage={setPage} />}

        {page !== "login" && (
          <div className="p-3 flex flex-wrap gap-2">

            <button onClick={() => setPage("dashboard")} className="bg-gray-300 px-3 py-1">
              Dashboard
            </button>

            <button onClick={() => setPage("list")} className="bg-green-500 text-white px-3 py-1">
              List
            </button>

            <button onClick={() => setPage("analytics")} className="bg-purple-500 text-white px-3 py-1">
              Analytics
            </button>

            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1">
              Logout
            </button>

          </div>
        )}

        {page === "dashboard" && (
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        )}

        {page === "list" && (
          <ProtectedRoute>
            <ListPage setEditData={setEditData} setPage={setPage} setSelectedId={setSelectedId} />
          </ProtectedRoute>
        )}

        {page === "form" && (
          <ProtectedRoute>
            <FormPage editData={editData} setPage={setPage} />
          </ProtectedRoute>
        )}

        {page === "detail" && (
          <ProtectedRoute>
            <DetailPage id={selectedId} setPage={setPage} setEditData={setEditData} />
          </ProtectedRoute>
        )}

        {page === "analytics" && (
          <ProtectedRoute><Analytics /></ProtectedRoute>
        )}

      </div>
    </AuthProvider>
  );
}

export default App;