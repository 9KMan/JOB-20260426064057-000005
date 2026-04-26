import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState('dashboard');
  const [authForm, setAuthForm] = useState({ email: '', password: '', company_name: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleAuth = async (e, isRegister) => {
    e.preventDefault();
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        const userData = { id: data.user_id, email: authForm.email };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setView('dashboard');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      alert('Server error. Please try again.');
    }
  };

  const fetchProjects = async () => {
    if (!user) return;
    const res = await fetch(`${API_BASE}/projects?user_id=${user.id}`);
    const data = await res.json();
    setProjects(data);
  };

  const createProject = async (name, description) => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, name, description })
    });
    if (res.ok) fetchProjects();
  };

  const runAIAnalysis = async (text, modelType) => {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, text, model_type: modelType })
    });
    return await res.json();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('login');
  };

  if (!user) {
    return (
      <div className="auth-container">
        <h1>SaaS AI Platform</h1>
        <div className="auth-forms">
          <form onSubmit={(e) => handleAuth(e, true)}>
            <h2>Register</h2>
            <input type="email" placeholder="Email" value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})} required />
            <input type="password" placeholder="Password"
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})} required />
            <input type="text" placeholder="Company Name"
              onChange={(e) => setAuthForm({...authForm, company_name: e.target.value})} />
            <button type="submit">Sign Up</button>
          </form>
          <form onSubmit={(e) => handleAuth(e, false)}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})} required />
            <input type="password" placeholder="Password"
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})} required />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>SaaS AI Platform</h1>
        <nav>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('ai')}>AI Tools</button>
          <button onClick={() => { fetchProjects(); setView('projects'); }}>Projects</button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>
      <main>
        {view === 'dashboard' && (
          <div className="dashboard">
            <h2>Welcome, {user.email}</h2>
            <div className="stats">
              <div className="stat-card">
                <h3>Projects</h3>
                <p>Manage your AI projects</p>
                <button onClick={() => { fetchProjects(); setView('projects'); }}>View Projects</button>
              </div>
              <div className="stat-card">
                <h3>AI Analysis</h3>
                <p>Run AI-powered analysis</p>
                <button onClick={() => setView('ai')}>Try AI Tools</button>
              </div>
            </div>
          </div>
        )}
        {view === 'ai' && <AITools user={user} runAnalysis={runAIAnalysis} />}
        {view === 'projects' && <ProjectsPanel projects={projects} createProject={createProject} />}
      </main>
    </div>
  );
}

function AITools({ user, runAnalysis }) {
  const [text, setText] = useState('');
  const [modelType, setModelType] = useState('sentiment');
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    const result = await runAnalysis(text, modelType);
    setResults(result);
  };

  return (
    <div className="ai-tools">
      <h2>AI Analysis Tools</h2>
      <select value={modelType} onChange={(e) => setModelType(e.target.value)}>
        <option value="sentiment">Sentiment Analysis</option>
        <option value="classification">Text Classification</option>
        <option value="extraction">Entity Extraction</option>
      </select>
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze..." rows={6} />
      <button onClick={handleAnalyze}>Analyze</button>
      {results && (
        <div className="results">
          <h3>Results</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function ProjectsPanel({ projects, createProject }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    createProject(name, desc);
    setName('');
    setDesc('');
  };

  return (
    <div className="projects-panel">
      <h2>Projects</h2>
      <form onSubmit={handleCreate}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" required />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
        <button type="submit">Create Project</button>
      </form>
      <div className="projects-list">
        {projects.map(p => (
          <div key={p.id} className="project-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <span className="status">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;