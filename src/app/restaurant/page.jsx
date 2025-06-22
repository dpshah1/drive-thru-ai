'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug environment variables
      console.log('Environment check:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
      });
      
      console.log('Supabase client:', supabase);
      console.log('Fetching restaurants...');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, location')
        .order('name');

      console.log('Supabase response:', { 
        data, 
        error,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : 'no error',
        dataType: typeof data,
        dataLength: data?.length
      });

      if (error) {
        console.error('Error fetching restaurants:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(error.message || 'Failed to fetch restaurants');
        return;
      }

      setRestaurants(data || []);
      console.log('Restaurants loaded:', data);
    } catch (error) {
      console.error('Exception fetching restaurants:', error);
      console.error('Exception details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = (restaurantId) => {
    if (restaurantId) {
      router.push(`/restaurant/${restaurantId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Restaurants</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchRestaurants}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                href="/add-store" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add Restaurant
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select a Restaurant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a restaurant to interact with their AI customer service agent and explore their menu.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          {restaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Restaurants Found</h3>
              <p className="text-gray-600 mb-6">
                There are no restaurants in the database yet. Add your first restaurant to get started.
              </p>
              <a 
                href="/add-store"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Restaurant
              </a>
            </div>
          ) : (
            <div>
              <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Restaurant
              </label>
              <select
                id="restaurant-select"
                value={selectedRestaurant}
                onChange={(e) => {
                  setSelectedRestaurant(e.target.value);
                  handleRestaurantSelect(e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              >
                <option value="">Select a restaurant...</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} - {restaurant.location}
                  </option>
                ))}
              </select>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Select a restaurant above to interact with their AI customer service agent
                </p>
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Quick Demo Access</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <a 
                    href="/restaurant/1"
                    className="block p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
                  >
                    <div className="font-medium text-blue-900">El Pollo Loco</div>
                    <div className="text-sm text-blue-700">Try AI ordering for chicken favorites</div>
                  </a>
                  <a 
                    href="/restaurant/2"
                    className="block p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200"
                  >
                    <div className="font-medium text-green-900">In-N-Out</div>
                    <div className="text-sm text-green-700">Experience AI alongside classic burgers</div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ask Any Question</h3>
            <p className="text-gray-600 text-sm">Get instant answers about menu items, ingredients, and nutrition facts.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Dietary Guidance</h3>
            <p className="text-gray-600 text-sm">Find options for gluten-free, vegan, and other dietary restrictions.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Allergen Safety</h3>
            <p className="text-gray-600 text-sm">Get instant allergen information and safe alternatives.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
