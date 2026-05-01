import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    overdue: 0,
    total: 0,
  });

  // 🔄 Fetch stats
  useEffect(() => {
    API.get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Stats error:", err));
  }, []);

  const chartData = [
    { name: "Upcoming", value: stats.upcoming },
    { name: "Completed", value: stats.completed },
    { name: "Overdue", value: stats.overdue },
    { name: "Total", value: stats.total },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">

      {/* 🔹 HEADER */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Dashboard Overview
        </h2>
      </div>

      {/* 🔹 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Upcoming</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {stats.upcoming}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">
            {stats.completed}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Overdue</p>
          <h2 className="text-2xl font-bold text-red-600">
            {stats.overdue}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total</p>
          <h2 className="text-2xl font-bold text-gray-700">
            {stats.total}
          </h2>
        </div>

      </div>

      {/* 🔹 CHART SECTION */}
      <div className="bg-white rounded-xl shadow p-5">

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Task Distribution
        </h3>

        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;