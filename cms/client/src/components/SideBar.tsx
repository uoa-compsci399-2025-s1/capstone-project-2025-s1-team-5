import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../auth/AuthProvider';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
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
      padding: '12px 0',
      borderBottom: '1px solid #eee',
    },
  };

  return (
    <>
      {!isOpen && (
        <button 
          style={styles.burgerIcon as React.CSSProperties} 
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      <div ref={sidebarRef} style={styles.sidebar as React.CSSProperties}>
        <img 
          src="/assets/images/UoA-Logo-Primary-RGB-Large.png" 
          alt="Logo" 
          style={styles.logo} 
        />

        <nav>
          <ul style={styles.nav}>
            <li><Link to="/modules/home"><Button label="Home" href="/modules/home" /></Link></li>
            <li><Link to="/modules/content"><Button label="Content Management" href="/modules/content" /></Link></li>
            <li><Link to="/modules/users"><Button label="User Management" href="/modules/users" /></Link></li>
            <li><Link to="/modules/analytics"><Button label="Analytics" href="/modules/analytics" /></Link></li>
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
    </>
  );
}

export default Sidebar;