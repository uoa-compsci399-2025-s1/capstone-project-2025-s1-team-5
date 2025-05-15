import React, { ReactNode, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import Sidebar from "./SideBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const contentStyle = {
    marginLeft: isSidebarOpen && isAuthenticated? '250px' : '0',
    transition: 'margin-left 0.3s ease',
    width: '100%',
  };

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
      )}
      <main 
        className="flex-1 p-4" 
        style={isAuthenticated ? contentStyle : {}}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;