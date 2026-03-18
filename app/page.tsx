"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useReactToPrint } from "react-to-print"; // 💡 Added for professional PDF
import { 
  Send, Activity, Cpu, BrainCircuit, Search, Zap, ExternalLink, Globe, 
  MessageSquare, ShieldCheck, Lock, Unlock, Move, X, ChevronLeft, 
  ChevronRight, FileText, Download 
} from "lucide-react";

// --- DEPLOYMENT FIX: Hugging Face URL definition ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ddibyanshu122-nexus-neural-core.hf.space";

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
  const [isChatOpen, setIsChatOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const reportTopRef = useRef<HTMLDivElement>(null);
  const reportPrintRef = useRef<HTMLDivElement>(null); // 💡 Ref for professional PDF logic
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

  // --- 💡 PROFESSIONAL PDF LOGIC (React-to-Print) ---
  const handlePrint = useReactToPrint({
    contentRef: reportPrintRef,
    documentTitle: `Nexus_Report_${currentResearchTopic.replace(/\s+/g, '_') || 'Intelligence'}`,
  });

  // --- Effect 1: Chat Scroll ---
  useEffect(() => { 
    if (isChatOpen && chatHistory.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
    }
  }, [chatHistory.length, chatLoading, isChatOpen]);

  // --- Effect 2: Report Scroll Focus ---
  useEffect(() => {
    if (data && !loading) {
      const timer = setTimeout(() => {
        reportTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data, loading]);

  // --- REPORT FORMATTING ---
  const MarkdownComponents = {
    h1: ({children}: any) => <h1 className="text-4xl font-black text-amber-950 mb-8 border-b-4 border-orange-200 pb-4 uppercase tracking-tighter leading-none">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-2xl font-bold text-orange-800 mt-12 mb-6 flex items-center gap-3"><div className="w-2 h-8 bg-orange-500 rounded-full"></div>{children}</h2>,
    table: ({children}: any) => (
      <div className="my-8 w-full overflow-x-auto border-2 border-orange-100 rounded-2xl shadow-md bg-white">
        <table className="w-full border-collapse min-w-[600px] text-base text-left">
          {children}
        </table>
      </div>
    ),
    thead: ({children}: any) => <thead className="bg-orange-50 border-b-2 border-orange-100 text-orange-800 font-black uppercase text-xs tracking-widest">{children}</thead>,
    th: ({children}: any) => <th className="px-6 py-4 font-bold border-r border-orange-100 last:border-r-0">{children}</th>,
    td: ({children}: any) => <td className="px-6 py-4 border-t border-orange-50 border-r border-orange-50 last:border-r-0 text-slate-700 font-medium leading-relaxed">{children}</td>,
    p: ({children}: any) => <p className="mb-6 text-slate-700 leading-9 text-lg font-medium text-left">{children}</p>,
    ul: ({children}: any) => <ul className="space-y-4 mb-8 ml-2 list-none">{children}</ul>,
    li: ({children}: any) => (
      <li className="flex items-start gap-4 text-slate-700 font-semibold text-lg leading-relaxed">
        <span className="text-orange-500 mt-2.5 w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 shadow-sm"></span>
        <div className="flex-1 -mt-1">{children}</div>
      </li>
    ),
    hr: () => <hr className="my-10 border-orange-100/50" />,
    strong: ({children}: any) => <strong className="font-black text-orange-900 bg-orange-100/30 px-1 rounded">{children}</strong>
  };

  const ChatMarkdownComponents = {
    ...MarkdownComponents,
    table: ({children}: any) => (
      <div className="my-4 w-full overflow-x-auto border border-orange-200 rounded-xl bg-white shadow-sm">
        <table className="w-full border-collapse text-[11px] text-left">{children}</table>
      </div>
    ),
    td: ({children}: any) => <td className="px-3 py-2 border-t border-orange-50 text-amber-950 font-bold leading-tight">{children}</td>,
    p: ({children}: any) => <p className="mb-2 text-amber-950 leading-relaxed text-sm font-semibold">{children}</p>,
  };

  const handleSearch = async () => {
    if (!topic) return;
    setCurrentResearchTopic(topic);
    setLoading(true);
    setData(null); 
    setChatHistory([]);
    setIsChatOpen(false); 
    try {
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
    setIsChatOpen(true); 
    try {
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
    <main className={`relative h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col ${(!data && !loading) ? 'overflow-hidden' : 'overflow-y-auto scroll-smooth'}`}>
      
      {/* 1. FLOATING HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
              <Cpu size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Nexus<span className="text-indigo-600">.Core</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            {data && (
              <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200">
                <button onClick={() => setIsChatOpen(false)} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isChatOpen ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><FileText size={14} /> Report View</button>
                <button onClick={() => setIsChatOpen(true)} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isChatOpen ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><MessageSquare size={14} /> Intelligence Chat</button>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[10px] font-bold uppercase tracking-wider"><ShieldCheck size={14} /> Neural Link Active</div>
          </div>
        </div>
      </header>

      {/* 2. MAIN AREA */}
      <div className={`flex-1 w-full flex flex-col items-center px-6 max-w-5xl mx-auto ${(!data && !loading) ? 'justify-center' : 'pt-28 pb-40'}`}>
        
        <div ref={reportTopRef} className="scroll-mt-32" />

        {!data && !loading ? (
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-1000 -mt-20">
            <div className="relative">
              <div className="absolute -inset-10 bg-indigo-500/15 blur-[100px] rounded-full animate-pulse"></div>
              <BrainCircuit size={120} className="text-indigo-600 relative animate-pulse" />
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-500 bg-clip-text text-transparent uppercase leading-tight">Neural Research Engine</h2>
              <p className="text-slate-400 font-mono text-sm tracking-[0.5em] uppercase italic">Automating the frontier of knowledge</p>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden min-h-[60vh] flex flex-col">
            {!isChatOpen && (
              <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <div className="flex gap-8">
                  {['report', 'research', 'critic'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2 ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>{tab}</button>
                  ))}
                </div>

                {/* 💡 PDF DOWNLOAD BUTTON (Using React-to-Print) */}
                {activeTab === "report" && (
                  <button 
                    onClick={() => handlePrint()} 
                    className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                )}
              </div>
            )}

            <div className="p-10 md:p-16">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest animate-pulse tracking-[0.3em]">Synthesizing Intelligence...</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-700">
                  {!isChatOpen ? (
                    <div className="max-w-4xl mx-auto">
                      {/* 💡 Ref 'reportPrintRef' targetted for the professional PDF area */}
                      <div ref={reportPrintRef} className="bg-white print:p-12 print:text-black"> 
                        {activeTab === "report" && (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{data?.final_report}</ReactMarkdown>
                        )}
                        {activeTab === "research" && (
                          <div className="bg-emerald-50/20 p-10 rounded-[2rem] border border-emerald-100">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{data?.researcher_output}</ReactMarkdown>
                          </div>
                        )}
                        {activeTab === "critic" && (
                          <div className="bg-amber-50/20 p-10 rounded-[2rem] border border-amber-100">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>{data?.critic_review}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8 -m-10 md:-m-16">
                       <div className="px-10 py-6 border-b border-orange-100 bg-orange-50/30 flex items-center justify-between font-black text-[11px] uppercase tracking-widest text-orange-600">
                        <div className="flex items-center gap-3"><MessageSquare size={18} /> Intelligence Stream</div>
                        <button onClick={() => setIsChatOpen(false)} className="hover:rotate-90 transition-transform"><X size={20} /></button>
                      </div>
                      <div className="p-10 space-y-10 min-h-[50vh]">
                        {chatHistory.map((chat, i) => (
                          <div key={i} className="flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-500">
                            <div className="flex justify-start"><div className="bg-white border border-slate-200 text-slate-800 text-sm px-6 py-4 rounded-2xl rounded-tl-none shadow-sm font-bold border-l-4 border-l-indigo-600">{chat.q}</div></div>
                            <div className="flex justify-end">
                              <div className="bg-[#fff7ed] border border-orange-100 text-amber-950 text-sm px-8 py-6 rounded-3xl rounded-tr-none shadow-sm max-w-[90%]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={ChatMarkdownComponents}>{chat.a}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        ))}
                        {chatLoading && <div className="flex gap-2 p-4 bg-orange-100/50 w-fit rounded-full animate-pulse ml-auto"><div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" /><div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.2s]" /></div>}
                        <div ref={chatEndRef} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. SEARCH BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[120] bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/95 to-transparent pt-12 pb-8 px-6">
        <div className="mx-auto max-w-4xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-orange-500 rounded-[3rem] blur-xl opacity-10 group-hover:opacity-25 transition duration-1000 group-focus-within:opacity-30"></div>
          
          <div className="relative flex items-center bg-white border-2 border-slate-200/60 p-2 rounded-[3rem] shadow-2xl focus-within:border-indigo-500/50 transition-all backdrop-blur-md">
            <div className="px-4">
              <button onClick={() => setIsDeepSearch(!isDeepSearch)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isDeepSearch ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}>
                <Zap size={14} className={isDeepSearch ? 'animate-pulse' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Deep</span>
              </button>
            </div>
            
            <input 
              className="flex-1 bg-transparent px-3 py-4 outline-none text-sm text-slate-900 placeholder:text-slate-400 font-bold" 
              placeholder={data ? "Ask a follow-up intelligence..." : "Initiate neural research mission..."} 
              value={data ? question : topic} 
              onChange={(e) => data ? setQuestion(e.target.value) : setTopic(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && (data ? handleAskAgent() : handleSearch())} 
            />
            
            <button 
              onClick={data ? handleAskAgent : handleSearch} 
              disabled={loading || chatLoading} 
              className={`h-12 w-12 sm:w-auto sm:px-10 rounded-full flex items-center justify-center gap-2 text-white font-black text-[10px] tracking-widest shadow-xl transition-all active:scale-95 ${data ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-900 hover:bg-indigo-600'}`}
            >
              {(loading || chatLoading) ? <Activity size={18} className="animate-spin" /> : (
                <>
                  <span className="hidden sm:block uppercase">{data ? "Analyze" : "Research"}</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
