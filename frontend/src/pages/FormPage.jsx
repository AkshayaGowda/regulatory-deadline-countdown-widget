import { useState, useEffect } from "react";
import API from "../services/api";

function FormPage({ editData, setPage }) {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    regulationType: "",
    deadlineDate: "",
    status: "UPCOMING",
    priority: "MEDIUM",
  });

  // 🔁 Prefill
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  // 🔄 Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.deadlineDate) {
      alert("Title and Deadline are required");
      return;
    }

    if (editData) {
      API.put(`/update/${editData.id}`, formData)
        .then(() => {
          alert("Updated successfully");
          setPage("list");
        })
        .catch(() => alert("Update failed"));
    } else {
      API.post("/create", formData)
        .then(() => {
          alert("Created successfully");
          setPage("list");
        })
        .catch(() => alert("Create failed"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-center">

      {/* 🔹 CARD */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl">

        <h2 className="text-2xl font-bold text-center mb-6">
          {editData ? "Edit Deadline" : "Create Deadline"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TITLE */}
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* TYPE */}
          <input
            name="regulationType"
            value={formData.regulationType}
            onChange={handleChange}
            placeholder="Regulation Type"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* DATE */}
          <input
            type="date"
            name="deadlineDate"
            value={formData.deadlineDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* DROPDOWNS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="UPCOMING">UPCOMING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-3">

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {editData ? "Update" : "Create"}
            </button>

            <button
              type="button"
              onClick={() => setPage("list")}
              className="w-full bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default FormPage;