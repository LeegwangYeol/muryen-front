"use client";

import { useState } from "react";
import { Activity, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "../context/theme-context";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("로그인에 실패했습니다.");
      }

      const data = await response.json();

      // URL 파라미터에서 리다이렉트 URL 가져오기
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/";

      // 리다이렉트
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Login error:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ml-24 ${
        theme === "dark"
          ? "bg-[rgb(var(--background))]"
          : "bg-[rgb(var(--background))]"
      }`}
    >
      <div
        className={`${
          theme === "dark" ? "glassmorphism-dark" : "glassmorphism-light"
        } rounded-lg p-8 w-full max-w-md transform transition-all hover:scale-105 duration-300`}
      >
        <div className="flex flex-col items-center mb-6">
          <Activity className="w-16 h-16 text-[rgb(var(--accent))] mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">
            무련
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[rgb(var(--background))] border-[rgb(var(--secondary))] text-[rgb(var(--foreground))]"
                  : "bg-white border-[rgb(var(--secondary))] text-[rgb(var(--foreground))]"
              } focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent`}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md transition-all duration-300 ${
                theme === "dark"
                  ? "bg-[rgb(var(--background))] border-[rgb(var(--secondary))] text-[rgb(var(--foreground))]"
                  : "bg-white border-[rgb(var(--secondary))] text-[rgb(var(--foreground))]"
              } focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent`}
            />
          </div>
          <Button
            type="submit"
            className={`w-full font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
              theme === "dark"
                ? "bg-[rgb(var(--accent))] text-white hover:bg-[rgb(var(--accent))/90]"
                : "bg-[rgb(var(--accent))] text-white hover:bg-[rgb(var(--accent))/90]"
            }`}
          >
            로그인
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div
            className={`border-t flex-grow mr-3 ${
              theme === "dark"
                ? "border-[rgb(var(--secondary))]"
                : "border-[rgb(var(--secondary))]"
            }`}
          ></div>
          <span className="text-[rgb(var(--secondary))] font-medium">또는</span>
          <div
            className={`border-t flex-grow ml-3 ${
              theme === "dark"
                ? "border-[rgb(var(--secondary))]"
                : "border-[rgb(var(--secondary))]"
            }`}
          ></div>
        </div>

        <Button
          className={`w-full mt-6 font-bold py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out ${
            theme === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Apple className="mr-2" />
          Apple로 로그인
        </Button>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-[rgb(var(--accent))] hover:underline transition-colors duration-300"
          >
            비밀번호를 잊으셨나요?
          </a>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[rgb(var(--secondary))]">
            계정이 없으신가요?
            <a
              href="#"
              className="text-[rgb(var(--accent))] hover:underline ml-1 transition-colors duration-300"
            >
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
