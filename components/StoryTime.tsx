import React, { useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { generateStory } from '../services/geminiService';
import { LoaderCircle, Storybook, Volume2 } from './icons';

const StoryTime = () => {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { speak, stop, isSpeaking, error: audioError } = useAudioPlayer();

  const handleGenerateStory = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setStory('');
    stop(); // Stop any previous speech

    try {
      const generatedStory = await generateStory(prompt);
      setStory(generatedStory);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadStory = () => {
    if (isSpeaking) {
      stop();
    } else if (story) {
      speak(story);
    }
  };
  
  const storyParagraphs = story.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <Storybook className="w-12 h-12 text-purple-500 mx-auto mb-2" />
        <h2 className="text-3xl font-bold text-gray-800">Story Time!</h2>
        <p className="text-gray-600 mt-1">Let's create a wonderful story together.</p>
      </div>

      <div className="space-y-4">
        <label htmlFor="story-prompt" className="block text-lg font-semibold text-gray-700">
          What should the story be about?
        </label>
        <textarea
          id="story-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A friendly dinosaur who loves to bake cookies"
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleGenerateStory}
          disabled={isLoading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors shadow-md disabled:bg-purple-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="w-6 h-6 animate-spin" />
              Dreaming up a story...
            </>
          ) : (
            'Create My Story!'
          )}
        </button>
      </div>
      
      {(error || audioError) && (
        <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Oh no, a story snag!</p>
          <p>{error || audioError}</p>
        </div>
      )}

      {story && !isLoading && (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Your Adventure</h3>
                <button 
                    onClick={handleReadStory}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-purple-100 text-purple-700 hover:bg-purple-200"
                >
                    <Volume2 className="w-5 h-5" />
                    {isSpeaking ? 'Stop Reading' : 'Read to Me'}
                </button>
            </div>
          <div className="text-lg text-gray-700 leading-relaxed space-y-4">
            {storyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryTime;
