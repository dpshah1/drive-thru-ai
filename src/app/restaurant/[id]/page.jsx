"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { supabase } from "../../../lib/supabaseClient";

export default function RestaurantVapiPage() {
    const params = useParams();
    const restaurantId = params.id;
    
    const [vapi, setVapi] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
    const [restaurantData, setRestaurantData] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    // Fetch restaurant and menu data
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setDataLoading(true);
                
                // Fetch restaurant info
                const { data: restaurant, error: restaurantError } = await supabase
                    .from('restaurants')
                    .select('*')
                    .eq('id', restaurantId)
                    .single();

                if (restaurantError) {
                    console.error('Error fetching restaurant:', restaurantError);
                    addMessage(`Error: Restaurant not found`);
                    return;
                }

                // Fetch menu items for this restaurant
                const { data: items, error: itemsError } = await supabase
                    .from('menu_items')
                    .select('*')
                    .eq('restaurant_id', restaurantId);

                if (itemsError) {
                    console.error('Error fetching menu items:', itemsError);
                    addMessage(`Error: Could not load menu items`);
                    return;
                }

                setRestaurantData(restaurant);
                setMenuItems(items);
                addMessage(`Loaded ${restaurant.name} menu with ${items.length} items`);
                
            } catch (error) {
                console.error('Error:', error);
                addMessage(`Error loading restaurant data: ${error.message}`);
            } finally {
                setDataLoading(false);
            }
        };

        if (restaurantId) {
            fetchRestaurantData();
        }
    }, [restaurantId]);

    // VAPI Configuration with restaurant-specific context
    const createAssistant = () => {
        if (!restaurantData || !menuItems.length) {
            return null;
        }

        const menuContext = menuItems.map(item => 
            `${item.item}: ${item.info || 'No nutritional information available'}`
        ).join('\n');

        return {
            name: `${restaurantData.name} Nutritional Assistant`,
            model: {
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful nutritional assistant for ${restaurantData.name} restaurant located at ${restaurantData.location}. 
                        
You have access to the following menu items and their nutritional information:

${menuContext}

Your job is to answer questions about the nutritional content of menu items. Be helpful and accurate. If you don't have specific nutritional information for an item, let the customer know that you don't have that data available.

Keep responses conversational and brief. Focus on answering nutritional questions like calories, ingredients, allergens, etc.

If someone asks about an item not on the menu, politely let them know it's not available at this location.`
                    }
                ]
            },
            voice: {
                provider: "playht",
                voiceId: "jennifer"
            }
        };
    };

    useEffect(() => {
        const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPIAI_API_KEY);
        setVapi(vapiInstance);

        // Event listeners
        vapiInstance.on("call-start", () => {
            setIsConnected(true);
            setIsLoading(false);
            addMessage("Nutritional assistant connected. Ask me about menu items!");
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
        if (!vapi || !restaurantData || !menuItems.length) {
            addMessage("Error: Restaurant data not loaded yet");
            return;
        }
        
        setIsLoading(true);
        try {
            const assistant = createAssistant();
            if (assistant) {
                await vapi.start(assistant);
            }
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

    if (dataLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading restaurant data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurantData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-600 mb-4">Restaurant Not Found</h1>
                            <p className="text-gray-600">The restaurant with ID {restaurantId} could not be found.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                            {restaurantData.name} - Nutritional Assistant
                        </h1>
                        <p className="text-gray-600 text-center mb-4">
                            {restaurantData.location} • {menuItems.length} menu items available
                        </p>
                    </div>
                    
                    <div className="mb-6 text-center">
                        <p className="text-gray-600 mb-4">
                            Ask me about nutritional information for any menu item!
                        </p>
                        
                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                onClick={startCall}
                                disabled={isConnected || isLoading || !restaurantData}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    isConnected || isLoading || !restaurantData
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                            >
                                {isLoading ? "Connecting..." : "Start Nutritional Chat"}
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
                                End Chat
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
                                <p className="text-gray-500 text-center">No messages yet. Start a chat to ask about nutritional information!</p>
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
                            <li>• Click "Start Nutritional Chat" to connect to the voice assistant</li>
                            <li>• Allow microphone access when prompted</li>
                            <li>• Ask questions like "How many calories in a Big Mac?" or "What ingredients are in the chicken sandwich?"</li>
                            <li>• The assistant will respond with voice and text</li>
                            <li>• Click "End Chat" when you're done</li>
                        </ul>
                    </div>

                    {/* Menu Items Preview */}
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">Available Menu Items:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-green-800">
                            {menuItems.slice(0, 12).map((item, index) => (
                                <div key={index} className="truncate">• {item.item}</div>
                            ))}
                            {menuItems.length > 12 && (
                                <div className="text-green-600">...and {menuItems.length - 12} more items</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

