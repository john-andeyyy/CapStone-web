import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportMenu from '../components/ReportMenu';
import { format } from 'date-fns'; // Import date-fns for formatting dates
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable

const AppointmentsReport = () => {
    const [appointments, setAppointments] = useState([]);
    const [reportData, setReportData] = useState({ daily: {}, monthly: {}, yearly: {} });
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState('daily');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
                if (appointment.status === 'Completed') {
                    const date = new Date(appointment.date);
                    const dayKey = date.toISOString().split('T')[0];
                    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    const yearKey = date.getFullYear();

                    daily[dayKey] = (daily[dayKey] || 0) + appointment.amount;
                    monthly[monthKey] = (monthly[monthKey] || 0) + appointment.amount;
                    yearly[yearKey] = (yearly[yearKey] || 0) + appointment.amount;
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
        setSelectedDate(today);
    };

  













    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Appointments Report', 14, 20); // Title

        let totalAmount = 0; // Initialize total amount
        const pesoSign = 'Php'+''; // Correct peso sign

        let formattedTotal = `${pesoSign}0.00`; // Initialize formatted total for all reports

        if (selectedReport === 'daily') {
            doc.setFontSize(16);
            doc.text(`Daily Report for ${format(new Date(selectedDate), 'MMM dd yyyy')}`, 14, 30);

            const rows = Object.entries(reportData.daily).map(([date, amount]) => {
                if (date === selectedDate) {
                    totalAmount += amount; // Sum the amounts
                    return [format(new Date(date), 'MMM dd yyyy'), `${pesoSign} ${amount.toFixed(2)}`]; // Format with peso sign
                }
                return null;
            }).filter(row => row !== null);

            autoTable(doc, {
                head: [['Date', 'Amount']],
                body: rows,
                startY: 40,
            });

            // Format the total amount for daily report
            formattedTotal = `${pesoSign}${totalAmount.toFixed(2)}`;

        } else if (selectedReport === 'monthly') {
            doc.setFontSize(16);
            doc.text(`Monthly Report for ${format(new Date(new Date().getFullYear(), selectedMonth - 1), 'MMMM yyyy')}`, 14, 30);

            const rows = Object.entries(reportData.monthly).map(([month, amount]) => {
                if (month.split('-')[1] === selectedMonth.toString()) {
                    totalAmount += amount; // Sum the amounts
                    return [format(new Date(month + '-01'), 'MMMM yyyy'), `${pesoSign}${amount.toFixed(2)}`]; // Format with peso sign
                }
                return null;
            }).filter(row => row !== null);

            autoTable(doc, {
                head: [['Month', 'Amount']],
                body: rows,
                startY: 40,
            });

            // Format the total amount for monthly report
            formattedTotal = `${pesoSign}${totalAmount.toFixed(2)}`;

        } else if (selectedReport === 'yearly') {
            doc.setFontSize(16);
            doc.text(`Yearly Report for ${selectedYear}`, 14, 30);

            totalAmount = reportData.yearly[selectedYear] || 0; // Get total for the year
            formattedTotal = `${pesoSign} ${totalAmount.toFixed(2)}`; 
            const rows = [[selectedYear, formattedTotal]];

            autoTable(doc, {
                head: [['Year', 'Total Amount']],
                body: rows,
                startY: 40,
            });
        }

        // Add total amount section
        doc.setFontSize(14);
        doc.text(`Total Amount: ${formattedTotal}`, 14, doc.lastAutoTable.finalY + 10); // Use formatted total

        doc.save('Appointments_Report.pdf');
    };










    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="">
            <ReportMenu />
            <div className="rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-green-400 p-4">Income Report</h1>

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
                        <h2 className="text-xl font-semibold mb-2">Daily Report for {format(new Date(selectedDate), 'MMM dd yyyy')}</h2>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-accent">
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(reportData.daily).map(([day, amount]) => {
                                    if (day === selectedDate) {
                                        return (
                                            <tr key={day} className="hover:bg-green-400 hover:text-black">
                                                <td className="border px-4 py-2">{format(new Date(day), 'MMM dd yyyy')}</td>
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
                        <h2 className="text-xl font-semibold mb-2">Monthly Report for {format(new Date(new Date().getFullYear(), selectedMonth - 1), 'MMMM')}</h2>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr className="bg-accent">
                                    <th className="border px-4 py-2">Month</th>
                                    <th className="border px-4 py-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(reportData.monthly).map(([month, amount]) => {
                                    if (month.split('-')[1] === selectedMonth.toString()) {
                                        return (
                                            <tr key={month} className="hover:bg-green-400 hover:text-black">
                                                <td className="border px-4 py-2">{format(new Date(month + '-01'), 'MMMM yyyy')}</td>
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
                                    <th className="border px-4 py-2">Year</th>
                                    <th className="border px-4 py-2">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={selectedYear} className="hover:bg-green-400 hover:text-black">
                                    <td className="border px-4 py-2">{selectedYear}</td>
                                    <td className="border px-4 py-2">
                                        ₱{reportData.yearly[selectedYear] || 0}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr className="bg-accent">
                                    <td className="border px-4 py-2 font-bold">Total</td>
                                    <td className="border px-4 py-2 font-bold">
                                        ₱{reportData.yearly[selectedYear] || 0}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </>
                )}

                {/* Download PDF Button */}
                <button
                    className="mt-4 bg-purple-500 text-white py-2 px-4 rounded"
                    onClick={generatePDF}
                >
                    Generate PDF
                </button>
            </div>
        </div>
    );
};

export default AppointmentsReport;
