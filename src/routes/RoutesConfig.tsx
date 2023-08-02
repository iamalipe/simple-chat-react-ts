import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedLayout from "./ProtectedLayout";
import { RouteNames } from "../types";
import Home from "../pages/Home/Home";
import Page01 from "../pages/Page01/Page01";

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
      </Route>
      {/* All Normal Routes */}
      <Route path={RouteNames.HOME} element={<Home />} />
      <Route path={"*"} element={<Navigate to={RouteNames.HOME} />} />
    </Routes>
  );
};

export default RoutesConfig;
