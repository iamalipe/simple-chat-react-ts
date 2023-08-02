import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import Footer from "./Footer";

export interface LayoutProps {
  children?: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="container mx-auto h-full relative flex flex-col bg-base-100 text-base-content">
        <Header />
        <div className="flex-1 w-full flex overflow-auto">
          <Sidebar />
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};
export default Layout;
