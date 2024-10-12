// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ chartData }) => {
    const primaryColor = '#6B7280'; // Use the same value as 

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: primaryColor, 
                },
            },
            title: {
                display: true,
                text: 'Appointments Report',
                color: primaryColor, 
            },
        },
        scales: {
            x: {
                ticks: {
                    color: primaryColor, 
                    font: {
                        weight: 'bold',
                    },
                },
            },
            y: {
                ticks: {
                    color: primaryColor, 
                    font: {
                        weight: 'bold', 
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default BarChart;
