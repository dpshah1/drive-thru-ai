"use client";

import React, { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";

export default function VapiPage() {
    const [vapi, setVapi] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);

    // VAPI Configuration
    
    // Simple assistant configuration
    const assistant = {
        name: "Drive Thru Assistant",
        model: {
            provider: "openai",
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful drive-thru assistant. Keep responses brief and conversational."
                }
            ]
        },
        voice: {
            provider: "playht",
            voiceId: "jennifer"
        }
    };

    useEffect(() => {
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPIAI_API_KEY);
        setVapi(vapiInstance);

        // Event listeners
        vapiInstance.on("call-start", () => {
            setIsConnected(true);
            setIsLoading(false);
            addMessage("Assistant connected. You can start speaking!");
        });

        vapiInstance.on("call-end", () => {
            setIsConnected(false);
            setIsLoading(false);
            addMessage("Call ended.");
        });

        vapiInstance.on("speech-start", () => {
            setAssistantIsSpeaking(true);
        });

        vapiInstance.on("speech-end", () => {
            setAssistantIsSpeaking(false);
        });

        vapiInstance.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                if (message.role === "user") {
                    addMessage(`You: ${message.transcript}`);
                } else if (message.role === "assistant") {
                    addMessage(`Assistant: ${message.transcript}`);
                }
            }
        });

        vapiInstance.on("error", (error) => {
            console.error("VAPI Error:", error);
            addMessage(`Error: ${error.message || "Something went wrong"}`);
            setIsLoading(false);
        });

        return () => {
            if (vapiInstance) {
                vapiInstance.stop();
            }
        };
    }, []);

    const addMessage = (message) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: message,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const startCall = async () => {
        if (!vapi) return;
        
        setIsLoading(true);
        try {
            await vapi.start(assistant);
        } catch (error) {
            console.error("Failed to start call:", error);
            addMessage(`Failed to start call: ${error.message}`);
            setIsLoading(false);
        }
    };

    const endCall = () => {
        if (vapi && isConnected) {
            vapi.stop();
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Navigation */}
            <nav className="bg-blue-900 text-white border-b border-blue-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a 
                                href="/restaurant" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                View Restaurants
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            VAPI Voice Assistant
                        </h1>
                        
                        <div className="mb-6 text-center">
                            <p className="text-gray-600 mb-4">
                                Click "Start Call" to begin talking with the AI assistant
                            </p>
                            
                            <div className="flex justify-center gap-4 mb-4">
                                <button
                                    onClick={startCall}
                                    disabled={isConnected || isLoading}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        isConnected || isLoading
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                >
                                    {isLoading ? "Connecting..." : "Start Call"}
                                </button>
                                
                                <button
                                    onClick={endCall}
                                    disabled={!isConnected}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        !isConnected
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-red-500 text-white hover:bg-red-600"
                                    }`}
                                >
                                    End Call
                                </button>
                                
                                <button
                                    onClick={clearMessages}
                                    className="px-6 py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                >
                                    Clear Chat
                                </button>
                            </div>
                            
                            <div className="flex justify-center items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${
                                    isConnected ? "bg-green-500" : "bg-red-500"
                                }`}></div>
                                <span className="text-sm text-gray-600">
                                    {isConnected ? "Connected" : "Disconnected"}
                                </span>
                                
                                {assistantIsSpeaking && (
                                    <>
                                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                        <span className="text-sm text-blue-600">Assistant is speaking...</span>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversation</h2>
                            
                            <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <p className="text-gray-500 text-center">No messages yet. Start a call to begin chatting!</p>
                                ) : (
                                    <div className="space-y-3">
                                        {messages.map((message) => (
                                            <div key={message.id} className="bg-white rounded-lg p-3 shadow-sm">
                                                <p className="text-gray-900">{message.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Click "Start Call" to connect to the voice assistant</li>
                                <li>• Allow microphone access when prompted</li>
                                <li>• Speak naturally - the assistant will respond with voice</li>
                                <li>• Click "End Call" to disconnect</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

