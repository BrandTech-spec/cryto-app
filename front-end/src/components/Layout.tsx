import { ReactNode } from "react";
import Navigation from "./Navigation";
import AuthoriseHeader from "./AuthoriseHeader";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-80">
      
      <AuthoriseHeader />
      {children}
      <Navigation />
    </div>
  );
};

export default Layout;