import React from 'react';

interface ButtonProps {
  label: string;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ label, href }) => {
  const styles = {
    button: {
      color: 'black',
      textDecoration: 'none',
      display: 'block',
      padding: '4px',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#93c5fd',
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