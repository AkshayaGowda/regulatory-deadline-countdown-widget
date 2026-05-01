import { useEffect, useState } from "react";
import API from "../services/api";

function DetailPage({ id, setPage, setEditData }) {
  const [data, setData] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    API.get(`/get/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // 🎯 Priority Badge
  const badgeColor =
    data.priority === "HIGH"
      ? "bg-red-500"
      : data.priority === "MEDIUM"
      ? "bg-yellow-500"
      : "bg-green-500";

  // 🤖 AI
  const handleAI = () => {
    setAiLoading(true);
    setAiResponse(null);

    API.post("/ai/recommend", data)
      .then((res) => setAiResponse(res.data))
      .catch((err) => console.error(err))
      .finally(() => setAiLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">

      {/* 🔹 HEADER */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Deadline Details
        </h2>
      </div>

      {/* 🔹 MAIN CARD */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">

        <h3 className="text-xl font-semibold mb-4">
          {data.title}
        </h3>

        <p className="text-gray-600 mb-3">
          {data.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <p><b>Type:</b> {data.regulationType}</p>
          <p><b>Deadline:</b> {data.deadlineDate}</p>
          <p><b>Status:</b> {data.status}</p>

          <div>
            <span className={`${badgeColor} text-white px-3 py-1 rounded`}>
              {data.priority}
            </span>
          </div>

        </div>

        {/* 🔧 ACTIONS */}
        <div className="mt-6 flex flex-wrap gap-3">

          <button
            onClick={() => {
              setEditData(data);
              setPage("form");
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>

          <button
            onClick={() => {
              API.delete(`/delete/${data.id}`)
                .then(() => {
                  alert("Deleted successfully");
                  setPage("list");
                })
                .catch((err) => console.error(err));
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>

          <button
            onClick={handleAI}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            AI Recommend
          </button>

        </div>

      </div>

      {/* 🤖 AI SECTION */}
      <div className="max-w-3xl mx-auto mt-6">

        {aiLoading && (
          <div className="bg-white p-4 rounded shadow text-center">
            Loading AI recommendations...
          </div>
        )}

        {aiResponse && (
          <div className="bg-white p-5 rounded-xl shadow">

            <h3 className="text-lg font-semibold mb-4">
              AI Recommendations
            </h3>

            {aiResponse.map((rec, index) => (
              <div key={index} className="mb-4 border-b pb-2">

                <p><b>Action:</b> {rec.action_type}</p>
                <p><b>Description:</b> {rec.description}</p>
                <p><b>Priority:</b> {rec.priority}</p>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default DetailPage;