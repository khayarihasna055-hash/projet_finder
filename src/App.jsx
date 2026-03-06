import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, GitFork, ExternalLink, Github, BookOpen, User, Terminal, Eye } from "lucide-react";

export default function App() {
  const [username, setUsername] = useState("");
  const [repoName, setRepoName] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyMsg, setEmptyMsg] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: (e.clientX - window.innerWidth / 2) / 20, y: (e.clientY - window.innerHeight / 2) / 20 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchRepo = async () => {
    if (!username.trim() || !repoName.trim()) {
      setEmptyMsg(true);
      return;
    }
    setEmptyMsg(false);
    setLoading(true);
    setError(false);
    setData(null);
    try {
      const res = await fetch(`https://api.github.com/repos/${username.trim()}/${repoName.trim()}`);
      const result = await res.json();
      res.ok ? setData(result) : setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <style>{`
        html, body { height: 100%; margin: 0; padding: 0; background: #071226; overflow-x: hidden; }
        #root { display: grid; place-items: center; min-height: 100vh; width: 100%; }
        
        body::before {
          content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at 50% 50%, #1e293b 0%, #071226 100%);
          z-index: -1;
        }

        .mesh {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
                            radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
                            radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
          filter: blur(100px); z-index: -2; opacity: 0.5; animation: meshMove 10s infinite alternate;
        }
        @keyframes meshMove { 0% { transform: scale(1); } 100% { transform: scale(1.2) translate(20px, 20px); } }

        .typing {
          width: 0; overflow: hidden; white-space: nowrap; border-right: 3px solid #00ffff;
          animation: typing 3s steps(20) forwards, blink 0.75s step-end infinite;
        }
        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes blink { from, to { border-color: transparent } 50% { border-color: #00ffff } }

        .viewBtn:hover {
          box-shadow: 0 0 20px #00ffff, inset 0 0 10px #00ffff !important;
          background: rgba(0, 255, 255, 0.2) !important;
          color: white !important;
        }

        .stat-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; cursor: pointer; }
        .stat-card:hover { transform: translateY(-12px) scale(1.05) !important; border-color: #00ffff !important; box-shadow: 0 10px 30px rgba(0,255,255,0.2); }

        .loader { border: 4px solid rgba(0,255,255,0.1); border-top: 4px solid #00ffff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .footerText { opacity: 0.7; color: #8b949e; transition: 0.3s; cursor: pointer; font-weight: bold; }
        .footerText:hover { color: white !important; opacity: 1 !important; text-shadow: 0 0 10px white; }
      `}</style>

      <div className="mesh" />

      <motion.header style={headerStyle}>
        <motion.div animate={{ x: mousePos.x, y: mousePos.y }} style={iconBoxStyle}>
          <Github size={32} color="white"/>
        </motion.div>
        <div className="typing">
          <h1 style={titleStyle}>GitHub Finder</h1>
        </div>
      </motion.header>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={searchBoxStyle}>
        <div style={inputGrid}>
          <div style={inputWrapper}>
            <label style={labelStyle}><User size={12}/> OWNER</label>
            <input placeholder="facebook" style={inputStyle} value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchRepo()} />
          </div>
          <div style={inputWrapper}>
            <label style={labelStyle}><BookOpen size={12}/> REPO</label>
            <input placeholder="react" style={inputStyle} value={repoName} onChange={e=>setRepoName(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchRepo()} />
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={fetchRepo} style={btnStyle}>
          <Terminal size={18}/> Search Repo
        </motion.button>
      </motion.div>

      <div style={{ width: "100%", maxWidth: "800px" }}>
        <AnimatePresence>
          {emptyMsg && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={errorStyle}>⚠ Please fill both fields.</motion.div>}
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={errorStyle}>❌ Repository not found</motion.div>}
          {loading && <div className="loader"></div>}

          {data && !loading && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              
              whileHover={{ rotateX: mousePos.y * 1.5, rotateY: -mousePos.x * 1.5 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              style={resultCardStyle}
            >
              <div style={resultHeader}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  <img src={data.owner.avatar_url} style={avatarStyle} alt="avatar" />
                  <div style={{ textAlign: 'left' }}>
                    <h2 style={{ margin: 0, color: "#00ffff", fontSize: '1.8rem' }}>{data.name}</h2>
                    <p style={{ color: "#8b949e" }}>{data.description || "No description provided."}</p>
                  </div>
                </div>
                <a href={data.html_url} target="_blank" rel="noreferrer" className="viewBtn" style={viewBtnStyle}>
                  <ExternalLink size={18}/> View on GitHub
                </a>
              </div>

              <div style={statsGrid}>
                <StatBox icon={<Star size={20}/>} value={data.stargazers_count} label="Stars"/>
                <StatBox icon={<GitFork size={20}/>} value={data.forks_count} label="Forks"/>
                <StatBox icon={<Eye size={20}/>} value={data.watchers_count} label="Watchers"/>
                <StatBox icon={<User size={20}/>} value={data.owner.login} label="Owner"/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer style={{ marginTop: "50px" }}>
        <div className="footerText">
          Built with 💙 by HASNA
        </div>
      </footer>
    </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div className="stat-card" style={statBoxStyle}>
      <div style={{ color: "#00ffff", marginBottom: "10px" }}>{icon}</div>
      <div style={{ fontWeight: "900", fontSize: '1.2rem' }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div style={{ fontSize: "10px", color: "#8b949e", letterSpacing: '1px' }}>{label}</div>
    </div>
  );
}
const containerStyle = { 
  width: "100%", 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center", 
  justifyContent: "flex-start", 
  padding: "0 20px 40px 20px",  
  minHeight: "100vh" 
};
const headerStyle = { 
  display: "flex", 
  alignItems: "center", 
  gap: "20px", 
  marginBottom: "40px",
  position: "sticky",    
  top: "0",              
  zIndex: "1000",       
  background: "#071226", 
  width: "100%", 
  justifyContent: "center",
  padding: "20px 0"       
};
const iconBoxStyle = { padding: "15px", background: "linear-gradient(45deg,#00ffff,#2563eb)", borderRadius: "20px", boxShadow: "0 0 20px rgba(0,255,255,0.4)" };
const titleStyle = { fontSize: "3rem", fontWeight: "900", margin: 0, color: 'white' };
const searchBoxStyle = { width: "100%", maxWidth: "600px", background: "rgba(12, 27, 46, 0.8)", backdropFilter: 'blur(10px)', padding: "40px", borderRadius: "35px", border: "1px solid rgba(0,255,255,0.1)", boxShadow: "0 25px 50px rgba(0,0,0,0.3)", marginBottom: '30px' };
const inputGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" };
const inputWrapper = { display: "flex", flexDirection: "column", gap: "10px" };
const labelStyle = { fontSize: "11px", color: "#8b949e", fontWeight: 'bold', letterSpacing: '1px' };
const inputStyle = { background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,255,255,0.2)", padding: "15px", borderRadius: "15px", color: "white", outline: "none", transition: '0.3s' };
const btnStyle = { width: "100%", background: "linear-gradient(90deg,#00ffff,#2563eb)", border: "none", padding: "18px", borderRadius: "15px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: '#071226', textTransform: 'uppercase', letterSpacing: '1px' };


const resultCardStyle = { background: "#0c1b2e", padding: "45px", borderRadius: "40px", border: "1px solid rgba(0,255,255,0.1)", width: "100%", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", transformStyle: "preserve-3d" };

const resultHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "25px" };
const avatarStyle = { width: "85px", height: "85px", borderRadius: "50%", border: "3px solid #00ffff", padding: '3px' };
const viewBtnStyle = { display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,255,255,0.05)", color: "#00ffff", padding: "12px 25px", borderRadius: "15px", textDecoration: "none", border: "1px solid #00ffff", fontWeight: "bold", transition: '0.4s' };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "20px" };
const statBoxStyle = { background: "#071226", padding: "25px", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.03)" };
const errorStyle = { textAlign: "center", padding: "20px", background: "rgba(255,0,0,0.1)", color: "#ff7b72", borderRadius: "20px", marginBottom: "20px", border: '1px solid rgba(255,0,0,0.2)' };
