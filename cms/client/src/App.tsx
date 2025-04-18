import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';


// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/modules/content" element={<ContentPage />} />
//           <Route path="/modules/users" element={<UsersPage />} />
//           <Route path="/modules/account" element={<AccountPage />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;

// src/App.tsx
export default function App() {
  return (
    <div style={{
      backgroundColor: 'red', 
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: 'white' }}>Hello World</h1>
    </div>
  );
}