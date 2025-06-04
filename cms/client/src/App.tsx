import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModulesPage from './pages/Modules';
import UsersPage from './pages/Users';
import Layout from './components/Layout';
import Login from './pages/Login';
import { AuthProvider } from './auth/AuthProvider';
import UploadLibrary from './pages/UploadLibrary';
import ProgrammesPage from './pages/Programmes';

export default function App() {
  return (    
  <AuthProvider>
    <Router>
      <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/modules/home" element={<Home />} />
            <Route path="/modules/modules" element={<ModulesPage />} />
            <Route path="/modules/users" element={<UsersPage />} />
            <Route path="/modules/library" element={<UploadLibrary />} />
            <Route path="/modules/programmes" element={<ProgrammesPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
      </Layout>
    </Router>
  </AuthProvider>
);
}
