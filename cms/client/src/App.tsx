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
import AdminRoute from './auth/AdminRoute';

export default function App() {
  return (    
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/home"
              element={
                <AdminRoute requiredScope="admin">
                  <Home />
                </AdminRoute>
              }
            />
            <Route
              path="/modules"
              element={
                <AdminRoute requiredScope="admin">
                  <ModulesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute requiredScope="admin">
                  <UsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/library"
              element={
                <AdminRoute requiredScope="admin">
                  <UploadLibrary />
                </AdminRoute>
              }
            />
            <Route
              path="/programmes"
              element={
                <AdminRoute requiredScope="admin">
                  <ProgrammesPage />
                </AdminRoute>
              }
            />

            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
