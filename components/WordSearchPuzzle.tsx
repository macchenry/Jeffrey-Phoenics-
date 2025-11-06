import React, { useState, useEffect, useMemo } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Volume2, LoaderCircle } from './icons';

type WordData = {
  word: string;
  start: [number, number];
  end: [number, number];
};

const puzzleData: { grid: string[][]; words: WordData[] } = {
  grid: [
    ['C', 'A', 'T', 'P', 'X', 'Y', 'Z', 'A', 'D', 'A'],
    ['B', 'J', 'B', 'E', 'Z', 'R', 'S', 'W', 'O', 'Z'],
    ['E', 'Q', 'S', 'N', 'N', 'M', 'B', 'C', 'G', 'C'],
    ['D', 'A', 'S', 'U', 'N', 'I', 'O', 'X', 'P', 'U'],
    ['P', 'I', 'G', 'K', 'L', 'H', 'X', 'I', 'U', 'P'],
    ['H', 'O', 'T', 'F', 'A', 'R', 'Q', 'M', 'P', 'M'],
    ['A', 'Q', 'S', 'L', 'E', 'G', 'A', 'R', 'B', 'A'],
    ['T', 'S', 'I', 'M', 'A', 'P', 'J', 'A', 'M', 'P'],
    ['H', 'E', 'T', 'R', 'D', 'B', 'W', 'E', 'F', 'S'],
    ['A', 'R', 'U', 'N', 'W', 'X', 'Y', 'V', 'Z', 'Q'],
  ],
  words: [
    { word: 'CAT', start: [0, 0], end: [0, 2] },
    { word: 'DOG', start: [0, 8], end: [2, 8] },
    { word: 'SUN', start: [3, 2], end: [3, 4] },
    { word: 'CUP', start: [2, 9], end: [4, 9] },
    { word: 'BED', start: [1, 0], end: [3, 0] },
    { word: 'PIG', start: [4, 0], end: [4, 2] },
    { word: 'HAT', start: [5, 0], end: [7, 0] },
    { word: 'JAM', start: [7, 6], end: [7, 8] },
    { word: 'RUN', start: [9, 1], end: [9, 3] },
    { word: 'MAP', start: [7, 3], end: [7, 5] },
    { word: 'BOX', start: [2, 6], end: [4, 6] },
    { word: 'LEG', start: [6, 3], end: [6, 5] },
    { word: 'PEN', start: [0, 3], end: [2, 3] },
    { word: 'HOT', start: [5, 0], end: [5, 2] },
    { word: 'SIT', start: [6, 2], end: [8, 2] },
  ],
};

