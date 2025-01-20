"use client";

import { useState } from "react";
import { Activity, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-[rgb(var(--background))] rounded-lg shadow-xl p-8 w-full max-w-md transform transition-all hover:scale-105 duration-300">
        <div className="flex flex-col items-center mb-6">
          <Activity className="w-16 h-16 text-[rgb(var(--accent))] mb-4" />
          <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">
            Activity
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-[rgb(var(--secondary))] rounded-md focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[rgb(var(--secondary))] rounded-md focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Log In
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="border-t border-gray-300 flex-grow mr-3"></div>
          <span className="text-gray-500 font-medium">OR</span>
          <div className="border-t border-gray-300 flex-grow ml-3"></div>
        </div>

        <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out">
          <Apple className="mr-2" />
          Log in with Facebook
        </Button>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?
            <a href="#" className="text-blue-500 hover:underline ml-1">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
