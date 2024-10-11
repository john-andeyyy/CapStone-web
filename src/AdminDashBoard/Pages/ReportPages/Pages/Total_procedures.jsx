import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import jsPDF from 'jspdf'; // For generating PDFs
import 'jspdf-autotable'; // For creating tables in PDFs
import { PieChart } from '@mui/x-charts/PieChart';
import ReportMenu from '../components/ReportMenu';

export default function TotalProcedures() {
    const [procedureReport, setProcedureReport] = useState({});
    const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
    const [currentYear, setCurrentYear] = useState(dayjs().year());
    const [selectedYear, setSelectedYear] = useState('');
    const BASEURL = import.meta.env.VITE_BASEURL;

    useEffect(() => {
        const fetchApprovedAppointments = async () => {
            try {
                const response = await axios.get(`${BASEURL}/Appointments/appointments/filter/CompletedOnly`);
                const appointments = response.data;

                const report = {};

                // Iterate through each appointment
                appointments.forEach(appointment => {
                    const year = dayjs(appointment.date).year();
                    const month = dayjs(appointment.date).format('YYYY-MM');

                    if (year === currentYear && month === currentMonth.format('YYYY-MM')) {
                        appointment.procedures.forEach(procedure => {
                            const procedureName = procedure.name;

                            if (!report[month]) {
                                report[month] = {};
                            }
                            if (!report[month][procedureName]) {
                                report[month][procedureName] = 0;
                            }

                            report[month][procedureName] += 1;
                        });
                    }
                });

                setProcedureReport(report);
            } catch (error) {
                console.error('Error fetching approved appointments:', error);
            }
        };

        fetchApprovedAppointments();
    }, [currentMonth, currentYear]);

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
        }
    };

    const handleToday = () => {
        const today = dayjs();
        setCurrentMonth(today.startOf('month'));
        setCurrentYear(today.year());
        setSelectedYear('');
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
        const selectedMonth = currentMonth.format('YYYY-MM');
        if (procedureReport[selectedMonth]) {
            for (const procedureName in procedureReport[selectedMonth]) {
                data.push([procedureName, procedureReport[selectedMonth][procedureName]]);
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

        doc.save(`Total_Procedures_${selectedMonth}.pdf`);
    };

    const formattedMonth = currentMonth.format('MMMM YYYY');
    const currentReport = procedureReport[currentMonth.format('YYYY-MM')] || {};
    const isToday = currentMonth.isSame(dayjs().startOf('month'), 'month') && currentYear === dayjs().year();

    const pieChartData = Object.entries(currentReport).map(([procedureName, count], index) => ({
        id: index,
        value: count,
        label: procedureName,
    }));

    return (
        <div className="overflow-x-auto">
            <ReportMenu />
            <div className="p-6 rounded-lg shadow-md">
                <h1 className="text-2xl text-green-500 font-bold p-4">Total Procedures Done in {formattedMonth}</h1>

                <div className='flex flex-col sm:flex-row justify-between items-end pb-5'>
                    <div>
                        <div className="pb-7 flex flex-col sm:flex-row items-center space-x-0 sm:space-x-3">
                            <div className="ml-4 inline-block">
                                <label htmlFor="year" className="mr-2 font-semibold">Select Year:</label>
                                <select id="year" value={selectedYear} onChange={handleYearChange} className="p-2 border rounded">
                                    <option value="">--Current Year--</option>
                                    {[...Array(101).keys()].map((i) => {
                                        const yearValue = new Date().getFullYear() - i;
                                        return (
                                            <option key={yearValue} value={yearValue}>
                                                {yearValue}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <button onClick={handlePrevMonth} className="mr-2 mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                                Previous Month
                            </button>
                            <button onClick={handleNextMonth} className="mr-2 mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                                Next Month
                            </button>
                            {!isToday && (
                                <button onClick={handleToday} className="mr-2 mt-2 sm:mt-0 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200">
                                    Today
                                </button>
                            )}
                            <button onClick={saveAsPDF} className="mt-2 sm:mt-0 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
                                Save as PDF
                            </button>
                        </div>
                    </div>

                    {/* Responsive Pie Chart */}
                    <div className="mt-4 sm:mt-0 bg-green-300 py-3 rounded-xl hidden sm:block lg:block ">
                        <PieChart
                            series={[{ data: pieChartData, color: 'white' }]}
                            width={500} 
                            height={200}
                        />
                    </div>

                </div>

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
                                <td colSpan="2" className="py-2 px-4 text-center">No procedures recorded for this month.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
