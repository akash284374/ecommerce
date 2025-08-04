import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const { loading } = useAuth();

  // Apply saved theme from localStorage or prefers-color-scheme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-700 dark:text-white">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <AppRoutes />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
