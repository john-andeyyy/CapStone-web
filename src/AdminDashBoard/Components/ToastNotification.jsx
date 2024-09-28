import React from 'react';
import { ToastContainer, toast, Bounce, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ToastNotification component for displaying toast messages
// ToastNotification component for displaying toast messages
const ToastNotification = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            limit={2}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            transition={Slide} // Correctly use Slide
        />
    );
};


export const showToast = (type, message) => {
    const commonOptions = {
        // position: "top-right",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide, // Use Slide directly
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
            toast(message, commonOptions);
            break;
    }
};

export default ToastNotification;
