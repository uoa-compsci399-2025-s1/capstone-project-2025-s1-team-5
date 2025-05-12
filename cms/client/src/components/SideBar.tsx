import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../auth/AuthProvider';
import { useOutsideClick } from '../hooks/useOutsideClick';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const sidebarRef = useOutsideClick(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('authToken');
    
    // Update the authentication state to false
    setIsAuthenticated(false);
  };

  const styles = {
    burgerIcon: {
      fontSize: '24px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      position: 'fixed',
      top: '20px',
      left: isOpen ? '265px' : '20px',  // Make room when sidebar is open
      transition: 'left 0.3s ease',
      zIndex: 1000,
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: isOpen ? '0' : '-270px',  // Adjust to match width + some buffer
      width: '250px',
      height: '100%',
      backgroundColor: 'white',
      borderRight: '1px solid #ddd',  // Optional, adds definition
      overflowY: 'auto',
      transition: 'left 0.3s ease',
      zIndex: 999,
      padding: '20px 16px',  // More padding inside the sidebar
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
    },
    logo: {
      width: '100%',
      height: 'auto',
      margin: '10px 0 30px',
      display: 'block',
    },
    nav: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    navItem: {
      padding: '12px 0',
      borderBottom: '1px solid #eee',
    },
  };
  

  return (
    <div>
      {!isOpen && (
        <button style={styles.burgerIcon as React.CSSProperties} onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div ref={sidebarRef} style={styles.sidebar as React.CSSProperties}>
        <img src="/assets/images/UoA-Logo-Primary-RGB-Large.png" alt="Logo" style={styles.logo}/>

        <nav>
          <ul style={styles.nav}>
            <li>
              <Link to="/modules/home">
                <Button label="Home" href="/modules/home" />
              </Link>
            </li>
            <li style={styles.navItem}>
              <Button label="Module Management" href="/modules/modules" />
            </li>
            <li style={styles.navItem}>
              <Button label="User Management" href="/modules/users" />
            </li>
            <li>
              <Link to="/modules/analytics">
                <Button label="Analytics" href="/modules/analytics" />
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left">
                <Button label="Logout" href="/" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
