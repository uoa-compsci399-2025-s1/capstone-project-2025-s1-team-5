import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ModulesPage from './pages/Modules';
import UsersPage from './pages/Users';
import AccountPage from './pages/Account';
import Layout from './components/Layout';

export default function App() {
  return (    
  <Router>
    <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modules/modules" element={<ModulesPage />} />
          <Route path="/modules/users" element={<UsersPage />} />
          <Route path="/modules/account" element={<AccountPage />} />
        </Routes>
    </Layout>
  </Router>
);
}
