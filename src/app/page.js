'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const fullText = "Meet Presto.";

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    
    const typewriterEffect = () => {
      if (!isDeleting && index < fullText.length) {
        // Typing forward
        setDisplayText(fullText.slice(0, index + 1));
        index++;
        setTimeout(typewriterEffect, 150);
      } else if (!isDeleting && index === fullText.length) {
        // Pause at end
        setIsTypingComplete(true);
        setTimeout(() => {
          isDeleting = true;
          setIsTypingComplete(false);
          typewriterEffect();
        }, 2000); // Pause for 2 seconds
      } else if (isDeleting && index > 0) {
        // Deleting backward
        setDisplayText(fullText.slice(0, index - 1));
        index--;
        setTimeout(typewriterEffect, 100);
      } else if (isDeleting && index === 0) {
        // Start over
        isDeleting = false;
        setTimeout(typewriterEffect, 500); // Brief pause before restarting
      }
    };

    typewriterEffect();
  }, []);

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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center" style={{ backgroundImage: 'url(/image.png)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 min-h-[1.2em]">
              {displayText.length > 0 && (
                <span className={displayText.startsWith('P') ? 'text-white' : 'text-white'}>
                  {displayText.charAt(0)}
                </span>
              )}
              <span className="text-white">{displayText.substring(1)}</span>
              {!isTypingComplete && (
                <span className="animate-pulse text-white">|</span>
              )}
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              Free your team from repetitive order-taking so they can focus on food quality, customer experience, and growing your business. AI handles the routine questions while your staff creates memorable moments!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/add-store"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Transform Your Customer Service
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="border-2 border-gray-300 hover:border-gray-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center gap-2"
                >
                  See How It Works
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <Link 
                      href="/restaurant/1"
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 first:rounded-t-lg"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="font-medium">El Pollo Loco</div>
                      <div className="text-sm text-gray-500">Try AI ordering for chicken favorites</div>
                    </Link>
                    <Link 
                      href="/restaurant/2"
                      className="block px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 last:rounded-b-lg"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="font-medium">In-N-Out</div>
                      <div className="text-sm text-gray-500">Experience AI alongside classic burgers</div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Service Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionize Your Customer Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI that understands your menu inside and out, providing instant answers and personalized recommendations 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Answers</h3>
              <p className="text-gray-600 text-sm">Customers can ask any question about your menu and get immediate, accurate responses.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dietary Guidance</h3>
              <p className="text-gray-600 text-sm">AI recommends options for gluten-free, vegan, low-carb, and other dietary needs.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Allergen Safety</h3>
              <p className="text-gray-600 text-sm">Instant allergen information and safe alternatives for customers with food allergies.</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Faster Orders</h3>
              <p className="text-gray-600 text-sm">No waiting for staff. AI handles orders instantly, reducing wait times and increasing throughput.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How AI Customer Service Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your menu into an intelligent ordering system in just 3 simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Menu</h3>
              <p className="text-gray-600">
                Upload your nutrition guide PDF. Our AI instantly learns your entire menu, including ingredients, allergens, and nutrition facts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Learns Everything</h3>
              <p className="text-gray-600">
                AI analyzes your menu and can answer any question about ingredients, allergens, nutrition, pricing, and make personalized recommendations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customers Order Instantly</h3>
              <p className="text-gray-600">
                Customers can ask questions, get recommendations, and place orders without waiting for staff. Perfect for drive-thru, phone, or online ordering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Scenarios Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Customer Interactions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how AI handles the most common customer questions and requests.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600"><strong>Customer:</strong> "I'm gluten-free. What can I eat?"</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-700"><strong>AI:</strong> "I recommend our grilled chicken salad, quinoa bowl, or gluten-free burger bun option. All are certified gluten-free."</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergen Information</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600"><strong>Customer:</strong> "Does the chocolate shake have nuts?"</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-700"><strong>AI:</strong> "Our chocolate shake contains dairy but no nuts. However, it's prepared in a kitchen that handles tree nuts. Would you like our dairy-free smoothie instead?"</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Questions</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600"><strong>Customer:</strong> "What's the healthiest option under 500 calories?"</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-700"><strong>AI:</strong> "I recommend our grilled chicken salad (320 cal) or quinoa bowl (450 cal). Both are high in protein and fiber."</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ordering & Recommendations</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600"><strong>Customer:</strong> "I want something spicy and filling"</p>
                </div>
                <div className="bg-blue-50 p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-700"><strong>AI:</strong> "Try our spicy chicken burrito with extra jalapeños! It's our most popular spicy item and very filling. Would you like to add a side of chips?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Business Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enhance employee efficiency, increase order accuracy, and improve customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Menu</h3>
              <p className="text-gray-600">
                Upload your nutrition guide PDF. Our AI instantly learns your entire menu, including ingredients, allergens, and nutrition facts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Learns Everything</h3>
              <p className="text-gray-600">
                AI analyzes your menu and can answer any question about ingredients, allergens, nutrition, pricing, and make personalized recommendations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customers Order Instantly</h3>
              <p className="text-gray-600">
                Customers can ask questions, get recommendations, and place orders without waiting for staff. Perfect for drive-thru, phone, or online ordering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl mb-8">
            Join the growing number of restaurants using AI to enhance customer service and streamline operations.
          </p>
          <Link 
            href="/add-store"
            className="bg-white text-blue-700 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Presto AI.</p>
        </div>
      </footer>
    </div>
  );
}