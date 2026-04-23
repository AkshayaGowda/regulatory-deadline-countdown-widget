import { useEffect, useState } from "react";
import API from "../services/api";

function ListPage({ setEditData, setPage }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch all records
  const fetchData = () => {
    setLoading(true);

    API.get("/all")
      .then((res) => {
        setData(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 Search handler
  const handleSearch = (query) => {
    if (!query) {
      fetchData();
      return;
    }

    API.get(`/search?q=${query}`)
      .then((res) => {
        setData(res.data || []);
      })
      .catch((err) => console.error("Search error:", err));
  };

  // ❌ Delete handler
  const handleDelete = (id) => {
    API.delete(`/delete/${id}`)
      .then(() => {
        alert("Deleted successfully");
        fetchData(); // refresh after delete
      })
      .catch((err) => console.error("Delete error:", err));
  };

  // 🔄 Loading state
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // 📭 Empty state
  if (data.length === 0) {
    return <p className="text-center mt-10">No records found</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        Regulatory Deadlines
      </h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 mb-4 w-full"
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* 📊 Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Deadline</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Priority</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border">{item.title}</td>
              <td className="p-2 border">{item.regulationType}</td>
              <td className="p-2 border">{item.deadlineDate}</td>
              <td className="p-2 border">{item.status}</td>
              <td className="p-2 border">{item.priority}</td>

              <td className="p-2 border">
                {/* ✏️ Edit */}
                <button
                  onClick={() => {
                    setEditData(item);
                    setPage("form");
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>

                {/* ❌ Delete */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListPage;