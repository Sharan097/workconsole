import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Pendingpage from "./pages/Pendingpage";
import Completepage from "./pages/Completepage";
import Profile from "./components/Profile";
import Dashboard from "./pages/Dashboard"; 

const App = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
  const user = {
    email: data.email,
    name: data.name || "User",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      data.name || "User"
    )}&background=random`,
  };

  // store auth properly
  if (data.token) localStorage.setItem("token", data.token);
  if (data.userId) localStorage.setItem("userId", data.userId);

  setCurrentUser(user);

  navigate("/", { replace: true });
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <SignUp
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />


      {/* PROTECTED ROUTES */}
      <Route element={currentUser ? ( <Layout user={currentUser}  onLogout={handleLogout} />) : (<Navigate to="/login" replace />) }>


        {/* IMPORTANT: child route */}

        <Route index element={<Dashboard />} />

        <Route path="/pending" element={<Pendingpage />} />

        <Route path="/completed" element={<Completepage />} />

        <Route
          path="/profile"
          element={
            <Profile
              user={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
            />
          }
        />

      </Route>
    </Routes>
  );
};

export default App;        