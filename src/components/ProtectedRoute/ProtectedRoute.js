// src/components/ProtectedRoute/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    // Nếu trang hiện tại là trang đăng ký hoặc đăng nhập thì không cần bảo vệ
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return children;
    }

    // Nếu không có user thì chuyển hướng đến trang đăng nhập
    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
