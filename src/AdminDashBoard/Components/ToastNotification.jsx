import React from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ToastNotification component for displaying toast messages
const ToastNotification = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000} // Toast will auto-close after 5 seconds
            hideProgressBar={false}
            newestOnTop={false}
            limit={5}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false} // Ensure pauseOnHover is false for all toasts
        />
    );
};

// Function to trigger different types of toast notifications
export const showToast = (type, message) => {
    console.log(message);
    const commonOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false, 
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    };

    switch (type) {
        case 'success':
            toast.success(message, commonOptions);
            break;
        case 'error':
            toast.error(message, commonOptions);
            break;
        case 'info':
            toast.info(message, commonOptions);
            break;
        case 'warning':
            toast.warning(message, commonOptions);
            break;
        default:
            toast(message, commonOptions); // Default notification
            break;
    }
};

export default ToastNotification;
