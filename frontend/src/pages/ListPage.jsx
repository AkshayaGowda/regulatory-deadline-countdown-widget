import { useEffect, useState } from "react";
import API from "../services/api";

function ListPage({ setEditData, setPage }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📄 Pagination state
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 🔄 Fetch data (with pagination)
  const fetchData = () => {
    setLoading(true);

    API.get(`/all?page=${pageNum}&size=5`)
      .then((res) => {
        // backend may return pageable object OR list
        const content = res.data.content || res.data;
        setData(content);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [pageNum]);

  // 🔍 Search
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

  // ❌ Delete
  const handleDelete = (id) => {
    API.delete(`/delete/${id}`)
      .then(() => {
        alert("Deleted successfully");
        fetchData();
      })
      .catch((err) => console.error("Delete error:", err));
  };

  // 🔄 Loading
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // 📭 Empty
  if (data.length === 0) {
    return <p className="text-center mt-10">No records found</p>;
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        Regulatory Deadlines
      </h2>

      {/* 🔍 Search */}
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

      {/* 📄 Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-3">
        <button
          onClick={() => setPageNum(pageNum - 1)}
          disabled={pageNum === 0}
          className="bg-gray-300 px-3 py-1"
        >
          Prev
        </button>

        <span>
          Page {pageNum + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPageNum(pageNum + 1)}
          disabled={pageNum + 1 >= totalPages}
          className="bg-gray-300 px-3 py-1"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ListPage;