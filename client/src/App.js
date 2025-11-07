import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Notification toasts removed (disabled globally)

import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import Network from './pages/Network';
import Jobs from './pages/Jobs';
import Messaging from './pages/Messaging';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/onboarding"
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <PrivateRoute>
                    <Feed />
                  </PrivateRoute>
                }
              />
              <Route
                path="/network"
                element={
                  <PrivateRoute>
                    <Network />
                  </PrivateRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <PrivateRoute>
                    <Jobs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messaging"
                element={
                  <PrivateRoute>
                    <Messaging />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />
                
              <Route path="/profile/:userId" element={<Profile />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* ToastContainer removed - notifications disabled */}
          </div>
        </Router>
      </PostProvider>
    </AuthProvider>
  );
}

export default App;
