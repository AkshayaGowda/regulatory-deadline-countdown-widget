import { useEffect, useState } from "react";
import API from "../services/api";

function DetailPage({ id, setPage, setEditData }) {
  const [data, setData] = useState(null);

  // 🔄 Fetch record
  useEffect(() => {
    API.get(`/get/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!data) return <p className="p-5">Loading...</p>;

  // 🎯 Badge color
  const badgeColor =
    data.priority === "HIGH"
      ? "bg-red-400"
      : data.priority === "MEDIUM"
      ? "bg-yellow-400"
      : "bg-green-400";

  return (
    <div className="p-5">

      <h2 className="text-xl font-bold mb-4">Detail Page</h2>

      <p><b>Title:</b> {data.title}</p>
      <p><b>Description:</b> {data.description}</p>
      <p><b>Type:</b> {data.regulationType}</p>
      <p><b>Deadline:</b> {data.deadlineDate}</p>
      <p><b>Status:</b> {data.status}</p>

      {/* 🔥 SCORE BADGE */}
      <div className="mt-3">
        <span className={`${badgeColor} px-3 py-1 rounded`}>
          Priority: {data.priority}
        </span>
      </div>

      {/* 🔧 ACTIONS */}
      <div className="mt-4">

        {/* Edit */}
        <button
          onClick={() => {
            setEditData(data);
            setPage("form");
          }}
          className="bg-yellow-500 text-white px-3 py-1 mr-2"
        >
          Edit
        </button>

        {/* Delete */}
        <button
          onClick={() => {
            API.delete(`/delete/${data.id}`)
              .then(() => {
                alert("Deleted successfully");
                setPage("list");
              });
          }}
          className="bg-red-500 text-white px-3 py-1"
        >
          Delete
        </button>

      </div>
    </div>
  );
}

export default DetailPage;