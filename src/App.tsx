import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Streams from "./pages/Streams";
import Settings from "./pages/Settings";
import ErrorBoundary from "./components/ErrorBoundary";

const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center p-8">
      <div className="max-w-md w-full border border-[#141414] p-12 bg-white/50 space-y-8">
        <div className="text-center">
          <h1 className="font-serif italic text-4xl tracking-tight">WE STREAM</h1>
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mt-2">Admin Portal</p>
        </div>
        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            className="w-full py-4 border border-[#141414] font-mono text-sm uppercase tracking-widest hover:bg-[#141414] hover:text-[#E4E3E0] transition-all duration-300 flex items-center justify-center gap-3"
          >
            Sign in with Google
          </button>
          <p className="text-[10px] font-mono opacity-40 text-center uppercase tracking-tighter">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Initializing System...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route
            path="/*"
            element={
              user ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/streams" element={<Streams />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
