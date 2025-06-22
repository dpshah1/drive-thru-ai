export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean header with minimal nav */}
      <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="text-2xl font-bold text-red-600">server.ai</div>
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-800 transition-colors">About</button>
          <button className="text-gray-600 hover:text-gray-800 transition-colors">Contact</button>
          <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-medium">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main content with Pinterest-like clean layout */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-none">
            server.ai
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Beautiful, intelligent server solutions that just work
          </p>
        </div>

        {/* Clean grid layout inspired by Pinterest */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-red-600 rounded"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Deployment</h3>
            <p className="text-gray-600 leading-relaxed">Effortless server management with AI-powered optimization</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Auto Scaling</h3>
            <p className="text-gray-600 leading-relaxed">Dynamic resource allocation that adapts to your needs</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Downtime</h3>
            <p className="text-gray-600 leading-relaxed">Reliable infrastructure with 99.99% uptime guarantee</p>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <button className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl">
            Start Your Journey
          </button>
        </div>
      </main>
    </div>
  );
}
