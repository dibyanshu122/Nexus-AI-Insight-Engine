🧠 Nexus.Core – Neural Research & Intelligence Engine
Nexus.Core is a multi-agent AI system designed to automate deep research. It doesn't just search the web; it analyzes, critiques, and synthesizes high-quality intelligence reports in real-time. Built with a focus on 2026 Energy & Global Markets, it uses a specialized agentic workflow to ensure data accuracy and professional formatting.

🚀 Key Features
Multi-Agent Orchestration: Uses a 3-tier agent system:

🕵️ Researcher Agent: Scours the live web using Tavily AI for the most recent 2026 data.

⚖️ Critic Agent: Evaluates research for bias, gaps, and factual errors.

✍️ Writer Agent: Synthesizes the final report in professional Markdown.

Real-time Intelligence: Unlike standard LLMs, Nexus is connected to the live internet. It understands current global conflicts, market shifts, and policy updates.

Neural Memory (RAG): Powered by Pinecone, the system remembers past research to provide context-aware follow-up answers.

Professional PDF Export: One-click "Download PDF" feature using react-to-print for perfectly formatted, multi-page research documents.

Deep Search Mode: High-intensity research mode for complex technical or geopolitical topics.

🛠️ Tech Stack
Frontend (The Interface)
Framework: Next.js 16 (App Router)

Styling: Tailwind CSS 4 (Modern Glassmorphism UI)

Icons: Lucide-React

PDF Logic: React-to-Print (Native Browser Engine)

Backend (The Neural Core)
Framework: FastAPI (Python)

LLM: Google Gemini 1.5 Pro / Flash

Search Engine: Tavily AI (Real-time Web Access)

Vector DB: Pinecone (Long-term Memory)

Database: Supabase (Research History)

📂 Project Structure
Bash
nexus-core/
├── client/                 # Next.js Frontend
│   ├── app/                # Main Application Logic
│   ├── utils/              # PDF Helpers & Tools
│   └── public/             # Assets
└── server/                 # FastAPI Backend
    ├── agents/             # Researcher, Critic, Writer Agents
    ├── core/               # Database & Vector Logic
    └── main.py             # API Endpoints
🔧 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/nexus-core.git
Setup Backend:

Bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
Setup Frontend:

Bash
cd client
npm install
npm run dev
Environment Variables:
Create a .env file and add your API keys:

GEMINI_API_KEY

TAVILY_API_KEY

PINECONE_API_KEY

📈 Future Roadmap
[ ] Multi-language support (Hindi/English script detection).

[ ] Real-time data visualization (Charts/Graphs) inside reports.

[ ] Collaborative research workspaces.

👨‍💻 Developed by
Dibyanshu Singh Full Stack Developer | AI Enthusiast
