# 🧠 Nexus Neural | Agentic AI Research Engine

**Nexus Neural** is an advanced, multi-agent research intelligence system designed to provide deep-web insights. It automates data gathering, fact-verification, and professional report synthesis using an autonomous agentic workflow.

---

## 🚀 Key Features

- **🔍 Smart Query Refinement:** Automatically corrects typos and expands vague prompts into professional research topics.
- **🤖 Multi-Agent Workflow:** - **Researcher Agent:** Scrapes real-time data from the web.
  - **Critic Agent:** Audits research findings for accuracy.
  - **Writer Agent:** Synthesizes data into structured Markdown reports.
- **🧠 Hybrid Memory System:** Uses **Pinecone** for vector memory and **Supabase** for persistence.
- **🌍 Bilingual Intelligence:** Native support for English, Hindi, and Hinglish queries.
- **📄 Professional Export:** One-click functionality to download research reports as PDFs.

---

## 🛠️ Tech Stack

### **Backend (Python)**
* FastAPI, LangChain, LangGraph, Groq (Llama 3), Tavily AI, Pinecone, Supabase.

### **Frontend (TypeScript)**
* Next.js 14, Tailwind CSS, Framer Motion, Lucide React.

---

## 🏗️ Getting Started

First, install dependencies for both layers.

### Frontend Setup
```bash
cd client
npm install
npm run dev

Backend Setup

cd server
pip install -r requirements.txt
python main.py
