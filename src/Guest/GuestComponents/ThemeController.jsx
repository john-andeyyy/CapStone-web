import React, { useState, useEffect } from 'react';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';

const ThemeController = () => {
    const defaultColor = 'light';
    const [theme, setTheme] = useState(localStorage.getItem('theme') || defaultColor);

    // Function to toggle between themes
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);

        // Optional: Show a toast notification for theme change
        showToast(`Theme changed to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}!`);
    };

    useEffect(() => {
        // Set the initial theme from localStorage or default to light
        const savedTheme = localStorage.getItem('theme') || defaultColor;
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <div className="flex  items-center ">
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    className="sr-only peer toggle"
                    type="checkbox"
                    defaultChecked={theme === 'dark'}
                    onChange={toggleTheme}

                />



                <div
                    className="w-20 h-8 rounded-full ring-0 peer duration-500 outline-none
                    bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️']
                    before:absolute before:h-5 before:w-5 before:top-1/2 before:bg-white before:rounded-full
                    before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0
                    peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg
                    peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] 
                    after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-5 after:h-5 after:opacity-0 after:transition-all 
                    after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"
                ></div>
            </label>

        </div>
    );
};

// defaultChecked = { theme === 'dark'}
// onChange = { toggleTheme }

export default ThemeController;
