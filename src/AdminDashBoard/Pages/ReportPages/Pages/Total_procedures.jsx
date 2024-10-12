import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PieChart from '../../../Charts/PieChart';
import ReportMenu from '../components/ReportMenu';

export default function TotalProcedures() {
    const [procedureReport, setProcedureReport] = useState({});
    const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
    const [currentYear, setCurrentYear] = useState(dayjs().year());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isYearView, setIsYearView] = useState(false);
    const BASEURL = import.meta.env.VITE_BASEURL;
    const [years, setYears] = useState([]);
    const [appointmentsData, setappointmentsData] = useState();


    useEffect(() => {
        if (Array.isArray(appointmentsData) && appointmentsData.length > 0) {
            const uniqueYears = [...new Set(appointmentsData.map(app => new Date(app.date).getFullYear()))];
            uniqueYears.sort((a, b) => b - a);
            setYears(uniqueYears);
        }
    }, [appointmentsData]);


    useEffect(() => {
        const fetchApprovedAppointments = async () => {
            try {
                const response = await axios.get(`${BASEURL}/Appointments/appointments/filter/CompletedOnly`);
                const appointments = response.data;
                setappointmentsData(appointments)
                const report = {};

                // Iterate through each appointment
                appointments.forEach(appointment => {
                    const appointmentYear = dayjs(appointment.date).year();
                    const appointmentMonth = dayjs(appointment.date).format('YYYY-MM');

                    // Check if appointment should be included based on view
                    if (isYearView ? appointmentYear === currentYear : appointmentYear === currentYear && appointmentMonth === currentMonth.format('YYYY-MM')) {
                        const monthKey = isYearView ? appointmentMonth.substring(0, 7) : appointmentMonth; // Use month key if in year view
                        appointment.procedures.forEach(procedure => {
                            const procedureName = procedure.name;

                            if (!report[monthKey]) {
                                report[monthKey] = {};
                            }
                            if (!report[monthKey][procedureName]) {
                                report[monthKey][procedureName] = 0;
                            }

                            report[monthKey][procedureName] += 1;
                        });
                    }
                });

                // If in year view, aggregate data across months
                if (isYearView) {
                    const aggregatedReport = {};
                    for (const month in report) {
                        for (const procedureName in report[month]) {
                            if (!aggregatedReport[procedureName]) {
                                aggregatedReport[procedureName] = 0;
                            }
                            aggregatedReport[procedureName] += report[month][procedureName];
                        }
                    }
                    setProcedureReport({ [currentYear]: aggregatedReport });
                } else {
                    setProcedureReport(report);
                }
            } catch (error) {
                console.error('Error fetching approved appointments:', error);
            }
        };

        fetchApprovedAppointments();
    }, [currentMonth, currentYear, isYearView]);

    const handlePrevMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
        setCurrentYear(currentMonth.subtract(1, 'month').year());
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
        setCurrentYear(currentMonth.add(1, 'month').year());
    };

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
        if (year) {
            setCurrentYear(Number(year));
            setCurrentMonth(dayjs().year(Number(year)).startOf('month'));
            setIsYearView(true);
        }
    };

    const handleToday = () => {
        const today = dayjs();
        setCurrentMonth(today.startOf('month'));
        setCurrentYear(today.year());
        setSelectedYear('');
        setIsYearView(false);
    };

    const saveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Total Procedures Report', 14, 16);
        const formattedMonth = currentMonth.format('MMMM YYYY');
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Month: ${formattedMonth}`, 14, 24);
        doc.setLineWidth(0.5);
        doc.line(14, 26, 196, 26);

        const data = [];
        const selectedKey = isYearView ? currentYear : currentMonth.format('YYYY-MM');
        if (procedureReport[selectedKey]) {
            for (const procedureName in procedureReport[selectedKey]) {
                data.push([procedureName, procedureReport[selectedKey][procedureName]]);
            }
        }

        doc.autoTable({
            startY: 30,
            head: [['Procedure Name', 'Count']],
            body: data,
            theme: 'grid',
            headStyles: {
                fillColor: [22, 160, 133],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 12,
            },
            bodyStyles: {
                fontSize: 10,
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.1,
            margin: { top: 10 },
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save(`Total_Procedures_${selectedKey}.pdf`);
    };

    const formattedMonth = currentMonth.format('MMMM YYYY');
    const currentReport = isYearView ? procedureReport[currentYear] || {} : procedureReport[currentMonth.format('YYYY-MM')] || {};
    const isToday = currentMonth.isSame(dayjs().startOf('month'), 'month') && currentYear === dayjs().year();

    const labels = Object.keys(currentReport);

    const primaryColors = [
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)',
    ];

    const getSoftPrimaryColors = (numColors) => {
        const colors = [];
        const availableColors = [...primaryColors];
        for (let i = 0; i < numColors; i++) {
            if (availableColors.length === 0) {
                const lastColor = colors[colors.length - 1];
                const rgb = lastColor.match(/\d+/g).map(Number);
                const newColor = `rgba(${rgb[0] + 20}, ${rgb[1] + 20}, ${rgb[2] + 20}, 0.6)`;
                colors.push(newColor);
            } else {
                const randomIndex = Math.floor(Math.random() * availableColors.length);
                colors.push(availableColors[randomIndex]);
                availableColors.splice(randomIndex, 1);
            }
        }
        return colors;
    };

    const datasets = [
        {
            label: 'Procedure Counts',
            data: Object.values(currentReport),
            backgroundColor: getSoftPrimaryColors(Object.keys(currentReport).length),
            borderColor: getSoftPrimaryColors(Object.keys(currentReport).length).map(color => color.replace(/0\.6/, '1')),
            borderWidth: 1,
        },
    ];

    return (
        <div className="">
            <ReportMenu />
            <div className=" rounded-lg shadow-md">
                <h1 className="text-2xl text-green-500 font-bold p-4">
                    Total Procedures Done {isYearView ? `in ${currentYear}` : `in ${formattedMonth}`}
                </h1>

                <div className="w-full p-4 rounded-lg overflow-y-auto">
                    <div className="pb-7 flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
                        {isYearView && (
                            <div className="inline-block">



                                <div className="w-full">
                                    {/* Full width for year selector */}
                                    <div className="mb-4 w-full">
                                        <label htmlFor="year-selector" className="block text-sm font-medium text-gray-700">Select Year:</label>
                                        <select
                                            id="year-selector"
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                        >
                                            <option value="">--Select Year--</option>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>


                        )}
                        <button onClick={() => setIsYearView(true)} className="mr-2 mt-2 sm:mt-0 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-200">
                            View Year
                        </button>
                        <button onClick={handlePrevMonth} className="mr-2 mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                            Previous Month
                        </button>
                        <button onClick={handleNextMonth} className="mr-2 mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                            Next Month
                        </button>
                        {(!isToday || isYearView) && (
                            <button onClick={handleToday} className="mr-2 mt-2 sm:mt-0 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200">
                                Today
                            </button>
                        )}
                        <button onClick={saveAsPDF} className="mt-2 sm:mt-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
                            Save as PDF
                        </button>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5">
                    {/* Left Column: Scrollable Area */}
                    <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                        <table className="min-w-full border">
                            <thead>
                                <tr className='bg-primary text-white'>
                                    <th className="py-2 px-4 border-b font-bold text-left">Procedure Name</th>
                                    <th className="py-2 px-4 border-b font-bold text-left">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(currentReport).length > 0 ? (
                                    Object.keys(currentReport).map(procedureName => (
                                        <tr key={procedureName} className="hover:bg-secondary">
                                            <td className="py-2 px-4 border-b">{procedureName}</td>
                                            <td className="py-2 px-4 border-b">{currentReport[procedureName]}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="py-2 px-4 text-center">No procedures recorded for this month/year.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Responsive Pie Chart */}
                    <div className="mt-4 sm:mt-0 bg-green-300 py-3 rounded-xl">
                        {Object.keys(currentReport).length > 0 ? (
                            <PieChart labels={labels} datasets={datasets} title={`Total Procedures Done ${isYearView ? `in ${currentYear}` : `in ${formattedMonth}`}`} />
                        ) : (
                            <div className="text-center text-gray-700">No procedures recorded for this month/year.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
