import { useState } from "react";
import API from "../services/api";

function FormPage({ editData }) {

  const [formData, setFormData] = useState(
    editData || {
      title: "",
      description: "",
      regulationType: "",
      deadlineDate: "",
      status: "UPCOMING",
      priority: "MEDIUM",
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!formData.title || !formData.deadlineDate) {
      alert("Title and Deadline are required");
      return;
    }

    // ✅ CREATE or UPDATE
    if (editData) {
      API.put(`/update/${editData.id}`, formData)
        .then(() => alert("Updated successfully"))
        .catch((err) => console.error(err));
    } else {
      API.post("/create", formData)
        .then(() => alert("Created successfully"))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        {editData ? "Edit Deadline" : "Create Deadline"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 w-full" />

        <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" />

        <input name="regulationType" value={formData.regulationType} onChange={handleChange} placeholder="Type" className="border p-2 w-full" />

        <input type="date" name="deadlineDate" value={formData.deadlineDate} onChange={handleChange} className="border p-2 w-full" />

        <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full">
          <option value="UPCOMING">UPCOMING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <select name="priority" value={formData.priority} onChange={handleChange} className="border p-2 w-full">
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2">
          {editData ? "Update" : "Submit"}
        </button>

      </form>
    </div>
  );
}

export default FormPage;