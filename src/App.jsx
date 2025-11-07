import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"];

export default function App() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    Papa.parse("/parking-data.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map(r => ({
            bay_id: r.bay_id,
            license_plate: r.license_plate,
            latitude: parseFloat(r.latitude),
            longitude: parseFloat(r.longitude),
            arrival_time: r.arrival_time,
            duration_seconds: Number(r.duration_seconds)
          }))
          .filter(r => r.bay_id);
        setData(rows);
        computeSummary(rows);
      },
      error: (err) => console.error("Parse error", err)
    });
  }, []);

  function computeSummary(rows) {
    if (!rows.length) return setSummary(null);

    const durations = rows.map(r => r.duration_seconds || 0);
    const avg = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
    const invalid = rows.filter(r => !r.license_plate || r.license_plate.toLowerCase() === "null").length;

    // Sessions by Day
    const byDay = {};
    rows.forEach(r => {
      const day = r.arrival_time ? r.arrival_time.split("T")[0] : "Time Unknown";
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const daily = Object.entries(byDay).sort().map(([day, count]) => ({ day, count }));

    // Peak Times (by Hour)
    const byHour = {};
    rows.forEach(r => {
      if (r.arrival_time) {
        const hour = new Date(r.arrival_time).getHours();
        byHour[hour] = (byHour[hour] || 0) + 1;
      }
    });
    const hourly = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      count: byHour[h] || 0
    }));

    // Duration buckets
    const short = durations.filter(d => d < 3600).length;
    const medium = durations.filter(d => d >= 3600 && d < 86400).length;
    const long = durations.filter(d => d >= 86400).length;
    const durationBreakdown = [
      { name: "Short (<1h)", value: short },
      { name: "Medium (1h–24h)", value: medium },
      { name: "Long (>24h)", value: long }
    ];

    // Bay Utilization
    const byBay = {};
    rows.forEach(r => {
      byBay[r.bay_id] = (byBay[r.bay_id] || 0) + 1;
    });
    const bayUsage = Object.entries(byBay)
      .sort((a, b) => b[1] - a[1])
      .map(([bay_id, count]) => ({ bay_id, count }));

    setSummary({ avg, invalid, total: rows.length, daily, durationBreakdown, bayUsage, hourly });
  }

  if (!data.length) return <div className="container"><h1>Loading parking data…</h1></div>;

  return (
    <div className="container">
      <h1>Parking Data Dashboard</h1>

      {/* Summary Cards */}
      <div className="cards">
        <div className="card">
          <div className="card-title">Total Parked Cars</div>
          <div className="card-value">{summary?.total ?? 0}</div>
        </div>
        <div className="card">
          <div className="card-title">Average Duration (s)</div>
          <div className="card-value">{summary?.avg ?? "-"}</div>
        </div>
        <div className="card">
          <div className="card-title">Invalid Plates</div>
          <div className="card-value">{summary?.invalid ?? 0}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid">
        {/* Sessions by Day */}
        <div className="panel">
          <h2>Sessions by Day</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={summary?.daily || []} margin={{ left: 10 }}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#75b0ebff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Duration Breakdown */}
        <div className="panel">
          <h2>Duration Breakdown</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={summary?.durationBreakdown || []} dataKey="value" nameKey="name" outerRadius={90} label>
                  {(summary?.durationBreakdown || []).map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak Times */}
      <div className="panel">
        <h2>Peak Times (Arrivals by Hour)</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={summary?.hourly || []}>
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis />
              <Tooltip formatter={(v) => [`${v} arrivals`, "Count"]} />
              <Bar dataKey="count" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Visual Map */}         
      <div className="panel">
        <h2>Parking Lot Map</h2>
        <MapContainer center={[-31.9321, 115.9523]} zoom={25} style={{ height: 400 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {data.map((r, i) => (
            <CircleMarker
              key={i}
              center={[r.latitude, r.longitude]}
              radius={3}
              fillColor={r.duration_seconds > 86400 ? "red" : r.duration_seconds > 3600 ? "orange" : "green"}
              color="none"
              fillOpacity={0.8}
            >
              <LeafletTooltip>
                <b>{r.bay_id}</b><br />
                {r.license_plate}<br />
                {r.duration_seconds}s
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Raw CSV Data*/}
      <div className="panel">
        <h2>CSV Data</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>bay_id</th>
              <th>license_plate</th>
              <th>arrival_time</th>
              <th>duration (s)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <td>{r.bay_id}</td>
                <td>{r.license_plate}</td>
                <td>{r.arrival_time}</td>
                <td>{r.duration_seconds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
