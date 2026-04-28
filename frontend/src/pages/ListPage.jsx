import { useEffect, useState } from "react";
import API from "../services/api";

function ListPage({ setEditData, setPage, setSelectedId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 Search + Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 📄 Pagination
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ⏱ Debounce search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔄 Fetch data
  const fetchData = () => {
    setLoading(true);

    API.get("/search", {
      params: {
        q: debouncedSearch,
        status: status,
        fromDate: fromDate,
        toDate: toDate,
        page: pageNum,
        size: 5,
      },
    })
      .then((res) => {
        const content = res.data.content || res.data;
        setData(content);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, status, fromDate, toDate, pageNum]);

  // ❌ Delete
  const handleDelete = (id) => {
    API.delete(`/delete/${id}`)
      .then(() => {
        alert("Deleted successfully");
        fetchData();
      })
      .catch((err) => console.error(err));
  };

  // 🔄 Loading state
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-5">

      <h2 className="text-xl font-bold mb-4">
        Regulatory Deadlines
      </h2>

      {/* 🔎 FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2"
        >
          <option value="">All Status</option>
          <option value="UPCOMING">UPCOMING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        {/* From Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2"
        />

        {/* To Date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2"
        />

      </div>

      {/* 📊 TABLE */}
      {data.length === 0 ? (
        <p className="text-center mt-5">No records found</p>
      ) : (
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

                  {/* 👁 View */}
                  <button
                    onClick={() => {
                      setSelectedId(item.id);
                      setPage("detail");
                    }}
                    className="bg-blue-500 text-white px-2 py-1 mr-2"
                  >
                    View
                  </button>

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
      )}

      {/* 📄 PAGINATION */}
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