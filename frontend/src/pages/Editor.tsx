import React, { useState, useRef } from 'react';

type KeystrokeEvent = {
  type: 'down' | 'up';
  timestamp: number;
  category: 'character' | 'space' | 'backspace' | 'enter' | 'punctuation' | 'other';
};

const classifyKey = (key: string): KeystrokeEvent['category'] => {
  if (key === 'Backspace') return 'backspace';
  if (key === 'Enter') return 'enter';
  if (key === ' ') return 'space';
  if (/^[a-zA-Z0-9]$/.test(key)) return 'character';
  if (/^[.,!?;:'"()\-]$/.test(key)) return 'punctuation';
  return 'other';
};

const Editor: React.FC = () => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const keystrokesRef = useRef<KeystrokeEvent[]>([]);
  const startTimeRef = useRef<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.repeat) return;
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    
    keystrokesRef.current.push({
      type: 'down',
      timestamp: Date.now(),
      category: classifyKey(e.key)
    });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    keystrokesRef.current.push({
      type: 'up',
      timestamp: Date.now(),
      category: classifyKey(e.key)
    });
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    
    // Calculate metadata
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = content.length;
    const timeSpentMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    const timeSpentSec = Math.floor(timeSpentMs / 1000);

    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    
    if (!userInfo || !userInfo.token) {
      alert('You must be logged in to save sessions.');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          content,
          metadata: {
            wordCount,
            charCount,
            timeSpent: timeSpentSec,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

      alert('Session saved successfully!');
      
      // Optionally reset for a new session
      startTimeRef.current = null;
      keystrokesRef.current = [];
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-12 pb-24 px-6 md:px-16 w-full items-center">
      
      {/* Header Section */}
      <header className="w-full flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-[0.15em] text-blue-100">
          Vi Notes
        </h1>
        <div className="w-[80%] max-w-xl h-px bg-slate-700 mt-6 mb-12 shadow-[0_0_10px_rgba(148,163,184,0.1)]"></div>
      </header>

      {/* Editor Main Content */}
      <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-start mt-4">
        <div className="w-[95%] md:w-[80%] flex flex-col space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder="Write your notes here..."
            className="w-full h-[60vh] md:h-[65vh] rounded-2xl bg-[#1e293b] text-white placeholder-slate-400 p-6 md:p-8 border-2 border-slate-600 outline-none focus:border-blue-500 transition-colors duration-300 resize-none font-sans text-lg md:text-xl leading-relaxed"
            spellCheck="false"
            autoFocus
          />
          <div className="flex justify-end w-full">
            <button 
              onClick={handleSave}
              disabled={isSaving || !content.trim()}
              className={`px-8 py-2.5 ${isSaving || !content.trim() ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} text-white font-semibold rounded-xl shadow-[0_0_10px_rgba(37,99,235,0.2)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default Editor;
