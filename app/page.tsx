"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Activity, Cpu, BrainCircuit, Search, Zap, ExternalLink, Globe, MessageSquare, ShieldCheck, Lock, Unlock, Move } from "lucide-react";

// --- DEPLOYMENT FIX: Dynamic API URL ---
// Agar Vercel pe NEXT_PUBLIC_API_URL set hai toh wo lega, nahi toh local backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("report");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [currentResearchTopic, setCurrentResearchTopic] = useState("");
  const [isDeepSearch, setIsDeepSearch] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, chatLoading]);

  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline font-bold hover:text-orange-800 inline-flex items-center gap-1">
            {part} <ExternalLink size={12} />
          </a>
        );
      }
      return part;
    });
  };

  const handleSearch = async () => {
    if (!topic) return;
    setCurrentResearchTopic(topic);
    setLoading(true);
    setData(null); 
    setChatHistory([]);
    try {
      // --- DEPLOYMENT FIX: Using Dynamic URL ---
      const response = await axios.get(`${API_BASE_URL}/test-full-workflow`, {
        params: { topic: topic, deep: isDeepSearch }
      });
      setData(response.data);
      setActiveTab("report");
    } catch (error) { 
      console.error("Mission Failed:", error);
    }
    setLoading(false);
    setTopic("");
  };

  const handleAskAgent = async () => {
    if (!question) return;
    const userQ = question;
    setQuestion("");
    setChatLoading(true);
    try {
      // --- DEPLOYMENT FIX: Using Dynamic URL ---
      const response = await axios.get(`${API_BASE_URL}/ask-agent`, {
        params: { question: userQ, context: currentResearchTopic }
      });
      setChatHistory(prev => [...prev, { q: userQ, a: response.data.answer }]);
    } catch (error) { 
        console.error("Chat Error:", error);
    }
    setChatLoading(false);
  };

  if (!mounted) return null;

  return (
    <main className="relative h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans flex flex-col">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-3">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Cpu size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Nexus<span className="text-indigo-600">.Core</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${isLocked ? 'bg-white text-slate-400 border-slate-200' : 'bg-orange-500 text-white border-orange-600 animate-pulse'}`}
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
              {isLocked ? "Unlock Layout" : "Layout Mode: ON"}
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
               <ShieldCheck size={14} /> Neural Link Active
             </div>
          </div>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex-1 overflow-auto pt-24 pb-32 px-6 max-w-[1600px] mx-auto w-full flex flex-wrap gap-6 justify-center content-start scrollbar-hide">
        
        {!data && !loading ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-700">
            <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <BrainCircuit size={80} className="text-indigo-600 relative animate-pulse" />
            </div>
            <h2 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-500 bg-clip-text text-transparent">
                 NEXUS NEURAL Intelligence
            </h2>
            <p className="text-indigo-400 font-mono text-sm tracking-[0.3em] uppercase italic">
                "Intelligence is the ability to adapt to change"
            </p>
          </div>
        ) : (
          <>
            {/* LEFT: NEXUS MEMORY */}
            <div 
              style={{ resize: isLocked ? 'none' : 'both', overflow: 'auto' }}
              className={`flex flex-col bg-white rounded-[2.5rem] border ${isLocked ? 'border-slate-200' : 'border-orange-400 border-dashed shadow-2xl scale-[1.01]'} min-w-[350px] w-[46%] h-[600px] transition-all overflow-hidden shadow-sm`}
            >
              <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${isLocked ? 'bg-orange-50/50 border-orange-100' : 'bg-orange-500 text-white border-orange-600'}`}>
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isLocked ? 'text-orange-600' : 'text-white'}`}>
                  <MessageSquare size={16} /> Nexus Memory Engine
                </div>
                {!isLocked && <Move size={14} className="animate-bounce" />}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-white">
                {chatHistory.map((chat, i) => (
                  <div key={i} className="space-y-4 animate-in slide-in-from-left-4">
                    <div className="flex justify-start">
                      <div className="bg-orange-50 border border-orange-100 text-orange-900 text-sm px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] font-medium">
                        <span className="text-[9px] uppercase text-orange-400 block mb-1 font-bold">Query</span>
                        {chat.q}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-slate-900 text-white text-sm px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-md font-medium">
                        <span className="text-[9px] uppercase text-slate-400 block mb-1 font-bold">Nexus Response</span>
                        {chat.a}
                      </div>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-2 p-4 bg-orange-50/50 w-fit rounded-xl">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-200 focus-within:border-orange-400 transition-all shadow-inner">
                  <input 
                    className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-800 placeholder:text-slate-400 text-sm font-medium"
                    placeholder="Ask about the context..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAgent()}
                  />
                  <button onClick={handleAskAgent} disabled={chatLoading} className="bg-orange-500 p-2 rounded-xl text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: AGENT OUTPUTS */}
            <div 
              style={{ resize: isLocked ? 'none' : 'both', overflow: 'auto' }}
              className={`flex flex-col bg-white rounded-[2.5rem] border ${isLocked ? 'border-slate-200' : 'border-indigo-400 border-dashed shadow-2xl scale-[1.01]'} min-w-[350px] w-[46%] h-[600px] transition-all overflow-hidden shadow-sm`}
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <div className="flex gap-4">
                  {['report', 'research', 'critic'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[11px] font-black uppercase tracking-widest transition-all px-3 py-1 rounded-lg ${
                        activeTab === tab ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {!isLocked && <Move size={14} className="text-indigo-500 animate-bounce" />}
              </div>

              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling Intel...</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-500">
                    {activeTab === "report" && (
                      <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">{data?.final_report}</div>
                      </div>
                    )}
                    {activeTab === "research" && (
                      <div className="space-y-4 font-mono text-xs bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-emerald-900 leading-loose">
                        <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold uppercase tracking-tighter underline">
                          <Globe size={14} /> Global Intelligence Logs
                        </div>
                        {renderTextWithLinks(data?.researcher_output)}
                      </div>
                    )}
                    {activeTab === "critic" && (
                      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <h4 className="text-amber-800 font-bold text-xs uppercase mb-3 flex items-center gap-2 italic">
                          <Zap size={14} /> Audit Report
                        </h4>
                        <div className="text-amber-900/80 italic leading-relaxed">{data?.critic_review}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-100 to-transparent pt-10 pb-8 px-6 z-[120]">
        <div className={`transition-all duration-700 mx-auto ${data || loading ? 'max-w-4xl' : 'max-w-2xl'}`}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-600/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-white border-2 border-slate-200 p-2 rounded-[2.2rem] shadow-2xl focus-within:border-indigo-500 transition-all">
              <div className="px-4">
                <button 
                  onClick={() => setIsDeepSearch(!isDeepSearch)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${isDeepSearch ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                >
                  <Zap size={14} className={isDeepSearch ? 'animate-pulse' : ''} />
                  <span className="text-[10px] font-black uppercase">Deep Mode</span>
                </button>
              </div>
              <input 
                className="flex-1 bg-transparent px-2 py-3 outline-none text-md text-slate-900 placeholder:text-slate-400 font-bold"
                placeholder="Initiate a new research mission..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-slate-900 text-white h-12 px-8 rounded-full hover:bg-indigo-600 transition-all flex items-center gap-2 font-black text-xs tracking-widest shadow-xl"
              >
                {loading ? "SEARCHING..." : "Run"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}