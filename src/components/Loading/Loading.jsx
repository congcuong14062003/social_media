import React, { createContext, useContext, useState, Fragment } from 'react';
import { Modal, Box, CircularProgress } from '@mui/material';

// Tạo Context
const LoadingContext = createContext();

// Tạo Provider để bao bọc App
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    };

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            <Modal open={isLoading}>
                <Box sx={style}>
                    <CircularProgress />
                </Box>
            </Modal>
        </LoadingContext.Provider>
    );
};

// Hook tiện ích để truy cập Loading Context
export const useLoading = () => useContext(LoadingContext);
