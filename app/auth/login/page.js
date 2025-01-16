'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [theme, setTheme] = useState("light");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        // Set cookie (ensure Secure and SameSite in production)
        document.cookie = `token=${data.token}; path=/; SameSite=Lax`;
        
        // Refresh user state
        refreshUser();

        // Navigate to dashboard
        router.push('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-foreground">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-8 shadow-md">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium dark:text-white">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              aria-label="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium dark:text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
              aria-label="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-4 text-center">
          <p className="text-sm dark:text-gray-300">
            Don't have an account?{" "}
            <Link href="/auth/register">
              <span className="text-blue-500 hover:underline dark:text-blue-400">
                Sign up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
