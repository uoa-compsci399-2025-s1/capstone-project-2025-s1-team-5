import React from 'react';

interface ButtonProps {
  label: string;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ label, href }) => {
  const styles = {
    button: {
      color: 'white',
      textDecoration: 'none',
      display: 'block',
      padding: '15px',
      borderBottom: '1px solid #444',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#555',
    },
  };

  return (
    <a
      href={href}
      style={styles.button as React.CSSProperties}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.backgroundColor = styles.buttonHover.backgroundColor!;
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.backgroundColor = 'transparent';
      }}
    >
      {label}
    </a>
  );
};

export default Button;