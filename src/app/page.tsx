"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#f97316"];

function parseData(input: string): any[] {
  const trimmed = input.trim();
  
  // Try JSON format first
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      let parsed = JSON.parse(trimmed);
      // If it's a single object, wrap in array
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }
      // Convert string numbers to actual numbers
      return parsed.map((item: any) => {
        const obj: any = {};
        Object.keys(item).forEach((key) => {
          const val = item[key];
          obj[key] = typeof val === "string" && !isNaN(Number(val)) ? Number(val) : val;
        });
        return obj;
      });
    } catch {
      // Not valid JSON, try CSV
    }
  }

  // Try CSV format
  const lines = trimmed.split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const obj: any = {};
    headers.forEach((header, i) => {
      const val = values[i];
      obj[header] = isNaN(Number(val)) ? val : Number(val);
    });
    return obj;
  });

  return data;
}

function getNumericKeys(data: any[]): string[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]).filter((key) => typeof data[0][key] === "number");
}

function getNameKey(data: any[]): string {
  if (data.length === 0) return "";
  return Object.keys(data[0]).find((key) => typeof data[0][key] === "string") || Object.keys(data[0])[0];
}

export default function Home() {
  const [dataInput, setDataInput] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedData = useMemo(() => parseData(dataInput), [dataInput]);
  const numericKeys = useMemo(() => getNumericKeys(parsedData), [parsedData]);
  const nameKey = useMemo(() => getNameKey(parsedData), [parsedData]);

  const handleGenerate = () => {
    if (!dataInput.trim()) return;

    setError(null);
    setIsGenerating(true);

    // Parse and validate data
    const data = parseData(dataInput);
    if (data.length === 0) {
      setError("Could not parse data. Please use CSV format.");
      setIsGenerating(false);
      return;
    }

    // Simulate brief loading for UX
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 500);
  };

  const renderChart = () => {
    if (parsedData.length === 0) return null;

    const chartProps = {
      data: parsedData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={nameKey} stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {numericKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={nameKey} stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {numericKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={3}
                  dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={parsedData}
                dataKey={numericKeys[0]}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: "#94a3b8" }}
              >
                {parsedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart {...chartProps}>
              <defs>
                {numericKeys.map((key, index) => (
                  <linearGradient
                    key={key}
                    id={`gradient-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={COLORS[index % COLORS.length]}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS[index % COLORS.length]}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={nameKey} stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {numericKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  fill={`url(#gradient-${key})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Background Gradients & Floating Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-10 opacity-10 animate-bounce" style={{ animationDuration: "3s" }}>
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-10 opacity-10 animate-bounce" style={{ animationDuration: "4s" }}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v11.26l6.37 6.37C20.95 18.28 22 16.25 22 12c0-5.21-3.93-9.5-9-10z" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <header className="text-center mb-16 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce" style={{ animationDuration: "2s" }}>
              <svg
                className="w-12 h-12 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="13" width="4" height="9" />
                <rect x="10" y="8" width="4" height="14" />
                <rect x="18" y="3" width="4" height="19" />
              </svg>
            </div>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-indigo-400 font-medium mb-4 backdrop-blur-sm">
            ✨ Instant Chart Generation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm">
            ChartGen AI
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform raw data into beautiful charts instantly.
            <br />
            <span className="text-slate-500">Just paste CSV and click generate.</span>
          </p>
        </header>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="space-y-6">
              {/* Data Input */}
              <div className="space-y-3">
                <label htmlFor="data-input" className="block text-sm font-medium text-slate-300">
                  Paste Data (CSV format)
                </label>
                <textarea
                  id="data-input"
                  value={dataInput}
                  onChange={(e) => {
                    setDataInput(e.target.value);
                    setShowPreview(false);
                  }}
                  placeholder="Month,Sales,Profit&#10;Jan,4500,1200&#10;Feb,5200,1800&#10;Mar,4800,1500&#10;Apr,6100,2200"
                  className="w-full h-64 bg-slate-950/50 border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Chart Type
                  </label>
                  <select
                    value={chartType}
                    onChange={(e) => {
                      setChartType(e.target.value);
                      if (showPreview) setShowPreview(true);
                    }}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="bar">📊 Bar Chart</option>
                    <option value="line">📈 Line Chart</option>
                    <option value="pie">🥧 Pie Chart</option>
                    <option value="area">📉 Area Chart</option>
                  </select>
                </div>

                <div className="flex items-end relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !dataInput.trim()}
                    className={`relative w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2
                      ${
                        isGenerating || !dataInput.trim()
                          ? "bg-slate-700 cursor-not-allowed opacity-50"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25"
                      }`}
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>Generate Chart 🚀</>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div
            className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl h-full min-h-[500px] flex flex-col transition-all duration-500 hover:shadow-indigo-500/10 ${
              showPreview ? "opacity-100" : "opacity-80"
            }`}
          >
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-500 rounded-full animate-pulse"></span>
              Preview
            </h2>

            <div className="flex-1 rounded-xl bg-slate-950/50 border border-slate-800/50 flex items-center justify-center relative overflow-hidden">
              {showPreview && parsedData.length > 0 ? (
                <div className="w-full h-full p-4">{renderChart()}</div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">
                    Paste data and click Generate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
