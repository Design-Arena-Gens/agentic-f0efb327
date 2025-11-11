'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('Anime style young man fixing a red motorcycle in a sunny street, detailed background, consistent character design, cinematic lighting');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [predictionId, setPredictionId] = useState('');
  const [status, setStatus] = useState('');

  const generateVideo = async () => {
    setLoading(true);
    setError('');
    setVideoUrl('');
    setStatus('Starting video generation...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setPredictionId(data.id);
      setStatus('Processing... This may take 1-2 minutes');

      // Poll for results
      pollPrediction(data.id);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const pollPrediction = async (id: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/prediction/${id}`);
        const data = await response.json();

        if (data.status === 'succeeded') {
          setVideoUrl(data.output);
          setStatus('Video generated successfully!');
          setLoading(false);
        } else if (data.status === 'failed') {
          setError('Video generation failed');
          setLoading(false);
        } else {
          setStatus(`Status: ${data.status}...`);
          setTimeout(checkStatus, 2000);
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    checkStatus();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          🎬 AI Video Generator
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-white text-lg font-semibold mb-3">
              Video Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
              placeholder="Describe the video you want to generate..."
            />
          </div>

          <button
            onClick={generateVideo}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
          >
            {loading ? '⏳ Generating...' : '🎥 Generate Video'}
          </button>

          {status && (
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-white text-center">{status}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {videoUrl && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated Video</h2>
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <a
                href={videoUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 text-center transition-all"
              >
                📥 Download Video
              </a>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/70 text-sm">
          <p>Powered by AI • Video generation may take 1-2 minutes</p>
        </div>
      </div>
    </main>
  );
}
