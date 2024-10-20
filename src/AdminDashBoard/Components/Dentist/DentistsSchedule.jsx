import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

dayjs.extend(isBetween);

const BASEURL = import.meta.env.VITE_BASEURL;

const DentistSchedule = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const [dentistName, setDentistName] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BASEURL}/dentist/appointmentlist/${id}`, { withCredentials: true });
                if (response.status === 200) {
                    const approvedAppointments = response.data.filter((appointment) => appointment.Status === 'Approved');
                    setDentistName(response.data[0]?.DentistName || 'N/A');
                    setAppointments(approvedAppointments);
                    filterAppointments(approvedAppointments, filter, selectedYear);
                } else {
                    setError('No appointments found.');
                }
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Error fetching appointments.');
            } finally {
                setLoading(false);
            }
        };
        

        fetchAppointments();
    }, [id]);

    useEffect(() => {
        filterAppointments(appointments, filter, selectedYear);
    }, [filter, customDateRange, selectedYear, appointments]);

    const filterAppointments = (appointments, selectedFilter, year) => {
        const now = dayjs();
        let filtered = appointments;

        if (year) {
            filtered = filtered.filter(appointment => dayjs(appointment.date).year() === parseInt(year, 10));
        }

        switch (selectedFilter) {
            case 'thisDay':
                filtered = filtered.filter(appointment => dayjs(appointment.date).isSame(now, 'day'));
                break;
            case 'thisWeek':
                filtered = filtered.filter(appointment => dayjs(appointment.date).isSame(now, 'week'));
                break;
            case 'thisMonth':
                filtered = filtered.filter(appointment => dayjs(appointment.date).isSame(now, 'month'));
                break;
            case 'customDate':
                const { start, end } = customDateRange;
                if (start && end) {
                    filtered = filtered.filter(appointment =>
                        dayjs(appointment.date).isBetween(dayjs(start), dayjs(end), 'day', '[]')
                    );
                } else {
                    filtered = [];
                }
                break;
            default:
                break;
        }

        setFilteredAppointments(filtered);
    };

    const handleCustomDateChange = (dates) => {
        const [start, end] = dates;
        setCustomDateRange({ start, end });
        if (start && end) {
            setFilter('customDate');
        }
    };

    const toggleDatePicker = () => {
        setShowCustomDatePicker(!showCustomDatePicker);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        setFilter(event.target.value ? 'year' : '');
    };

    const handleRowClick = (appointment) => {
        navigate(`/appointment/${appointment._id}`);
    };

    if (loading) {
        return <div className="text-center py-4">Loading appointments...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }
    return (
        <div className="px-4 py-6">
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
                Go Back
            </button>
            <div className='mb-4 space-y-3'>
                <h2 className="text-2xl font-bold text-green-600 ">Appointment Schedule</h2>
                <h3 className=' text-xl font-bold'>Dr. {DentistName}</h3>
            </div>

            <div className="mb-4">
                <label htmlFor="dateFilter" className="mr-2 font-semibold">Filter by:</label>
                <select
                    id="dateFilter"
                    value={filter}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilter(value);
                        if (value !== 'customDate') {
                            setShowCustomDatePicker(false);
                        }
                        if (value === '') {
                            setSelectedYear('');
                        }
                    }}
                    className="p-2 border rounded"
                >
                    <option value="">All Approved</option>
                    <option value="thisDay">This Day</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="year">By Year</option>
                    <option value="customDate">Custom Date</option>
                </select>

                {filter === 'year' && (
                    <div className="ml-4 inline-block">
                        <label htmlFor="year" className="mr-2 font-semibold">Select Year:</label>
                        <select id="year" value={selectedYear} onChange={handleYearChange} className="p-2 border rounded">
                            <option value="">--Select Year--</option>
                            {[...Array(101).keys()].map((i) => {
                                const yearValue = new Date().getFullYear() - i; // Create a dropdown for the last 100 years
                                return (
                                    <option key={yearValue} value={yearValue}>
                                        {yearValue}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}

                {filter === 'customDate' && (
                    <div className="mt-4">
                        <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={toggleDatePicker}
                        >
                            Select Date
                        </button>

                        {showCustomDatePicker && (
                            <div className="mt-4">
                                <label className="mr-2 font-semibold">Select Date Range:</label>
                                <DatePicker
                                    selected={customDateRange.start}
                                    onChange={handleCustomDateChange}
                                    startDate={customDateRange.start}
                                    endDate={customDateRange.end}
                                    selectsRange
                                    inline
                                    className="p-2 border rounded"
                                    todayButton="Today"
                                />
                                {customDateRange.start && customDateRange.end && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Selected Range: {dayjs(customDateRange.start).format('MMM D, YYYY')} - {dayjs(customDateRange.end).format('MMM D, YYYY')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {filteredAppointments.length ? (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="py-2 px-4 border-b border-gray-300">Date</th>
                            <th className="py-2 px-4 border-b border-gray-300">Start</th>
                            <th className="py-2 px-4 border-b border-gray-300">End</th>
                            <th className="py-2 px-4 border-b border-gray-300">Patient Name</th>
                            <th className="py-2 px-4 border-b border-gray-300">Procedure</th>
                            {/* <th className="py-2 px-4 border-b border-gray-300">Status</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map((appointment) => (
                            <tr
                                key={appointment._id}
                                className="hover:bg-secondary cursor-pointer"
                                onClick={() => handleRowClick(appointment)}
                            >
                                <td className="py-2 px-4 border-b border-gray-300">
                                    {dayjs(appointment.date).format('MMMM D, YYYY')}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    {dayjs(appointment.Start).format('h:mm A')}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    {dayjs(appointment.End).format('h:mm A')}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300">{`${appointment.patient.FirstName} ${appointment.patient.LastName}`}</td>
                                <td className="py-2 px-4 border-b border-gray-300">
                                    {appointment.procedures.map(proc => proc.Procedure_name).join(', ')}
                                </td>
                                {/* <td className="py-2 px-4 border-b border-gray-300">{appointment.Status}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center text-gray-500">
                    {filter === 'customDate' ? (
                        <p>Please select a custom date range to view appointments.</p>
                    ) : (
                        <p>No approved appointments found for the selected filters.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DentistSchedule;
