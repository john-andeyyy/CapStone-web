import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChart from '../../../Charts/BarChart';
import ReportMenu from '../components/ReportMenu';
import { PDFPatientVisit } from '../../../Component_Functions/PDFReport';

export default function Patient_Visits() {
    const BASEURL = import.meta.env.VITE_BASEURL;
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [years, setYears] = useState([]);
    const [visitCounts, setVisitCounts] = useState({
        today: 0,
        week: 0,
        month: 0,
        year: 0,
    });
    const [period, setPeriod] = useState('month');
    const [filteredReportData, setFilteredReportData] = useState([]);
    const [reportTitle, setReportTitle] = useState('Patient Visits Report'); // New state for the title

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(`${BASEURL}/Appointments/appointments/filter/CompletedOnly`);
                setAppointments(response.data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [BASEURL]);


    useEffect(() => {
        if (appointments.length > 0) {
            const uniqueYears = [...new Set(appointments.map(app => new Date(app.date).getFullYear()))];
            setYears(uniqueYears);
            filterReportData(appointments); // Filter data based on the selected period
        }
    }, [appointments, selectedYear, selectedMonth, period]);

    useEffect(() => {
        // Calculate visit counts based on filtered data whenever it changes
        calculateVisitCounts(filteredReportData);
    }, [filteredReportData]);

    const calculateVisitCounts = (filteredAppointments) => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        let todayCount = 0;
        let weekCount = 0;
        let monthCount = 0;
        let yearCount = 0;

        filteredAppointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.date);
            if (appointmentDate.toDateString() === today.toDateString()) {
                todayCount++;
            }
            if (appointmentDate >= startOfWeek) {
                weekCount++;
            }
            if (appointmentDate >= startOfMonth) {
                monthCount++;
            }
            if (appointmentDate >= startOfYear) {
                yearCount++;
            }
        });

        setVisitCounts({ today: todayCount, week: weekCount, month: monthCount, year: yearCount });
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [dateselected, setdateselected] = useState(null);
    const filterReportData = (appointments) => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
        const startOfYear = new Date(selectedYear, 0, 1);

        const filteredData = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);

            if (period === 'today') {
                return appointmentDate.toDateString() === today.toDateString();
            }

            if (period === 'week') {
                return appointmentDate >= startOfWeek && appointmentDate <= today;
            }

            if (period === 'month') {
                return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
            }

            if (period === 'year') {
                // Set dateselected to just the year.
                setdateselected(selectedYear); // Store just the selected year.
                return appointmentDate >= startOfYear && appointmentDate <= new Date(selectedYear + 1, 0, 0);
            }

            if (period === 'selectedDate') {
                return appointmentDate.toDateString() === dateselected?.toDateString();
            }

            return false;
        });

        console.log('Filtered Report Data:', filteredData); // Log filtered data
        setFilteredReportData(filteredData);
    };

    const getMonthChartData = () => {
        const visitsByWeek = [];
        const monthDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth, monthDays);
        const weekCounts = Math.ceil(monthDays / 7); // Calculate total weeks in the month

        for (let week = 0; week < weekCounts; week++) {
            const weekStart = new Date(startOfMonth);
            weekStart.setDate(weekStart.getDate() + week * 7); // Start of the week

            const weekEnd = new Date(startOfMonth);
            weekEnd.setDate(weekEnd.getDate() + (week + 1) * 7 - 1); // End of the week

            // Ensure we don't exceed the month
            if (weekEnd > endOfMonth) {
                weekEnd.setDate(monthDays); // Adjust to the last day of the month
            }

            // Count appointments in the current week
            const weekVisits = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.date);
                return appointmentDate >= weekStart && appointmentDate <= weekEnd;
            }).length;
            console.log('visitsByWeek', visitsByWeek)
            visitsByWeek.push(weekVisits);
        }

        const labels = Array.from({ length: weekCounts }, (_, i) => `Week ${i + 1}`);

        return {
            labels,
            datasets: [{
                label: 'Visits per Week',
                data: visitsByWeek,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }],
        };
    };

    const getYearChartData = () => {
        const visitsByMonth = new Array(12).fill(0);

        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.date);
            const monthIndex = appointmentDate.getMonth();
            if (appointmentDate.getFullYear() === selectedYear) {
                visitsByMonth[monthIndex]++;
            }
        });

        const labels = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];

        return {
            labels,
            datasets: [{
                label: 'Visits per Month',
                data: visitsByMonth,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }],
        };
    };

    const patientVisits = filteredReportData.reduce((acc, appointment) => {
        const patientId = appointment.patient._id;
        const date = new Date(appointment.date);

        if (!acc[patientId]) {
            acc[patientId] = {
                id: patientId,
                name: `${appointment.patient.FirstName} ${appointment.patient.MiddleName || ''} ${appointment.patient.LastName}`,
                lastVisit: date,
                monthYear: `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
                totalVisits: 1,
            };
        } else {
            if (date > acc[patientId].lastVisit) {
                acc[patientId].lastVisit = date;
                acc[patientId].monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            }
            acc[patientId].totalVisits += 1;
        }
        return acc;
    }, {});

    const reportData = Object.values(patientVisits).map((visit) => ({
        ...visit,
        lastVisit: visit.lastVisit.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
    })).sort((a, b) => {
        const lastNameA = a.name.split(' ').slice(-1)[0].toLowerCase();
        const lastNameB = b.name.split(' ').slice(-1)[0].toLowerCase();
        return lastNameA.localeCompare(lastNameB);
    });

    // Update the report title whenever the period changes
    useEffect(() => {
        const titles = {
            today: 'Patient Visits Today',
            week: 'Patient Visits This Week',
            month: `Patient Visits in ${new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} ${selectedYear}`,
            year: `Patient Visits in ${selectedYear}`,
        };
        setReportTitle(titles[period]);
    }, [period, selectedYear, selectedMonth]);

    return (
        <div className=" rounded-lg shadow-md">
            <ReportMenu />
            <h2 className="text-2xl font-bold  p-4 text-green-500">Patient Visits Report</h2>
            <div className="flex space-x-5 mb-4">
                <button onClick={() => setPeriod('today')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                    Today Visits
                </button>
                <button onClick={() => setPeriod('week')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
                    This Week Visits
                </button>
                {/* <button onClick={() => setPeriod('month')} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition duration-200">
                    This Month Visits
                </button> */}

                <input
                    type="month"
                    id="month"
                    value={`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`} // Set the value to the selected year and month
                    onChange={(e) => {
                        const [year, month] = e.target.value.split('-');
                        setSelectedYear(Number(year));
                        setSelectedMonth(Number(month) - 1); // Convert month back to 0-indexed
                    }}
                    className="w-full sm:w-auto p-2 border rounded shadow-sm"
                />


                <button onClick={() => setPeriod('year')} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200">
                    This Year Visits
                </button>


                <PDFPatientVisit
                    appointments={reportData}
                    title={
                        dateselected
                            ? `Patient Visits in ${dateselected}` // Directly use the year value.
                            : `Patient Visits in ${selectedYear}` // Default to selected year if dateselected is null.
                    }
                />

            </div>

            {period == 'year' && (

                <div className="py-3">
                    <div className="w-1/2"> {/* Set width to 50% or adjust as needed */}
                        <label htmlFor="year-selector" className="block text-sm font-medium text-gray-700">Select Year:</label>
                        <select
                            id="year-selector"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="mt-1 p-2 block border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

            )}

            <p className="text-xl font-bold mb-4 ">{reportTitle}</p>

            <div className="p-4 my-5 bg-green-500 rounded-md shadow-md text-center">
                <p className="text-white text-lg font-semibold">
                    Total Visits: <strong>{visitCounts[period]}</strong>
                </p>
            </div>


            {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
            ) : (
                <>
                    <div className="overflow-x-auto pb-8">
                        {reportData.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className='bg-green-500 text-white'>
                                        <th className="py-2 px-4 border-b text-left text-sm font-medium ">ID</th>
                                        <th className="py-2 px-4 border-b text-left text-sm font-medium ">Name</th>
                                        <th className="py-2 px-4 border-b text-left text-sm font-medium ">Last Visit</th>
                                        <th className="py-2 px-4 border-b text-left text-sm font-medium ">Visit (Month Year)</th>
                                        <th className="py-2 px-4 border-b text-left text-sm font-medium ">Total Visits</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((visit) => (
                                        <tr key={visit.id} className="transition bg-accent hover:bg-secondary">
                                            <td className="py-2 px-4 border-b">{visit.id}</td>
                                            <td className="py-2 px-4 border-b">{visit.name}</td>
                                            <td className="py-2 px-4 border-b">{visit.lastVisit}</td>
                                            <td className="py-2 px-4 border-b">{visit.monthYear}</td>
                                            <td className="py-2 px-4 border-b">{visit.totalVisits}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center text-gray-600">No completed visits found.</div>
                        )}
                    </div>

                    <div className=''>
                        {period === 'month' && (
                            <>
                                {/* <h3 className="text-xl font-bold mb-4 text-green-500">Visits per Week in {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })}</h3>
                                    <div className="mb-6">
                                        <BarChart chartData={getMonthChartData()} />
                                    </div> */}
                            </>
                        )}
                        {period === 'year' && (
                            <>
                                <h3 className="text-xl font-bold mb-4 text-green-500">Visits per Month in {selectedYear}</h3>
                                <div className="mb-6 ">
                                    <BarChart chartData={getYearChartData()} />
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
