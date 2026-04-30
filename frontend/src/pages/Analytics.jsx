import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

function Analytics() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState("ALL");

  useEffect(() => {
    API.get("/all")
      .then((res) => {
        setData(res.data.content || res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered =
    period === "ALL"
      ? data
      : data.filter((item) => {
          const days = period === "7" ? 7 : 30;
          const diff =
            (new Date() - new Date(item.deadlineDate)) /
            (1000 * 60 * 60 * 24);
          return diff <= days;
        });

  const statusData = [
    { name: "UPCOMING", value: filtered.filter((d) => d.status === "UPCOMING").length },
    { name: "COMPLETED", value: filtered.filter((d) => d.status === "COMPLETED").length },
  ];

  const priorityData = [
    { name: "HIGH", value: filtered.filter((d) => d.priority === "HIGH").length },
    { name: "MEDIUM", value: filtered.filter((d) => d.priority === "MEDIUM").length },
    { name: "LOW", value: filtered.filter((d) => d.priority === "LOW").length },
  ];

  return (
    <div className="p-4 sm:p-5 md:p-6">

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
        Analytics Dashboard
      </h2>

      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={() => setPeriod("7")} className="bg-blue-500 text-white px-3 py-1 rounded">7 Days</button>
        <button onClick={() => setPeriod("30")} className="bg-green-500 text-white px-3 py-1 rounded">30 Days</button>
        <button onClick={() => setPeriod("ALL")} className="bg-gray-500 text-white px-3 py-1 rounded">All</button>
      </div>

      <div className="w-full h-64 md:h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={priorityData} dataKey="value" label>
              {priorityData.map((_, i) => <Cell key={i} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Analytics;