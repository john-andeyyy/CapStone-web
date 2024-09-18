import React, { useState, useEffect } from 'react';

const ThemeController = () => {
    const defaultColor = 'light';  
    const [theme, setTheme] = useState(localStorage.getItem('theme') || defaultColor);

    // Function to toggle between themes
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';  // Compare with 'light' or 'dark'
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        // Set the initial theme from localStorage or default to dark
        const savedTheme = localStorage.getItem('theme') || defaultColor;
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <div className="theme-toggle">
            <button onClick={toggleTheme} className="btn">
                Toggle Theme ({theme === 'light' ? 'Switch to Dark' : 'Switch to Light'})
            </button>
        </div>
    );
};

export default ThemeController;
