import React, { useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { BookOpen, Volume2, LoaderCircle } from './icons';

type PhonicItem = {
  pattern: string;
  sound: string;
  name: string;
  examples: string[];
};

const VowelPhonicChart = () => {
  const [selectedVowel, setSelectedVowel] = useState('A');
  const { speak, isSpeaking, error } = useAudioPlayer();
  const [speakingItem, setSpeakingItem] = useState<string | null>(null);

  const vowelData: Record<string, PhonicItem[]> = {
    A: [
      { pattern: 'a', sound: '/æ/', name: 'Short A', examples: ['cat', 'bag', 'jam', 'flag', 'back', 'map', 'hat', 'glad'] },
      { pattern: 'a-e', sound: '/eɪ/', name: 'Long A with magic e', examples: ['cake', 'name', 'same', 'make', 'game', 'take', 'late', 'safe'] },
      { pattern: 'ai', sound: '/eɪ/', name: 'Long A', examples: ['rain', 'train', 'pain', 'gain', 'mail', 'tail', 'sail', 'snail'] },
      { pattern: 'ay', sound: '/eɪ/', name: 'Long A', examples: ['day', 'play', 'stay', 'tray', 'say', 'may', 'way', 'gray'] },
      { pattern: 'ar', sound: '/ɑr/', name: 'AR sound', examples: ['car', 'far', 'jar', 'star', 'dark', 'farm', 'park', 'start'] },
      { pattern: 'are', sound: '/ɛr/', name: 'AIR sound', examples: ['care', 'share', 'dare', 'flare', 'rare', 'bare', 'scare', 'stare'] },
      { pattern: 'al/all', sound: '/ɔl/', name: 'ALL sound', examples: ['ball', 'call', 'fall', 'wall', 'tall', 'small', 'hall', 'talk'] },
      { pattern: 'aw', sound: '/ɔ/', name: 'AW sound', examples: ['saw', 'law', 'paw', 'draw', 'raw', 'jaw', 'straw', 'claw'] },
      { pattern: 'au', sound: '/ɔ/', name: 'AU sound', examples: ['cause', 'fault', 'haul', 'pause', 'sauce', 'launch', 'taught', 'caught'] },
      { pattern: 'wa', sound: '/ɑ/ or /wɑ/', name: 'WA sound', examples: ['want', 'wash', 'watch', 'wasp', 'wallet', 'wander', 'swap', 'swat'] }
    ],
    E: [
      { pattern: 'e', sound: '/ɛ/', name: 'Short E', examples: ['bed', 'red', 'pen', 'ten', 'leg', 'get', 'wet', 'set'] },
      { pattern: 'e-e', sound: '/iː/', name: 'Long E with magic e', examples: ['these', 'theme', 'complete', 'Pete', 'Gene', 'eve', 'here', 'mere'] },
      { pattern: 'ee', sound: '/iː/', name: 'Long E', examples: ['see', 'bee', 'tree', 'free', 'three', 'green', 'sleep', 'sweet'] },
      { pattern: 'ea', sound: '/iː/', name: 'Long E', examples: ['read', 'sea', 'team', 'bean', 'leaf', 'eat', 'seat', 'mean'] },
      { pattern: 'ea', sound: '/ɛ/', name: 'Short E sound', examples: ['bread', 'head', 'dead', 'read (past tense)', 'ready', 'heavy', 'meant', 'thread'] },
      { pattern: 'ey/y', sound: '/iː/', name: 'Long E', examples: ['key', 'monkey', 'happy', 'baby', 'funny', 'sunny', 'money', 'honey'] },
      { pattern: 'er', sound: '/ɜr/', name: 'ER sound', examples: ['her', 'fern', 'term', 'verb', 'herd', 'clerk', 'serve', 'nerve'] },
      { pattern: 'ear', sound: '/ɪr/', name: 'EAR sound', examples: ['ear', 'hear', 'near', 'dear', 'fear', 'tear', 'clear', 'year'] },
      { pattern: 'ear', sound: '/ɛr/', name: 'AIR sound', examples: ['bear', 'wear', 'pear', 'tear (as in rip)', 'swear'] }
    ],
    I: [
      { pattern: 'i', sound: '/ɪ/', name: 'Short I', examples: ['sit', 'bit', 'hit', 'fin', 'pin', 'win', 'big', 'pig'] },
      { pattern: 'i-e', sound: '/aɪ/', name: 'Long I with magic e', examples: ['bike', 'like', 'time', 'five', 'nice', 'ride', 'side', 'smile'] },
      { pattern: 'igh', sound: '/aɪ/', name: 'Long I', examples: ['high', 'night', 'light', 'right', 'sight', 'fight', 'bright', 'flight'] },
      { pattern: 'y', sound: '/aɪ/', name: 'Long I', examples: ['my', 'by', 'fly', 'try', 'sky', 'cry', 'dry', 'shy'] },
      { pattern: 'ie', sound: '/aɪ/', name: 'Long I', examples: ['pie', 'tie', 'lie', 'die', 'cries', 'flies', 'dried', 'tried'] },
      { pattern: 'ind/ild', sound: '/aɪ/', name: 'Long I', examples: ['kind', 'mind', 'find', 'child', 'wild', 'mild', 'blind', 'behind'] },
      { pattern: 'ir', sound: '/ɜr/', name: 'IR sound', examples: ['bird', 'girl', 'first', 'shirt', 'stir', 'dirt', 'third', 'birth'] }
    ],
    O: [
      { pattern: 'o', sound: '/ɑ/ or /ɒ/', name: 'Short O', examples: ['hot', 'not', 'pot', 'dot', 'box', 'fox', 'dog', 'log'] },
      { pattern: 'o-e', sound: '/oʊ/', name: 'Long O with magic e', examples: ['home', 'bone', 'cone', 'rope', 'hope', 'nose', 'hole', 'stone'] },
      { pattern: 'oa', sound: '/oʊ/', name: 'Long O', examples: ['boat', 'coat', 'goat', 'road', 'load', 'soap', 'toast', 'float'] },
      { pattern: 'ow', sound: '/oʊ/', name: 'Long O', examples: ['bow (as in bow and arrow)', 'low', 'mow', 'row', 'snow', 'show', 'slow', 'grow'] },
      { pattern: 'ow', sound: '/aʊ/', name: 'OW sound', examples: ['cow', 'now', 'how', 'brown', 'down', 'town', 'crown', 'clown'] },
      { pattern: 'oo', sound: '/uː/', name: 'Long OO', examples: ['moon', 'soon', 'food', 'pool', 'cool', 'zoo', 'boot', 'tooth'] },
      { pattern: 'oo', sound: '/ʊ/', name: 'Short OO', examples: ['book', 'look', 'cook', 'good', 'wood', 'foot', 'hook', 'took'] },
      { pattern: 'oi/oy', sound: '/ɔɪ/', name: 'OY sound', examples: ['boy', 'toy', 'joy', 'coin', 'oil', 'soil', 'boil', 'point'] },
      { pattern: 'or', sound: '/ɔr/', name: 'OR sound', examples: ['for', 'or', 'corn', 'born', 'fork', 'storm', 'short', 'sport'] },
      { pattern: 'ou', sound: '/aʊ/', name: 'OU sound', examples: ['out', 'loud', 'house', 'mouse', 'round', 'found', 'ground', 'cloud'] }
    ],
    U: [
      { pattern: 'u', sound: '/ʌ/', name: 'Short U', examples: ['cup', 'sun', 'run', 'fun', 'but', 'cut', 'mud', 'bug'] },
      { pattern: 'u-e', sound: '/juː/ or /uː/', name: 'Long U with magic e', examples: ['cute', 'use', 'huge', 'tube', 'rule', 'rude', 'June', 'tune'] },
      { pattern: 'ue', sound: '/uː/', name: 'Long U', examples: ['blue', 'true', 'glue', 'clue', 'due', 'sue', 'rescue', 'value'] },
      { pattern: 'ui', sound: '/uː/', name: 'Long U', examples: ['fruit', 'juice', 'suit', 'cruise', 'bruise'] },
      { pattern: 'ew', sound: '/uː/ or /juː/', name: 'Long U', examples: ['new', 'few', 'dew', 'grew', 'flew', 'drew', 'threw', 'chew'] },
      { pattern: 'u', sound: '/ʊ/', name: 'Short OO sound', examples: ['put', 'push', 'pull', 'full', 'bull', 'bush'] },
      { pattern: 'ur', sound: '/ɜr/', name: 'UR sound', examples: ['fur', 'burn', 'turn', 'hurt', 'curl', 'purse', 'nurse', 'church'] }
    ]
  };
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  
  const handleSpeak = (text: string, identifier: string) => {
    setSpeakingItem(identifier);
    speak(text).finally(() => setSpeakingItem(null));
  };

  return (
    <div className="mx-auto">
        <nav className="flex justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
          {vowels.map(vowel => (
            <button
              key={vowel}
              onClick={() => setSelectedVowel(vowel)}
              disabled={isSpeaking}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full text-2xl font-bold transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedVowel === vowel
                  ? 'bg-blue-600 text-white shadow-lg scale-110'
                  : 'bg-white text-gray-700 hover:bg-blue-100 shadow'
              }`}
            >
              {vowel}
            </button>
          ))}
        </nav>

        <main>
          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
              <p className="font-bold">Audio Error</p>
              <p>{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vowelData[selectedVowel].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <button 
                      onClick={() => handleSpeak(item.name, item.pattern)} 
                      disabled={isSpeaking}
                      className="flex items-center gap-2 text-left group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-1 -m-1"
                    >
                      <span className="text-4xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{item.pattern}</span>
                      {speakingItem === item.pattern ? 
                        <LoaderCircle className="w-6 h-6 text-blue-500 animate-spin" /> :
                        <Volume2 className="w-6 h-6 text-blue-400 group-hover:text-blue-600 transition-colors" />
                      }
                    </button>
                    <div className="text-sm text-gray-500 mt-1 ml-1">{item.sound}</div>
                  </div>
                  <div className="bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap text-center">
                    <span className="text-xs font-semibold text-blue-700">{item.name}</span>
                  </div>
                </div>
                
                <div className="flex-grow flex flex-wrap gap-2 content-start">
                  {item.examples.map((word, wordIdx) => {
                    const handleWordClick = () => {
                      // Remove any parenthetical explanations before spelling
                      const wordToSpell = word.replace(/\s*\(.*\)\s*/, '').trim();
                      const spelling = wordToSpell.split('').map(char => char.toUpperCase()).join('. ');
                      const prompt = `${word}. ${spelling}. ${word}. ${spelling}.`;
                      handleSpeak(prompt, word);
                    };

                    return (
                      <button
                        key={wordIdx}
                        onClick={handleWordClick}
                        disabled={isSpeaking}
                        className="relative bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-800 hover:scale-105 hover:shadow-md transition-transform transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                      >
                        {word}
                        {speakingItem === word && <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800">Tip for Learning:</p>
              <p className="text-sm text-yellow-700">
                Click the sound icon next to a letter pattern or click any word to hear it spoken out loud. Practice saying them too!
              </p>
            </div>
          </div>
        </footer>
    </div>
  );
};

export default VowelPhonicChart;
