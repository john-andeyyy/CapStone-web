import React, { useEffect, useState } from 'react';
import ReportMenu from '../components/ReportMenu';
import axios from 'axios';
import BarChart from '../../../Charts/BarChart';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {PDFReport} from '../../../Component_Functions/PDFReport';
export default function Report_Monthly_Appointment() {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const [completedCount, setCompletedCount] = useState(0);
    const [missedCount, setMissedCount] = useState(0);
    const [appointmentsData, setAppointmentsData] = useState([]); // All fetched data
    const [filteredAppointments, setFilteredAppointments] = useState([]); // Filtered data for display
    const [week, setWeek] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [viewingYearly, setViewingYearly] = useState(false);
    const [isToday, setIsToday] = useState(true);
    const [years, setYears] = useState([]);


    useEffect(() => {
        if (appointmentsData.length > 0) {
            const uniqueYears = [...new Set(appointmentsData.map(app => new Date(app.date).getFullYear()))];
            setYears(uniqueYears);
        }
    }, [appointmentsData]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${BASEURL}/Appointments/appointments/filter`);
                const data = response.data.filter(appointment =>
                    appointment.status === 'Completed' || appointment.status === 'Missed'
                );

                console.log(data);

                setAppointmentsData(data);
                filterAppointments(data); // Initial filter based on current month and year
            } catch (error) {
                console.error('Error fetching appointment data:', error);
            }
        };

        fetchAppointments();

        // Check if the selected month and year match today's date
        const today = new Date();
        setIsToday(month === today.toISOString().slice(0, 7) && selectedYear === today.getFullYear());
    }, []);

    const filterAppointments = (appointments) => {
        let filteredData = appointments;

        // If viewing today's report, filter only today's appointments
        if (isToday) {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            filteredData = appointments.filter(appointment => appointment.date.startsWith(today));
        } else {
            if (viewingYearly) {
                // Filter data for the selected year
                filteredData = appointments.filter(appointment =>
                    appointment.date.startsWith(`${selectedYear}`)
                );
            } else {
                // Filter based on year
                filteredData = filteredData.filter(appointment =>
                    appointment.date.startsWith(`${selectedYear}`)
                );

                // Filter based on month
                if (month) {
                    filteredData = filteredData.filter(appointment =>
                        appointment.date.startsWith(`${selectedYear}-${month.split('-')[1]}`)
                    );
                }

                // Filter based on week if selected
                if (week) {
                    const [weekStart, weekEnd] = week.split(' to ');
                    filteredData = filteredData.filter(appointment =>
                        new Date(appointment.date) >= new Date(weekStart) && new Date(appointment.date) <= new Date(weekEnd)
                    );
                }
            }
        }

        // Count completed and missed appointments
        const completed = filteredData.filter(appointment => appointment.status === 'Completed').length;
        const missed = filteredData.filter(appointment => appointment.status === 'Missed').length;

        setCompletedCount(completed);
        setMissedCount(missed);
        setFilteredAppointments(filteredData);
    };

    // Function to calculate chart data for weekly or monthly view
    const getChartData = () => {
        const counts = {
            completed: [],
            missed: []
        };

        if (!viewingYearly) {
            // Get the start and end of the current month
            const monthStart = new Date(`${selectedYear}-${month.split('-')[1]}-01`);
            const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

            // Iterate over each week in the month
            let currentWeekStart = new Date(monthStart);
            while (currentWeekStart <= monthEnd) {
                // Calculate the end of the week
                const currentWeekEnd = new Date(currentWeekStart);
                currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

                // Ensure the week does not go beyond the end of the month
                const weekEnd = currentWeekEnd > monthEnd ? monthEnd : currentWeekEnd;

                // Filter appointments within the current week
                const weekData = filteredAppointments.filter(appointment => {
                    const appointmentDate = new Date(appointment.date);
                    return appointmentDate >= currentWeekStart && appointmentDate <= weekEnd;
                });

                // Count completed and missed appointments for the week
                counts.completed.push(weekData.filter(appointment => appointment.status === 'Completed').length);
                counts.missed.push(weekData.filter(appointment => appointment.status === 'Missed').length);

                // Move to the next week
                currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            }
        }

        // Yearly View
        else {
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            months.forEach((_, index) => {
                const monthData = filteredAppointments.filter(appointment => {
                    const date = new Date(appointment.date);
                    return date.getFullYear() === selectedYear && date.getMonth() === index;
                });
                counts.completed.push(monthData.filter(appointment => appointment.status === 'Completed').length);
                counts.missed.push(monthData.filter(appointment => appointment.status === 'Missed').length);
            });
        }

        return {
            labels: !viewingYearly ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
                ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Completed Appointments',
                    data: counts.completed,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Missed Appointments',
                    data: counts.missed,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    useEffect(() => {
        // Filter the data whenever month, year, or view changes
        filterAppointments(appointmentsData);
    }, [month, week, selectedYear, viewingYearly, isToday]);



    return (
        <div className="">
            <ReportMenu />
            <div className=" rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-green-400 p-4">Appointment Report</h2>
                <h1 className="text-1xl mt-4 sm:mt-0 pb-7">
                    {new Date().toLocaleString('default', { month: 'long' })} {new Date().getDate()}, {new Date().getFullYear()}
                </h1>


                <div className="pb-7 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3">
                    {!viewingYearly ? (
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center">
                            {!isToday ? (
                                <>
                                    {/* Month Input */}
                                    <input
                                        type="month"
                                        id="month"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="w-full sm:w-auto p-2 border rounded shadow-sm"
                                    />

                                    {/* Previous Month Button */}
                                    <button
                                        onClick={() =>
                                            setMonth(
                                                new Date(new Date(month).setMonth(new Date(month).getMonth() - 1))
                                                    .toISOString()
                                                    .slice(0, 7)
                                            )
                                        }
                                        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                        aria-label="Previous Month"
                                    >
                                        Previous Month
                                    </button>

                                    {/* Next Month Button */}
                                    <button
                                        onClick={() =>
                                            setMonth(
                                                new Date(new Date(month).setMonth(new Date(month).getMonth() + 1))
                                                    .toISOString()
                                                    .slice(0, 7)
                                            )
                                        }
                                        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                        aria-label="Next Month"
                                    >
                                        Next Month
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsToday(false)}
                                        className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                                        aria-label="Switch to Monthly View"
                                    >
                                        Monthly
                                    </button>
                                </>
                            )}

                            {/* Today Button */}
                            <button
                                onClick={() => {
                                    setMonth(new Date().toISOString().slice(0, 7)); // Set to current month
                                    setIsToday(true);
                                    setViewingYearly(false);
                                }}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200"
                                aria-label="View Today's Appointments"
                            >
                                Today
                            </button>
                        </div>
                    ) : (
                        <div className="w-full"> {/* Full width for year selector */}
                            {/* Year Select */}
                            <div className="mb-4 w-full">
                                <label htmlFor="year-selector" className="block text-sm font-medium text-gray-700">Select Year:</label>
                                <select
                                    id="year-selector"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setViewingYearly(!viewingYearly);
                            setIsToday(false);
                            if (viewingYearly) {
                                setMonth(new Date().toISOString().slice(0, 7));
                            }
                        }}
                        className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                        aria-label={`Switch to ${viewingYearly ? 'Monthly' : 'Yearly'} View`}
                    >
                        {viewingYearly ? 'View Monthly' : 'View Yearly'}
                    </button>

                    <PDFReport
                        appointments={filteredAppointments}
                        month={
                            isToday
                                ? new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) // Today's month and year
                                : new Date(`${selectedYear}-${month.split('-')[1]}-01`).toLocaleString('default', { month: 'long', year: 'numeric' }) // Selected month and year
                        }
                        title="Monthly Appointments Report"
                    />
                </div>
                


                <div className=''>

                    {/* Display Counts for Completed and Missed Appointments */}
                    <div className="">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-center p-6 bg-green-100 rounded-lg shadow-lg">
                                <div>
                                    <h3 className="text-2xl font-semibold text-green-700">Completed Appointments</h3>
                                    <p className="text-xl text-green-900">{completedCount}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-6 bg-red-100 rounded-lg shadow-lg">
                                <div>
                                    <h3 className="text-2xl font-semibold text-red-700">Missed Appointments</h3>
                                    <p className="text-xl text-red-900">{missedCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditionally render chart or table based on today's report */}
                    {isToday ? (
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold mt-4 text-center sm:text-left">Today's Appointments</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border border-gray-200 mt-2 text-sm sm:text-base">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 p-2 text-left">Patient Name</th>
                                            <th className="border border-gray-300 p-2 text-left">Status</th>
                                            <th className="border border-gray-300 p-2 text-left">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map((appointment) => (
                                            <tr key={appointment._id}>
                                                <td className="border border-gray-300 p-2">
                                                    {appointment.patient.LastName} {appointment.patient.FirstName}
                                                </td>
                                                <td className={`border border-gray-300 p-2 font-bold ${appointment.status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {appointment.status}
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                    {new Date(appointment.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Render the chart */}
                            <div className="hidden sm:block">
                                <BarChart chartData={getChartData()} />
                            </div>


                            {/* Appointment summary if applicable */}
                            {isToday && (
                                <div>
                                    <h3 className="text-lg sm:text-xl font-semibold mt-4 text-center sm:text-left">Appointment Summary</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse border border-gray-200 mt-2 text-sm sm:text-base">
                                            <thead>
                                                <tr>
                                                    <th className="border border-gray-300 p-2 text-left">Patient Name</th>
                                                    <th className="border border-gray-300 p-2 text-left">Status</th>
                                                    <th className="border border-gray-300 p-2 text-left">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredAppointments.map((appointment) => (
                                                    <tr key={appointment._id}>
                                                        <td className="border border-gray-300 p-2">
                                                            {appointment.patient.LastName} {appointment.patient.FirstName}
                                                        </td>
                                                        <td className={`border border-gray-300 p-2 font-bold ${appointment.status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}>
                                                            {appointment.status}
                                                        </td>
                                                        <td className="border border-gray-300 p-2">
                                                            {new Date(appointment.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
