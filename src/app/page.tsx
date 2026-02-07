"use client";

import { useState } from "react";

export default function Home() {
  const [dataInput, setDataInput] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = () => {
    if (!dataInput.trim()) return;
    
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-indigo-400 font-medium mb-4">
            ✨ AI-Powered Chart Generation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            ChartGen AI
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform raw data into professional visualization in seconds.
            Just paste your CSV or JSON and let AI do the rest.
          </p>
        </header>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Input Section */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="space-y-6">
              
              {/* Data Input */}
              <div className="space-y-3">
                <label htmlFor="data-input" className="block text-sm font-medium text-slate-300">
                  Paste Data (CSV or JSON)
                </label>
                <textarea
                  id="data-input"
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  placeholder="Year,Sales,Profit&#10;2020,100,50&#10;2021,150,80&#10;2022,200,120"
                  className="w-full h-64 bg-slate-950/50 border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600 resize-none"
                />
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Chart Type</label>
                  <select 
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                  >
                    <option value="bar">📊 Bar Chart</option>
                    <option value="line">📈 Line Chart</option>
                    <option value="pie">🥧 Pie Chart</option>
                    <option value="area">📉 Area Chart</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !dataInput.trim()}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2
                      ${isGenerating || !dataInput.trim()
                        ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25'
                      }`}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Chart 🚀
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Preview Section */}
          <div className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl h-full min-h-[500px] flex flex-col transition-all duration-500 ${showPreview ? 'opacity-100' : 'opacity-80'}`}>
            <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
              Preview
            </h2>
            
            <div className="flex-1 rounded-xl bg-slate-950/50 border border-slate-800/50 flex items-center justify-center relative overflow-hidden group">
              {showPreview ? (
                <div className="w-full h-full p-8 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                  {/* Mock Chart Visualization */}
                  <div className="w-full h-64 flex items-end justify-between gap-2 px-4 mb-4">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-sm hover:opacity-90 transition-all duration-500"
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="w-full h-px bg-slate-700 mb-2"></div>
                  <div className="flex justify-between w-full text-xs text-slate-500 px-4">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-sm text-slate-400 font-medium">Chart successfully generated!</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">Enter data and click generate to see preview</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
