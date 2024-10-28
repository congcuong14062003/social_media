
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRouter } from './routes';
import { DefaultLayout } from './Layout';
import PrivateRoute from './components/PrivateRouter/PrivateRouter';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import OwnDataProvider from './provider/own_data';
import { SocketProvider } from './provider/socket_context';
import { useSelector } from 'react-redux';

function App() {
    const theme = useSelector((state) => state.themeUI.theme);
    const root = document.querySelector(":root");

    console.log(theme);
    
    useEffect(() => {
        if (theme === "dark") {
          root.setAttribute("data-theme", "dark");
        } else {
          root.setAttribute("data-theme", "light");
        }
        root.style.transition = "all .5s ease";
      }, [theme, root]);
    return (
        <Router>
            <ToastContainer
                autoClose={2000} // Thời gian tự động đóng (miligiây)
            />{' '}
            {/* Add ToastContainer here */}
            <Routes>
                {publicRouter.map((route, index) => {
                    const Layout = route.layout || DefaultLayout;
                    const Page = route.component;
                    if (route.requireAuth) {
                        return (
                            <Route key={index} element={<PrivateRoute />}>
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <OwnDataProvider>
                                            <SocketProvider>
                                                <Layout>
                                                    <Page />
                                                </Layout>
                                            </SocketProvider>
                                        </OwnDataProvider>
                                    }
                                >
                                    {route.childrenRouter &&
                                        route.childrenRouter.map((child, indexChild) => (
                                            <Route exact key={child.path} path={child.path} element={child.component} />
                                        ))}
                                </Route>
                            </Route>
                        );
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        >
                            {route.childrenRouter &&
                                route.childrenRouter.map((child, indexChild) => (
                                    <Route exact key={child.path} path={child.path} element={child.component} />
                                ))}
                        </Route>
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
