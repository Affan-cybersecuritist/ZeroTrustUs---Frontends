"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, ShieldAlert, Target } from "lucide-react";

export default function Dashboard({ records }: { records: any[] }) {
  const totalMaps = records.length;
  const breaches = records.filter((r) => r.status === "Breach").length;
  const healthIndex = totalMaps === 0 ? 100 : Math.round(((totalMaps - breaches) / totalMaps) * 100);

  // Group by department for charts
  const deptData = records.reduce((acc, curr) => {
    if (!acc[curr.department]) {
      acc[curr.department] = { name: curr.department, total: 0, breaches: 0 };
    }
    acc[curr.department].total += 1;
    if (curr.status === "Breach") acc[curr.department].breaches += 1;
    return acc;
  }, {});

  const chartData = Object.values(deptData);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="w-full p-8 bg-obsidian text-white">
      <h2 className="text-2xl font-bold mb-6">Mission Control Dashboard</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card-bg p-6 rounded-xl border border-border-dark flex items-center gap-4">
          <div className="p-4 bg-[#112a1d] rounded-full text-neon-green">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Compliance Health Index</p>
            <p className="text-3xl font-bold">{healthIndex}%</p>
          </div>
        </div>
        
        <div className="bg-card-bg p-6 rounded-xl border border-border-dark flex items-center gap-4">
          <div className="p-4 bg-[#2a1d11] rounded-full text-blue-400">
            <Target size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total MAPs Extracted</p>
            <p className="text-3xl font-bold">{totalMaps}</p>
          </div>
        </div>

        <div className="bg-card-bg p-6 rounded-xl border border-border-dark flex items-center gap-4">
          <div className="p-4 bg-[#2a1111] rounded-full text-alert-red">
            <ShieldAlert size={32} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Critical Breaches</p>
            <p className="text-3xl font-bold">{breaches}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card-bg p-6 rounded-xl border border-border-dark">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Departmental Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#333" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card-bg p-6 rounded-xl border border-border-dark">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Compliance Load</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#333" }} />
                <Bar dataKey="total" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
