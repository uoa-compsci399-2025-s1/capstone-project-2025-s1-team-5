import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useOutsideClick } from '../hooks/useOutsideClick';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useOutsideClick(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const styles = {
    burgerIcon: {
      fontSize: '24px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      position: 'fixed',
      top: '10px',
      left: isOpen? '225px' : '20px',
      transition: 'left 0.3s ease',
      zIndex: 1000,
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: isOpen ? '0' : '-100%',
      width: '250px',
      height: '100%',
      backgroundColor: '#333',
      color: 'white',
      overflow: 'hidden',
      transition: 'left 0.3s ease',
      zIndex: 999,
      padding: '10px',
    },
    logo: {
      width: '75%',
      height: 'auto',
      margin: '20px auto',
      display: 'block',
    },
    nav: {
      listStyle: 'none',
      padding: 0,
      margin: '0px',
    },
    navItem: {
      padding: '15px',
      borderBottom: '1px solid #444',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      display: 'block',
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
        <img src="/assets/images/DarkBlueLogo.png" alt="Logo" style={styles.logo}/>


        <nav>
          <ul style={styles.nav}>
            <li>
              <Link to="/">
                <Button label="Home" href="/" />
              </Link>
            </li>
            <li>
              <Link to="/modules/content">
                <Button label="Content Management" href="/modules/content" />
              </Link>
            </li>
            <li>
              <Link to="/modules/users">
                <Button label="User Management" href="/modules/users" />
              </Link>
            </li>
            <li>
              <Link to="/modules/account">
                <Button label="Account Management" href="/modules/account" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}


  export default Sidebar;