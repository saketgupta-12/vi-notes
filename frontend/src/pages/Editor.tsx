import React, { useState } from 'react';

const Editor: React.FC = () => {
  const [content, setContent] = useState('');

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
            placeholder="Write your notes here..."
            className="w-full h-[60vh] md:h-[65vh] rounded-2xl bg-[#1e293b] text-white placeholder-slate-400 p-6 md:p-8 border-2 border-slate-600 outline-none focus:border-blue-500 transition-colors duration-300 resize-none font-sans text-lg md:text-xl leading-relaxed"
            spellCheck="false"
            autoFocus
          />
          <div className="flex justify-end w-full">
            <button className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-[0_0_10px_rgba(37,99,235,0.2)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Save Note
            </button>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default Editor;
