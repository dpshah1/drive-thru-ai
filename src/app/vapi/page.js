'use client';

import { useState } from 'react';

export default function VapiPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState('Ready to start call');

  const handleCallToggle = () => {
    if (isCallActive) {
      // End call logic
      setIsCallActive(false);
      setCallStatus('Call ended');
      setTimeout(() => setCallStatus('Ready to start call'), 2000);
    } else {
      // Start call logic
      setIsCallActive(true);
      setCallStatus('Connecting...');
      setTimeout(() => setCallStatus('Call active'), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="text-2xl font-bold text-red-600">server.ai</div>
        <div className="flex items-center gap-6">
          <a href="/" className="text-gray-600 hover:text-gray-800 transition-colors">Home</a>
          <button className="text-gray-600 hover:text-gray-800 transition-colors">About</button>
          <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-medium">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Vapi Voice Assistant
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Experience AI-powered voice interactions with our advanced voice assistant
          </p>
        </div>

        {/* Call interface */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12">
            {/* Status indicator */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isCallActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium">{callStatus}</span>
              </div>
            </div>

            {/* Call button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleCallToggle}
                className={`relative w-32 h-32 rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isCallActive 
                    ? 'bg-red-600 hover:bg-red-700 shadow-xl' 
                    : 'bg-green-600 hover:bg-green-700 shadow-lg'
                }`}
              >
                {isCallActive ? (
                  <svg className="w-12 h-12 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Call controls */}
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                {isCallActive ? 'Tap to end call' : 'Tap to start voice assistant'}
              </p>
              <p className="text-sm text-gray-500">
                Powered by Vapi AI technology
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <p className="text-sm font-medium text-gray-700">Natural Voice</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
              </div>
              <p className="text-sm font-medium text-gray-700">Real-time AI</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <p className="text-sm font-medium text-gray-700">Smart Context</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}