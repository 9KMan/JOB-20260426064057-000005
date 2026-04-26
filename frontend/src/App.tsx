import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

interface Analysis {
  id: number;
  status: string;
  result?: any;
  created_at: string;
}

function App() {
  const [text, setText] = useState('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analyses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyses(response.data.analyses || []);
    } catch (error) {
      console.error('Failed to fetch analyses');
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/analyses`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
      fetchAnalyses();
    } catch (error) {
      console.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1>SaaS AI Platform</h1>
        <p>Build powerful AI-driven applications with ease</p>
      </header>

      <main>
        <section style={{ marginBottom: '40px' }}>
          <h2>Text Analysis</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </section>

        {result && (
          <section style={{ marginBottom: '40px' }}>
            <h3>Analysis Result</h3>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}

        <section>
          <h2>Recent Analyses</h2>
          {analyses.length === 0 ? (
            <p>No analyses yet. Start by analyzing some text!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {analyses.map((analysis) => (
                <li key={analysis.id} style={{
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong>Analysis #{analysis.id}</strong> - {analysis.status}
                  <br />
                  <small>{new Date(analysis.created_at).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;