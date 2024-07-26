// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRouter } from './routes';
import { DefaultLayout } from './Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup'; // Import component Signup

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {publicRouter.map((route, index) => {
                        const Layout = route.layout || DefaultLayout;
                        const Page = route.component;

                        // Nếu là route login hoặc signup thì không cần bảo vệ
                        if (route.path === '/login' || route.path === '/signup') {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <ProtectedRoute>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </ProtectedRoute>
                                }
                            >
                                {route.childrenRouter &&
                                    route.childrenRouter.map((child, indexChild) => (
                                        <Route
                                            exact
                                            key={child.path}
                                            path={child.path}
                                            element={
                                                <ProtectedRoute>
                                                    {child.component}
                                                </ProtectedRoute>
                                            }
                                        />
                                    ))}
                            </Route>
                        );
                    })}
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
