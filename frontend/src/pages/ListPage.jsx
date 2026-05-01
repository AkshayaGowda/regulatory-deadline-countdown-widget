import { useState, useEffect } from "react";
import API from "../services/api";

function ListPage({ setEditData, setPage, setSelectedId }) {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [file, setFile] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 🔄 FETCH DATA
  useEffect(() => {
    API.get("/all", {
      params: {
        page: pageNum,
        search,
        status,
        fromDate,
        toDate,
      },
    })
      .then((res) => {
        setData(res.data.content || res.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error(err));
  }, [pageNum, search, status, fromDate, toDate]);

  // ❌ DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Delete this record?")) return;

    API.delete(`/delete/${id}`)
      .then(() => {
        alert("Deleted successfully");
        setData((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => console.error(err));
  };

  // 🤖 AI
  const handleAI = (item) => {
    setAiLoading(true);
    setAiResponse(null);

    API.post("/ai/recommend", item)
      .then((res) => setAiResponse(res.data))
      .catch((err) => console.error(err))
      .finally(() => setAiLoading(false));
  };

  // 📤 UPLOAD
  const handleUpload = () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    API.post("/upload", formData)
      .then(() => alert("Uploaded successfully"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">

      {/* 🔹 HEADER */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Regulatory Deadlines
        </h2>
      </div>

      {/* 🔹 FILTERS */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3">

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="UPCOMING">UPCOMING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <button
          onClick={() => window.open("http://localhost:8080/export")}
          className="bg-green-500 text-white px-3 py-2 rounded-lg"
        >
          Export CSV
        </button>

      </div>

      {/* 📤 UPLOAD */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg ml-3"
        >
          Upload CSV
        </button>
      </div>

      {/* 💻 TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Type</th>
              <th className="p-2">Deadline</th>
              <th className="p-2">Status</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">

                <td className="p-2">{item.title}</td>
                <td className="p-2">{item.regulationType}</td>
                <td className="p-2">{item.deadlineDate}</td>
                <td className="p-2">{item.status}</td>
                <td className="p-2">{item.priority}</td>

                <td className="p-2 space-x-2">

                  <button
                    onClick={() => {
                      setSelectedId(item.id);
                      setPage("detail");
                    }}
                    className="text-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setEditData(item);
                      setPage("form");
                    }}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleAI(item)}
                    className="text-purple-600"
                  >
                    AI
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* 🤖 AI */}
      {aiLoading && (
        <div className="bg-white p-4 rounded shadow mt-4 text-center">
          Loading AI...
        </div>
      )}

      {aiResponse && (
        <div className="bg-white p-5 rounded-xl shadow mt-4">
          <h3 className="font-semibold mb-3">AI Recommendations</h3>

          {aiResponse.map((rec, i) => (
            <div key={i} className="mb-3 border-b pb-2">
              <p><b>Action:</b> {rec.action_type}</p>
              <p><b>Description:</b> {rec.description}</p>
              <p><b>Priority:</b> {rec.priority}</p>
            </div>
          ))}
        </div>
      )}

      {/* 📄 PAGINATION */}
      <div className="flex justify-center gap-4 mt-6 text-white">
        <button
          onClick={() => setPageNum(pageNum - 1)}
          disabled={pageNum === 0}
        >
          Prev
        </button>

        <span>
          Page {pageNum + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPageNum(pageNum + 1)}
          disabled={pageNum + 1 >= totalPages}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default ListPage;