import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRouter } from './routes';
import { DefaultLayout } from './Layout';
function App() {
    return (
        <Router>
            <div>
                <Routes>
                    {publicRouter.map((route, index) => {
                        const Layout = route.layout || DefaultLayout;
                        const Page = route.component;
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
                                        <Route
                                            exact
                                            key={child.path}
                                            path={child.path}
                                            element={child.component}
                                        />
                                    ))}
                            </Route>
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