const WordSearchPuzzle = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [shownWordCells, setShownWordCells] = useState<Set<string>>(new Set());
  const { speak, isSpeaking } = useAudioPlayer();
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);

  useEffect(() => {
    if (foundWords.size === puzzleData.words.length && gameState === 'playing') {
      setGameState('finished');
    }
  }, [foundWords, gameState]);

  const wordLocations = useMemo(() => {
    const locations = new Map<string, { start: [number, number]; cells: string[] }>();
    puzzleData.words.forEach(({ word, start, end }) => {
      const cells: string[] = [];
      if (start[0] === end[0]) { // Horizontal
        for (let c = start[1]; c <= end[1]; c++) cells.push(`${start[0]}-${c}`);
      } else if (start[1] === end[1]) { // Vertical
        for (let r = start[0]; r <= end[0]; r++) cells.push(`${r}-${start[1]}`);
      }
      locations.set(word, { start, cells });
    });
    return locations;
  }, []);

  const handleSpeak = (word: string, spellOut: boolean) => {
    setSpeakingItem(word);
    const prompt = spellOut
      ? `${word}. ${word.split('').join('. ')}. ${word}. ${word.split('').join('. ')}.`
      : word;
    speak(prompt).finally(() => setSpeakingItem(null));
  };

  const handleShowWord = (word: string) => {
    const location = wordLocations.get(word);
    if (location) {
      setShownWordCells(new Set(location.cells));
      setTimeout(() => {
        setShownWordCells(new Set());
      }, 2000); // Show for 2 seconds
    }
  };

  const handleStart = () => {
    setGameState('playing');
    setFoundWords(new Set());
    setActiveWord(null);
    setShownWordCells(new Set());
  };

  const handleReset = () => {
    setGameState('idle');
    setFoundWords(new Set());
    setActiveWord(null);
    setShownWordCells(new Set());
  };

  const handleWordListClick = (word: string) => {
    if (gameState === 'playing' && !foundWords.has(word)) {
      setActiveWord(word);
    }
    // Only spell the word if it's not hidden.
    // The word is hidden when `gameState === 'playing'` and it hasn't been found.
    const shouldSpell = !(gameState === 'playing' && !foundWords.has(word));
    handleSpeak(word, shouldSpell);
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (gameState !== 'playing' || !activeWord) return;

    const correctWordLocation = wordLocations.get(activeWord);
    if (correctWordLocation && correctWordLocation.start[0] === rowIndex && correctWordLocation.start[1] === colIndex) {
      setFoundWords(prev => new Set(prev).add(activeWord));
      setActiveWord(null);
    }
  };

  const isCellInFoundWord = (r: number, c: number) => {
    const cellId = `${r}-${c}`;
    for (const word of foundWords) {
      if (wordLocations.get(word)?.cells.includes(cellId)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Word List */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 rounded-lg border">
          <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Words to Find</h2>
          <ul className="space-y-2">
            {puzzleData.words.map(({ word }) => (
              <li key={word} className={`flex items-center gap-3 p-2 rounded-md transition-all ${activeWord === word ? 'bg-yellow-200' : ''} ${foundWords.has(word) ? 'bg-green-100' : ''}`}>
                <button
                  onClick={() => handleWordListClick(word)}
                  disabled={isSpeaking}
                  className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full flex-shrink-0"
                  aria-label={`Hear word ${word}`}
                >
                  {speakingItem === word ? <LoaderCircle className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <span className={`flex-grow text-lg font-mono tracking-widest ${foundWords.has(word) ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                  {gameState === 'playing' && !foundWords.has(word) ? '???' : word}
                </span>
                {gameState === 'playing' && !foundWords.has(word) && (
                    <button 
                        onClick={() => handleShowWord(word)}
                        className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-md transition-colors"
                        aria-label={`Show location of ${word}`}
                    >
                        Show
                    </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Puzzle Grid & Controls */}
        <div className="flex-1 flex flex-col items-center">
            {gameState !== 'playing' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    {gameState === 'finished' ? (
                        <div className="p-8 bg-green-50 rounded-lg">
                            <h2 className="text-5xl font-bold text-green-600 animate-bounce">Hooray!</h2>
                            <p className="text-gray-600 mt-2">You found all the words!</p>
                            <button onClick={handleReset} className="mt-6 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                Play Again
                            </button>
                        </div>
                    ) : (
                         <div className="p-8 bg-blue-50 rounded-lg">
                            <h2 className="text-2xl font-bold text-blue-800 mb-2">Ready to Play?</h2>
                            <p className="text-gray-600 mb-6">Click words on the left to practice. Click start when you're ready to find them!</p>
                            <button onClick={handleStart} className="bg-blue-600 text-white font-bold py-3 px-8 text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-md transform hover:scale-105">
                                Start
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full max-w-md aspect-square bg-yellow-50 p-2 rounded-lg shadow-inner">
                    <div className="grid grid-cols-10 gap-1">
                        {puzzleData.grid.map((row, r) =>
                            row.map((letter, c) => {
                              const isFound = isCellInFoundWord(r, c);
                              const isShown = shownWordCells.has(`${r}-${c}`);
                              return (
                                <button
                                    key={`${r}-${c}`}
                                    onClick={() => handleCellClick(r, c)}
                                    className={`w-full aspect-square flex items-center justify-center text-xl sm:text-2xl font-bold font-mono uppercase rounded-md transition-all duration-300 transform 
                                    ${ isFound ? 'bg-green-400 text-white scale-105 shadow-md' 
                                    : isShown ? 'bg-yellow-400 text-black scale-105 shadow-md ring-2 ring-yellow-500'
                                    : 'bg-white hover:bg-yellow-200'}`}
                                >
                                    {letter}
                                </button>
                              );
                            })
                        )}
                    </div>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WordSearchPuzzle;