import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContentPage from './pages/Content';
import UsersPage from './pages/Users';
import AccountPage from './pages/Account';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules/content" element={<ContentPage />} />
        <Route path="/modules/users" element={<UsersPage />} />
        <Route path="/modules/account" element={<AccountPage />} />
      </Routes>
    </Router>
    </Layout>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import Home from './pages/Home';
// import AccountPage from './pages/Account';
// import ContentPage from './pages/Content';
// import UsersPage from './pages/Users';

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
// export default function App() {
//   return (
//     <Layout>
//       <div style={{
//         backgroundColor: 'red', 
//         height: '100vh',
//         width: '100vw',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}>
//         <h1 style={{ color: 'white' }}>Hello World</h1>
//       </div>
//     </Layout>
//   );
// }