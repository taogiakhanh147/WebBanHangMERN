import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { isJsonString } from "./utils";
import { updateUser } from "./redux/slides/userSlide";
import Loading from "./components/LoadingComponent/Loading";

function App() {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    setIsPending(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
    setIsPending(false);
  }, []);

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  return (
    <div style={{height: '100vh', width: '100%'}}>
      <Loading isPending={isPending}>
        <Router>
          <Routes>
            {routes.map((route, index) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              if (!route.isPrivate || user.isAdmin) {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <>
                        <Layout>
                          <Page />
                        </Layout>
                      </>
                    }
                  />
                );
              }
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
