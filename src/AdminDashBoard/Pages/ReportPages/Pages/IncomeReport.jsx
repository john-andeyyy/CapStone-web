import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsReport = () => {
    const [appointments, setAppointments] = useState([]);
    const [reportData, setReportData] = useState({ daily: {}, monthly: {}, yearly: {} });
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState('daily');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
    const yearsAvailable = [...new Set(appointments.map(appointment => new Date(appointment.date).getFullYear()))];

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASEURL}/Appointments/appointments/filter`);
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    setAppointments(response.data);
                } else {
                    throw new Error('Expected an array of appointments');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Failed to fetch appointments.');
            }
        };

        fetchAppointments();
    }, []);

    useEffect(() => {
        const generateReport = () => {
            const daily = {};
            const monthly = {};
            const yearly = {};

            appointments.forEach(appointment => {
                if (appointment.isfullypaid) {
                    const date = new Date(appointment.date);
                    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
                    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-MM
                    const yearKey = date.getFullYear(); // YYYY

                    // Daily report
                    daily[dayKey] = (daily[dayKey] || 0) + appointment.amount;

                    // Monthly report
                    monthly[monthKey] = (monthly[monthKey] || 0) + appointment.amount;

                    // Yearly report by month
                    const yearMonthKey = `${yearKey}-${date.getMonth() + 1}`; // YYYY-MM
                    yearly[yearMonthKey] = (yearly[yearMonthKey] || 0) + appointment.amount;
                }
            });

            setReportData({ daily, monthly, yearly });
        };

        if (appointments.length > 0) {
            generateReport();
        }
    }, [appointments]);

    const handleReportChange = (reportType) => {
        setSelectedReport(reportType);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleTodayClick = () => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today); // Reset selected date to today
    };

    if (error) {
        return <div className="text-red-600">{error}</div>; // Display error message if any
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Appointments Report</h1>

            {/* Report Type Buttons */}
            <div className="mb-4">
                <button className="bg-green-500 text-white py-2 px-4 rounded mx-2" onClick={() => handleReportChange('daily')}>Daily Report</button>
                <button className="bg-blue-500 text-white py-2 px-4 rounded mx-2" onClick={() => handleReportChange('monthly')}>Monthly Report</button>
                <button className="bg-yellow-500 text-white py-2 px-4 rounded mx-2" onClick={() => handleReportChange('yearly')}>Yearly Report</button>
            </div>

            {/* Date Picker for Daily Report */}
            {selectedReport === 'daily' && (
                <div className="mb-4">
                    <label htmlFor="date-picker" className="mr-2">Select Date:</label>
                    <input
                        type="date"
                        id="date-picker"
                        className="border rounded px-2 py-1"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                    {/* Today's Button */}
                    {selectedDate !== new Date().toISOString().split('T')[0] && (
                        <button
                            className="ml-4 bg-gray-500 text-white py-2 px-4 rounded"
                            onClick={handleTodayClick}
                        >
                            Today
                        </button>
                    )}
                </div>
            )}

            {/* Month Selector for Monthly and Yearly Reports */}
            {(selectedReport === 'monthly' || selectedReport === 'yearly') && (
                <div className="mb-4">
                    <label htmlFor="month-select" className="mr-2">Select Month:</label>
                    <select id="month-select" className="border rounded px-2 py-1" value={selectedMonth} onChange={handleMonthChange}>
                        {[...Array(12)].map((_, index) => (
                            <option key={index} value={index + 1}>
                                {new Date(0, index).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    {/* Year Selector for Yearly Reports */}
                    {selectedReport === 'yearly' && (
                        <div className="mt-2">
                            <label htmlFor="year-select" className="mr-2">Select Year:</label>
                            <select id="year-select" className="border rounded px-2 py-1" value={selectedYear} onChange={handleYearChange}>
                                {yearsAvailable.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            {/* Display the selected report */}
            {selectedReport === 'daily' && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Daily Report for {selectedDate}</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Date</th>
                                <th className="border px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(reportData.daily).map(([day, amount]) => {
                                if (day === selectedDate) {
                                    return (
                                        <tr key={day} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{day}</td>
                                            <td className="border px-4 py-2">{amount}</td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                </>
            )}

            {selectedReport === 'monthly' && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Monthly Report for {new Date(new Date().getFullYear(), selectedMonth - 1).toLocaleString('default', { month: 'long' })}</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Month</th>
                                <th className="border px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(reportData.monthly).map(([month, amount]) => {
                                if (month.split('-')[1] === selectedMonth.toString()) {
                                    return (
                                        <tr key={month} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{month}</td>
                                            <td className="border px-4 py-2">{amount}</td>
                                        </tr>
                                    );
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                </>
            )}

            {selectedReport === 'yearly' && (
                <>
                    <h2 className="text-xl font-semibold mb-2">Yearly Report for {selectedYear}</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-accent">
                                <th className="border px-4 py-2">Month</th>
                                <th className="border px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 12 }, (_, index) => {
                                const monthKey = `${selectedYear}-${index + 1}`; // YYYY-MM
                                const amount = reportData.yearly[monthKey] || 0; // Default to 0 if no data
                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{new Date(0, index).toLocaleString('default', { month: 'long' })}</td>
                                        <td className="border px-4 py-2">₱{amount}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-accent">
                                <td className="border px-4 py-2 font-bold">Total</td>
                                <td className="border px-4 py-2 font-bold">
                                    ₱{Object.values(reportData.yearly).reduce((acc, curr) => acc + curr, 0)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </>
            )}
        </div>
    );
};

export default AppointmentsReport;
