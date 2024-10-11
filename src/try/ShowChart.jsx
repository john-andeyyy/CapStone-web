import React from 'react'
import BarChart from '../AdminDashBoard/Charts/BarChart';

export default function ShowChart() {

    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Completed Appointments',
                data: [12, 19, 3, 5],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Missed Appointments',
                data: [2, 3, 2, 5],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };


    return (
        <div>
            <BarChart chartData={chartData} />
        </div>
    )
}
