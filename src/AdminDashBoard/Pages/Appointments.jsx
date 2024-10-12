import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { axisClasses } from '@mui/x-charts';
import { showToast } from '../Components/ToastNotification';

export default function Appointments() {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('Pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewType, setViewType] = useState('current');
    const [timeView, setTimeView] = useState('day'); // New state to track day, week, month view
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
    const [selectedWeek, setSelectedWeek] = useState(new Date()); // State for selected week
    const [selectedMonth, setSelectedMonth] = useState(new Date()); // State for selected month
    const [loadingApprove, setLoadingApprove] = useState({});
    const [loadingReject, setLoadingReject] = useState({});
    const today = () => {
        setViewType('current')
        setTimeView('day')
        setSelectedDate(new Date())
        setSelectedWeek(new Date())
        setSelectedMonth(new Date())
        filterAppointments(appointments);
    }


    useEffect(() => {
        const getAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BASEURL}/Appointments/appointments/filter`, {
                    withCredentials: true
                });

                if (response.status === 200) {
                    setAppointments(response.data);
                    filterAppointments(response.data); // Filter appointments based on the view type
                }
            } catch (error) {
                setError('Error fetching appointments. Please try again.');
                console.error('Error fetching appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        getAppointments();
    }, [BASEURL]);

    const filterAppointments = (appointments) => {
        let filtered = [];

        if (viewType === 'current') {
            filtered = appointments.filter(app => new Date(app.start) >= new Date());
            filtered.sort((a, b) => new Date(a.start) - new Date(b.start));
        } else {
            filtered = appointments;
            filtered.sort((a, b) => new Date(b.start) - new Date(a.start));
        }

        filtered = filterByTimePeriod(filtered);

        const statusFiltered = filtered.filter(app => app.status === selectedStatus || selectedStatus === '');

        setFilteredAppointments(statusFiltered);
    };

    const filterByTimePeriod = (appointments) => {
        let filtered = [];
        if (timeView === 'day') {
            const selectedDayStart = new Date(selectedDate);
            selectedDayStart.setHours(0, 0, 0, 0); // Set to start of the day

            const selectedDayEnd = new Date(selectedDate);
            selectedDayEnd.setHours(23, 59, 59, 999); // Set to end of the day

            filtered = appointments.filter(app => {
                const appDate = new Date(app.start);
                return appDate >= selectedDayStart && appDate <= selectedDayEnd;
            });
        } else if (timeView === 'week') {
            const startOfWeek = new Date(selectedWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay()));
            const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
            filtered = appointments.filter(app => {
                const appDate = new Date(app.start);
                return appDate >= startOfWeek && appDate <= endOfWeek;
            });
        } else if (timeView === 'month') {
            const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
            const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
            filtered = appointments.filter(app => {
                const appDate = new Date(app.start);
                return appDate >= startOfMonth && appDate <= endOfMonth;
            });
        } else {
            filtered = appointments;
        }

        return filtered;
    };

    useEffect(() => {
        filterAppointments(appointments);
    }, [selectedStatus, appointments, viewType, timeView, selectedDate, selectedWeek, selectedMonth]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg text-red-500">{error}</div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Rejected':
            case 'Missed':
                return 'text-red-500';
            case 'Completed':
            case 'Pending':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };
    const disabledStatuses = ["Approved", "Rejected", "Missed", "Completed", "Cancelled"];

    const getRelativeTime = (date) => {
        const now = new Date();
        const diffInTime = now - date;
        const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return { text: "Today", color: "text-green-500" };
        } else if (diffInDays === 1) {
            return { text: "Yesterday", color: "text-gray-500" };
        } else if (diffInDays > 1) {
            return { text: `${diffInDays} days ago`, color: "text-gray-500" };
        } else {
            return { text: "Incoming", color: "text-blue-500" };
        }
    };


    const updateAppointmentStatus = async (app_id, newStatus) => {
        try {
            if (newStatus === 'Approved') {
                setLoadingApprove(prev => ({ ...prev, [app_id]: true }));
            } else if (newStatus === 'Rejected') {
                setLoadingReject(prev => ({ ...prev, [app_id]: true }));
            }

            const response = await axios.put(
                `${BASEURL}/Appointments/admin/appointmentUpdate/${app_id}`,
                { newStatus: newStatus },
                { withCredentials: true }
            );

            if (response.status === 200) {
                showToast('success', `Appointment: ${newStatus} `);

                console.log("Appointment status updated successfully");

                setAppointments(prevAppointments => {
                    return prevAppointments.map(app =>
                        app.id === app_id ? { ...app, status: newStatus } : app
                    );
                });
            }
        } catch (error) {
            console.error("Error updating appointment status:", error);
        } finally {
            if (newStatus === 'Approved') {
                setLoadingApprove(prev => ({ ...prev, [app_id]: false }));
            } else if (newStatus === 'Rejected') {
                setLoadingReject(prev => ({ ...prev, [app_id]: false }));
            }
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Appointment Requests</h1>
            <div className="text-gray-600 mb-8">{formattedDate}</div>

            <div className="mb-4 text-white">
                <button onClick={() => setViewType('current')} className={`p-2 ${viewType === 'current' ? 'bg-green-500 text-white' : 'bg-green-900'}`}>
                    Current & Upcoming
                </button>
                <button onClick={() => {
                    setViewType('all')
                    setTimeView('')
                }} className={`p-2 ${viewType === 'all' ? 'bg-green-500 text-white' : 'bg-green-900'}`}>
                    All Appointments
                </button>
            </div>

            {/* Time View Selectors */}
            <div className="mb-4 text-white">
                <button onClick={() => setTimeView('day')} className={`p-2 ${timeView === 'day' ? 'bg-green-500 text-white' : 'bg-green-900'}`}>
                    Day
                </button>
                <button onClick={() => setTimeView('week')} className={`p-2 ${timeView === 'week' ? 'bg-green-500 text-white' : 'bg-green-900'}`}>
                    Week
                </button>
                <button onClick={() => setTimeView('month')} className={`p-2 ${timeView === 'month' ? 'bg-green-500 text-white' : 'bg-green-900'}`}>
                    Month
                </button>
                <button
                    onClick={() => {
                        today()
                    }}
                    className="p-2 bg-blue-500 text-white mb-4 rounded"
                >
                    Today
                </button>


            </div>

            {/* Day Picker */}
            {/* Day Picker */}
            {timeView === 'day' && (
                <div className="mb-4">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="MMMM d, yyyy"
                        className="p-2 border rounded"
                        filterDate={date => {
                            const today = new Date();
                            return (viewType !== 'current' && viewType !== 'upcoming') || date >= today;
                        }}
                    />
                </div>
            )}


            {/* Week Picker */}
            {timeView === 'week' && (
                <div className="mb-4">
                    <button onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() - 7)))} className="p-2 bg-green-500 text-white">
                        Prev Week
                    </button>
                    <span className="p-2">
                        {new Date(selectedWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay())).toDateString()} - {new Date(selectedWeek.setDate(selectedWeek.getDate() + 6)).toDateString()}
                    </span>
                    <button onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() + 7)))} className="p-2 bg-green-500 text-white">
                        Next Week
                    </button>
                </div>
            )}

            {/* Month Picker */}
            {timeView === 'month' && (
                <div className="mb-4">
                    <DatePicker
                        selected={selectedMonth}
                        onChange={(date) => setSelectedMonth(date)}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        className="p-2 border rounded"
                    />
                </div>
            )}

            {/* Appointment List */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Appointment Requests List</h2>
                <div className="mb-4">
                    <select
                        className="p-2 border rounded"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">View All</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Missed">Missed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {filteredAppointments.length === 0 ? (
                        <div className="text-center">
                            <h1>No {selectedStatus} appointments</h1>
                        </div>
                    ) : (
                        <div className="overflow-auto max-h-screen">
                            {filteredAppointments.map(appointment => {
                                const appointmentDateTime = new Date(appointment.start);
                                const appointmentEndTime = new Date(appointment.end);

                                if (isNaN(appointmentDateTime.getTime()) || isNaN(appointmentEndTime.getTime())) {
                                    return <span key={appointment.id} className="text-red-500">Invalid Date</span>;
                                }

                                const { text: relativeTime, color: relativeColor } = getRelativeTime(appointmentDateTime);
                                const isApproveDisabled = disabledStatuses.includes(appointment.status) || appointmentDateTime < currentDate;
                                const isDeclineDisabled = appointment.status !== "Pending" || appointmentDateTime < currentDate;

                                return (
                                    <div key={appointment.id} className="p-4 my-1 bg-base-200 rounded flex justify-between items-center">
                                        <div>
                                            <div className="font-semibold">
                                                {appointmentDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} -
                                                {appointmentEndTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })},
                                                {appointmentDateTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>

                                            <div className="text-gray-600">
                                                {appointment.patient.FirstName} {appointment.patient.LastName}
                                            </div>

                                            <div>
                                                {appointment.procedures.length > 0
                                                    ? appointment.procedures[0].name
                                                    : 'No procedure listed'}
                                            </div>
                                            <div className="text-gray-600">
                                                <p>
                                                    <strong>Status: </strong>
                                                    <span className={getStatusColor(appointment.status)}>
                                                        {appointment.status}
                                                    </span>
                                                </p>
                                                <p className={`text-sm ${relativeColor}`}>
                                                    {relativeTime}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 items-center">
                                            <button
                                                onClick={() => updateAppointmentStatus(appointment.id, 'Approved')}
                                                disabled={isApproveDisabled || loadingApprove[appointment.id]} // Disable when approving
                                                className={`p-2 px-3 rounded-2xl ${isApproveDisabled || loadingApprove[appointment.id] ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
                                            >
                                                {loadingApprove[appointment.id] ? (
                                                    <span className="loading loading-spinner"></span> // Show spinner when approving
                                                ) : (
                                                    <span className="material-symbols-outlined text-white text-2xl">check_box</span>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => updateAppointmentStatus(appointment.id, 'Rejected')}
                                                disabled={isDeclineDisabled || loadingReject[appointment.id]} // Disable when rejecting
                                                className={`p-2 px-3 rounded-2xl ${isDeclineDisabled || loadingReject[appointment.id] ? "bg-gray-400 cursor-not-allowed" : "bg-red-600"}`}
                                            >
                                                {loadingReject[appointment.id] ? (
                                                    <span className="loading loading-spinner"></span> // Show spinner when rejecting
                                                ) : (
                                                    <span className="material-symbols-outlined text-white text-2xl">cancel</span>
                                                )}
                                            </button>


                                            <Link to={`/appointment/${appointment.id}`} className="p-2 bg-green-500 text-white rounded">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
