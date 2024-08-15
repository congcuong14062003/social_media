// src/components/PrivateRouter/PrivateRouter.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = () => {
    return Cookies.get('accessToken') ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
