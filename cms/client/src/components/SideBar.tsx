import React, { useState } from 'react';
import Link from 'next/link';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
      left: isOpen ? '225px' : '10px',
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
    nav: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
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
      <button style={styles.burgerIcon as React.CSSProperties} onClick={toggleSidebar}>
        ☰
      </button>

      <div style={styles.sidebar as React.CSSProperties}>
        <nav>
          <ul style={styles.nav}>
            <li style={styles.navItem}>
              <Link href="/home" style={styles.navLink}>Home</Link>
            </li>
            <li style={styles.navItem}>
              <Link href="/modules/content" style={styles.navLink}>Content Management</Link>
            </li>
            <li style={styles.navItem}>
              <Link href="/modules/users" style={styles.navLink}>User Management</Link>
            </li>
            <li style={styles.navItem}>
              <Link href="/modules/account" style={styles.navLink}>Account Management</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
