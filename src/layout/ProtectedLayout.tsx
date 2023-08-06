import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./SideBar";
import { RouteNames } from "../types";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedLayout = () => {
  const auth = true;

  const withLayout = (
    <div className="container mx-auto h-full relative flex flex-col bg-base-100 text-base-content">
      <Header />
      <div className="flex-1 w-full flex overflow-auto">
        <Sidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );

  return auth ? withLayout : <Navigate to={RouteNames.LOGIN} />;
};
export default ProtectedLayout;
