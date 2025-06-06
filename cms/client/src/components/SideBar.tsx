import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { isAuthenticated, setIsAuthenticated, scopes } = useAuth();
  const sidebarRef = useOutsideClick(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
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
      left: isOpen ? '265px' : '20px',
      transition: 'left 0.3s ease',
      zIndex: 1000,
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: isOpen ? '0' : '-270px',
      width: '250px',
      height: '100%',
      backgroundColor: 'white',
      borderRight: '1px solid #ddd',
      overflowY: 'auto',
      transition: 'left 0.3s ease',
      zIndex: 999,
      padding: '20px 16px',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
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
      padding: '4px 0',
    },
  };

  const buttonClass = "w-full text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 font-semibold py-2 px-4 rounded transition duration-200 text-sm text-center block mb-3";

  return (
    <>
      {isAuthenticated && scopes.includes("admin") && !isOpen && (
        <button 
          style={styles.burgerIcon as React.CSSProperties} 
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      {isAuthenticated && scopes.includes("admin") && (
        <div ref={sidebarRef} style={styles.sidebar as React.CSSProperties}>
          <img 
            src="/assets/images/UoA-Logo-Primary-RGB-Large.png" 
            alt="Logo" 
            style={styles.logo} 
          />

          <nav>
            <ul style={styles.nav}>
              <li style={styles.navItem}>
                <Link to="/home" className={buttonClass}>
                  Home
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/modules" className={buttonClass}>
                  Module Management
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/programmes" className={buttonClass}>
                  Programme Management
                </Link>
              </li>
              <li style={styles.navItem}>
                <Link to="/users" className={buttonClass}>
                  User Management
                </Link>
              </li>
              {/* <li style={styles.navItem}>
                <Link to="/modules/analytics" className={buttonClass}>
                  Analytics
                </Link>
              </li> */}
              <li style={styles.navItem}>
                <Link to="/library" className={buttonClass}>
                  Upload Library
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-auto pt-6">
            <Link
              to="/"
              onClick={handleLogout}
              className="w-full text-red-600 hover:text-white hover:bg-red-600 border border-red-600 font-semibold py-2 px-4 rounded transition duration-200 text-sm text-center block"
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;