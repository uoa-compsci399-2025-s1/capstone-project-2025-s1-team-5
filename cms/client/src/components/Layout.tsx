import React, { ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import Sidebar from "./SideBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen">
      {isAuthenticated && <Sidebar />}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
