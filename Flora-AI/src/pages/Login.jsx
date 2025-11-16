import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, LogIn } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Google login failed: " + error.message);
    } 
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/dashboard');
  } catch (error) {
    console.error(error);
    alert('Login failed: ' + error.message);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-offWhite via-lightMoss to-sand flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <Leaf className="absolute top-20 left-10 w-32 h-32 text-sage rotate-12" />
        <Leaf className="absolute bottom-32 right-20 w-40 h-40 text-olive -rotate-45" />
        <Leaf className="absolute top-1/2 left-1/4 w-24 h-24 text-sage rotate-90" />
        <Leaf className="absolute bottom-20 left-1/3 w-28 h-28 text-olive -rotate-12" />
      </div>
      {/* Login Card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-sage to-olive rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="w-10 h-10 text-white" />
          </div>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-darkForest text-center mb-2">
          Welcome to Flora A.I
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to monitor your plants
        </p>
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-oliveMist focus:border-oliveMist autofill:bg-white autofill:text-gray-900"
                required
              />
            </div>
          </div>
          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-oliveMist focus:border-oliveMist"
                required
              />
            </div>
          </div>
          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sage to-olive text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </form>
        {/* Create Account Link */}
        <div className="text-center mt-6">
          <Link
            to="/signup"
            className="text-olive hover:text-darkForest font-medium transition-colors"
          >
            Create Account
          </Link>
        </div>
        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        {/* Continue with Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-sage transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  )
}

export default Login;