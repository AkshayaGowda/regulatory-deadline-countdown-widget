import { useEffect, useState } from "react";
import API from "../services/api";

function ListPage({ setEditData, setPage, setSelectedId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const [file, setFile] = useState(null);

  // ⏱ Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔄 Fetch
  const fetchData = () => {
    setLoading(true);

    API.get("/search", {
      params: {
        q: debouncedSearch,
        status,
        fromDate,
        toDate,
        page: pageNum,
        size: 5,
      },
    })
      .then((res) => {
        const content = res.data.content || res.data;
        setData(content);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error(err))
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

  // 🤖 AI
  const handleAI = (item) => {
    setAiLoading(true);
    setAiResponse(null);

    API.post("/ai/recommend", item)
      .then((res) => setAiResponse(res.data))
      .catch((err) => console.error(err))
      .finally(() => setAiLoading(false));
  };

  // 📤 Upload
  const handleUpload = () => {
    if (!file) return alert("Select file first");

    if (file.type !== "text/csv") return alert("Only CSV allowed");

    if (file.size > 2 * 1024 * 1024)
      return alert("File too large (max 2MB)");

    const formData = new FormData();
    formData.append("file", file);

    API.post("/upload", formData)
      .then(() => alert("Uploaded successfully"))
      .catch(() => alert("Upload failed"));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4 sm:p-5 md:p-6">

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
        Regulatory Deadlines
      </h2>

      {/* 🔎 FILTER */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2">
          <option value="">All Status</option>
          <option value="UPCOMING">UPCOMING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-2" />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-2" />

        <button
          onClick={() => window.open("http://localhost:8080/export")}
          className="bg-green-500 text-white px-3 py-1"
        >
          Export CSV
        </button>
      </div>

      {/* 📤 Upload */}
      <div className="mb-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload} className="bg-blue-500 text-white px-3 py-1 ml-2">
          Upload CSV
        </button>
      </div>

      {/* 📱 MOBILE VIEW */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div key={item.id} className="border p-3 rounded shadow">

            <p className="font-bold text-lg">{item.title}</p>
            <p>Status: {item.status}</p>
            <p>Priority: {item.priority}</p>
            <p>Date: {item.deadlineDate}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => {
                setSelectedId(item.id);
                setPage("detail");
              }} className="bg-gray-300 px-2 py-1">View</button>

              <button onClick={() => {
                setEditData(item);
                setPage("form");
              }} className="bg-blue-500 text-white px-2 py-1">Edit</button>

              <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1">Delete</button>

              <button onClick={() => handleAI(item)} className="bg-purple-500 text-white px-2 py-1">AI</button>
            </div>

          </div>
        ))}
      </div>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden md:block">
        <table className="w-full border">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.regulationType}</td>
                <td>{item.deadlineDate}</td>
                <td>{item.status}</td>
                <td>{item.priority}</td>

                <td className="space-x-2">
                  <button onClick={() => {
                    setSelectedId(item.id);
                    setPage("detail");
                  }}>View</button>

                  <button onClick={() => {
                    setEditData(item);
                    setPage("form");
                  }}>Edit</button>

                  <button onClick={() => handleDelete(item.id)}>Delete</button>

                  <button onClick={() => handleAI(item)}>AI</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🤖 AI */}
      {aiLoading && <p className="mt-4">Loading AI...</p>}

      {aiResponse && (
        <div className="mt-4 border p-3 bg-gray-100">
          <h3 className="font-bold">AI Recommendations</h3>
          {aiResponse.map((rec, i) => (
            <div key={i}>
              <p><b>Action:</b> {rec.action_type}</p>
              <p><b>Description:</b> {rec.description}</p>
              <p><b>Priority:</b> {rec.priority}</p>
              <hr />
            </div>
          ))}
        </div>
      )}

      {/* 📄 Pagination */}
      <div className="mt-4 flex justify-center gap-3">
        <button onClick={() => setPageNum(pageNum - 1)} disabled={pageNum === 0}>Prev</button>
        <span>Page {pageNum + 1} of {totalPages}</span>
        <button onClick={() => setPageNum(pageNum + 1)} disabled={pageNum + 1 >= totalPages}>Next</button>
      </div>

    </div>
  );
}

export default ListPage;