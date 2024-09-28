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
        <div className="flex  items-center mt-4">
            <span className="mr-2 text-lg font-semibold">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="toggle"
                    defaultChecked={theme === 'dark'}
                    onChange={toggleTheme}
                />
            </label>
        </div>
    );
};

export default ThemeController;
