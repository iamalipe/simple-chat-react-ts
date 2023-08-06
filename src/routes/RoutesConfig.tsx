import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedLayout from "../layout/ProtectedLayout";
import { RouteNames } from "../types";
import Page01 from "../pages/Page01/Page01";
import PublicLayout from "../layout/PublicLayout";
import Login from "../pages/common/Login";
import Signup from "../pages/common/Signup";
import { Chat } from "../pages/Chat";
import Home from "../pages/Home/Home";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* All Protected Routes*/}
      <Route element={<ProtectedLayout />}>
        {/* Images Page */}
        {/* <Route element={<ImagesPageLayout />}>
          <Route path={RouteNames.IMAGES.url} element={<ImagesPage />} />
        </Route> */}
        <Route path={RouteNames.PAGE01} element={<Page01 />} />
        <Route path={RouteNames.CHAT} element={<Chat />} />
        <Route path={RouteNames.HOME} element={<Home />} />
      </Route>
      <Route element={<PublicLayout />}>
        {/* All Normal Routes */}
        <Route path={RouteNames.LOGIN} element={<Login />} />
        <Route path={RouteNames.SIGNUP} element={<Signup />} />
        <Route path={"*"} element={<Navigate to={RouteNames.HOME} />} />
      </Route>
    </Routes>
  );
};

export default RoutesConfig;
