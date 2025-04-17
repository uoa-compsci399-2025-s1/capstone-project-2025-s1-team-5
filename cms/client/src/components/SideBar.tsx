import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

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
      left: isOpen? '225px' : '20px',
      transition: 'left 0.3s ease',
      zIndex: 1000,
    },
    closeIcon: {
      fontSize: '24px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      color: 'white',
      position: 'absolute',
      top: '10px',
      left: '20px',
      zIndex: 1001,
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
      margin: '40px 0 0 0',
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

  // return (
  //   <div>
  //     <button style={styles.burgerIcon as React.CSSProperties} onClick={toggleSidebar}>
  //       ☰
  //     </button>

  //     <div style={styles.sidebar as React.CSSProperties}>
  //       <nav>
  //         <ul style={styles.nav}>
  //           <li style={styles.navItem}>
  //             <a href="/home" style={styles.navLink}>Home</a>
  //           </li>
  //           <li style={styles.navItem}>
  //             <Link href="/modules/content">
  //               <a style={styles.navLink}>Content Management</a>
  //             </Link>
  //           </li>
  //           <li style={styles.navItem}>
  //             <Link href="/modules/users"> 
  //               <a style={styles.navLink}>User Management</a>
  //             </Link>
  //           </li>
  //           <li style={styles.navItem}>
  //             <Link href="/modules/account"> 
  //               <a style={styles.navLink}>Account Management</a>
  //             </Link>
              
  //           </li>
  //         </ul>
  //       </nav>
  //     </div>
  //   </div>
  // );
  return (
    <div>
      {!isOpen && (
        <button style={styles.burgerIcon as React.CSSProperties} onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <div style={styles.sidebar as React.CSSProperties}>
        {isOpen && (
          <button style={styles.closeIcon as React.CSSProperties} onClick={toggleSidebar}>
            ✖
          </button>
        )}
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