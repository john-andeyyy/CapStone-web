// PieChart.jsx
import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ labels, datasets, title }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartInstanceRef.current) {
            // Update the chart if it already exists
            chartInstanceRef.current.data.labels = labels;
            chartInstanceRef.current.data.datasets = datasets;
            chartInstanceRef.current.update();
        } else {
            const ctx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: title,
                        },
                    },
                },
            });
        }
    }, [labels, datasets]);

    return <canvas ref={chartRef} />;
};

export default PieChart;
