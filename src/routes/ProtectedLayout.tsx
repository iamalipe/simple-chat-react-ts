import Layout from "../layout/Layout";
import { RouteNames } from "../types";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedLayout = () => {
  const auth = true;

  const withLayout = (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  );

  return auth ? withLayout : <Navigate to={RouteNames.HOME} replace={true} />;
};
export default ProtectedLayout;
