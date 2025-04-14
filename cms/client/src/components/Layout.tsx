import React from 'react';
import Sidebar from './SideBar';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '50px', padding: '15px' }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;