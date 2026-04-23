import { useState } from "react";
import ListPage from "./pages/ListPage";
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

function App() {
  const [page, setPage] = useState("login");
  const [editData, setEditData] = useState(null);

  return (
    <AuthProvider>
      <div>

        {/* 🔐 LOGIN PAGE */}
        {page === "login" && <LoginPage setPage={setPage} />}

        {/* 📊 LIST PAGE (Protected) */}
        {page === "list" && (
          <ProtectedRoute>
            <div className="p-3">
              <button
                onClick={() => {
                  setEditData(null);
                  setPage("form");
                }}
                className="bg-blue-500 text-white px-3 py-1 mr-2"
              >
                Add New
              </button>

              <button
                onClick={() => setPage("login")}
                className="bg-gray-400 text-white px-3 py-1"
              >
                Logout
              </button>
            </div>

            <ListPage setEditData={setEditData} setPage={setPage} />
          </ProtectedRoute>
        )}

        {/* 📝 FORM PAGE (Protected) */}
        {page === "form" && (
          <ProtectedRoute>
            <div className="p-3">
              <button
                onClick={() => setPage("list")}
                className="bg-gray-300 px-3 py-1"
              >
                Back to List
              </button>
            </div>

            <FormPage editData={editData} />
          </ProtectedRoute>
        )}

      </div>
    </AuthProvider>
  );
}

export default App;