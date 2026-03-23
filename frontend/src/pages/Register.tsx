import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/editor');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-12 pb-24 px-6 md:px-16 w-full items-center">
      <header className="w-full flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-[0.15em] text-blue-100">
          Vi Notes
        </h1>
        <div className="w-[80%] max-w-xl h-px bg-slate-700 mt-6 mb-12 shadow-[0_0_10px_rgba(148,163,184,0.1)]"></div>
      </header>

      <main className="w-full max-w-md flex-grow flex items-center justify-center">
        <div className="w-full rounded-2xl bg-[#1e293b] text-white p-8 md:p-10 border-2 border-slate-600 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-50">Create Account</h2>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg mb-4 text-sm text-center">{error}</div>}
          <form onSubmit={handleRegister} className="flex flex-col space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0f172a] text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-600 outline-none focus:border-blue-400 focus:shadow-[0_0_10px_rgba(96,165,250,0.2)] transition-all duration-300"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f172a] text-white placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-600 outline-none focus:border-blue-400 focus:shadow-[0_0_10px_rgba(96,165,250,0.2)] transition-all duration-300"
                placeholder="••••••••"
                required
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl py-3 mt-4 shadow-[0_0_10px_rgba(37,99,235,0.2)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
