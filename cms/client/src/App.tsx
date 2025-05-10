import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContentPage from './pages/Content';
import UsersPage from './pages/Users';
import Layout from './components/Layout';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { AuthProvider } from './auth/AuthProvider';

export default function App() {
  return (    
  <AuthProvider>
    <Router>
      <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/modules/home" element={<Home />} />
            <Route path="/modules/content" element={<ContentPage />} />
            <Route path="/modules/users" element={<UsersPage />} />
            <Route path="/modules/analytics" element={<Analytics />} />
          </Routes>
      </Layout>
    </Router>
  </AuthProvider>
);
}
