import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-16">
          <Link to="/" className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-purple-300" />
            <span className="text-2xl font-bold text-white">Team Intra</span>
          </Link>
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-purple-200 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-white mb-6">
        Monetize Your Content Like Never Before
      </h1>
      <p className="text-purple-200 text-xl mb-8 max-w-2xl mx-auto">
        Join thousands of content creators who are building successful businesses
        with Team Intra's all-in-one platform.
      </p>
      <Link
        to="/register"
        className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-full font-semibold transition duration-300"
      >
        Start Your Journey
      </Link>
    </div>
  );
}

export default App;