import React, { useState } from 'react';
import VowelPhonicChart from './components/VowelPhonicChart';
import WordSearchPuzzle from './components/WordSearchPuzzle';
import StoryTime from './components/StoryTime';
import { BookOpen, Puzzle, Storybook } from './components/icons';

function App() {
  const [view, setView] = useState<'chart' | 'puzzle' | 'story'>('chart');

  const navButtonClasses = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const activeClasses = "bg-blue-600 text-white shadow";
  const inactiveClasses = "bg-white text-gray-600 hover:bg-blue-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <header className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">Jeffrey's Reading App</h1>
          </div>
          <p className="text-lg text-gray-600">Learn phonics and play fun word games!</p>
        </header>

        <nav className="flex justify-center p-2 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm mb-6 sticky top-4 z-10">
          <div className="flex space-x-2 bg-gray-200/70 p-1 rounded-lg">
            <button
              onClick={() => setView('chart')}
              className={`${navButtonClasses} ${view === 'chart' ? activeClasses : inactiveClasses}`}
              aria-pressed={view === 'chart'}
            >
              <BookOpen className="w-5 h-5" />
              Phonics Chart
            </button>
            <button
              onClick={() => setView('puzzle')}
              className={`${navButtonClasses} ${view === 'puzzle' ? activeClasses : inactiveClasses}`}
              aria-pressed={view === 'puzzle'}
            >
              <Puzzle className="w-5 h-5" />
              Word Puzzle
            </button>
            <button
              onClick={() => setView('story')}
              className={`${navButtonClasses} ${view === 'story' ? activeClasses : inactiveClasses}`}
              aria-pressed={view === 'story'}
            >
              <Storybook className="w-5 h-5" />
              Story Time
            </button>
          </div>
        </nav>
        
        <main>
          {view === 'chart' && <VowelPhonicChart />}
          {view === 'puzzle' && <WordSearchPuzzle />}
          {view === 'story' && <StoryTime />}
        </main>
      </div>
    </div>
  );
}

export default App;