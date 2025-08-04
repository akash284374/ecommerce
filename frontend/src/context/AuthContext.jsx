// import { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser } from "../services/authService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     try {
//       const res = await getCurrentUser();
//       setUser(res.data.user);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Re-fetch user on login/logout
//   const refreshUser = () => {
//     setLoading(true);
//     fetchUser();
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout as logoutService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const fetchUser = async () => {
  //   try {
  //     const res = await getCurrentUser();
  //     setUser(res.data.user);
  //   } catch {
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUser = async () => {
  try {
    const res = await getCurrentUser();
    setUser(res.data.user);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Not logged in — set user to null silently
      setUser(null);
    } else {
      console.error("❌ Error fetching user:", err);
    }
  } finally {
    setLoading(false);
  }
};


  const refreshUser = () => {
    setLoading(true);
    fetchUser();
  };

  // ✅ FIX: Add this logout handler
  const logoutUser = async () => {
    try {
      await logoutService();   // backend GET /api/auth/logout
      setUser(null);           // clear user in context
      navigate("/login");      // redirect
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => useContext(AuthContext);
// useEffect(() => {
//   fetchUser();
// }, []);

export const useAuth = () => useContext(AuthContext);
