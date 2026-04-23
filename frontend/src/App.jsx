import { useState } from "react";
import ListPage from "./pages/ListPage";
import FormPage from "./pages/FormPage";

function App() {
  const [page, setPage] = useState("list");
  const [editData, setEditData] = useState(null);

  return (
    <div>

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
          onClick={() => setPage("list")}
          className="bg-gray-300 px-3 py-1"
        >
          List
        </button>

      </div>

      {page === "list" ? (
        <ListPage setEditData={setEditData} setPage={setPage} />
      ) : (
        <FormPage editData={editData} />
      )}

    </div>
  );
}

export default App;