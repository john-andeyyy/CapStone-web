import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import the autoTable function

// PDFReport component
const PDFReport = ({ appointments, month, title }) => {
    // Calculate completed and missed counts
    const completedCount = appointments.filter(appointment => appointment.status === 'Completed').length;
    const missedCount = appointments.filter(appointment => appointment.status === 'Missed').length;

    const saveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(title || 'Total Appointments Report', 14, 16);

        const formattedMonth = month === new Date().toISOString().slice(0, 7) ? "Current Month" : month;
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Month: ${formattedMonth}`, 14, 24);
        doc.setLineWidth(0.5);
        doc.line(14, 26, 196, 26);

        // Display counts of completed and missed appointments
        let yPosition = 30; // Initial Y position for text
        if (completedCount > 0) {
            doc.text(`Completed Appointments: ${completedCount}`, 14, yPosition);
            yPosition += 10; // Increment Y position for the next text
        }

        if (missedCount > 0) {
            doc.text(`Missed Appointments: ${missedCount}`, 14, yPosition);
            yPosition += 10; // Increment Y position for the next text
        }

        // Prepare data for the table
        const data = appointments.map(appointment => [
            `${appointment.patient.LastName} ${appointment.patient.FirstName}`,
            appointment.status,
            new Date(appointment.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        ]);

        // Generate the table
        autoTable(doc, {
            startY: yPosition, // Start below the counts
            head: [['Patient Name', 'Status', 'Date']],
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

        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} of ${pageCount}`, 190, 290, null, null, 'right');
        }

        // Save the PDF
        doc.save(`${title || 'Monthly_Appointments_Report'}.pdf`);
    };

    return (
        <div>
            <button onClick={saveAsPDF} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200">
                Generate PDF
            </button>
        </div>
    );
};

const PDFPatientVisit = ({ appointments, title }) => {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text(title || 'Patient Visits Report', 14, 20); // Default title if none provided

        // Define columns for the table
        const columns = [
            { header: 'ID', dataKey: 'id' },
            { header: 'Name', dataKey: 'name' },
            { header: 'Last Visit', dataKey: 'lastVisit' },
            { header: 'Visit (Month Year)', dataKey: 'monthYear' },
            { header: 'Total Visits', dataKey: 'totalVisits' },
        ];

        // Create rows from the appointments data
        const rows = appointments.map(appointment => ({
            id: appointment.id, // Directly using id
            name: appointment.name, // Directly using name
            lastVisit: appointment.lastVisit, // Directly using lastVisit
            monthYear: appointment.monthYear, // Directly using monthYear
            totalVisits: appointment.totalVisits, // Directly using totalVisits
        }));

        // Check if rows have data
        if (rows.length === 0) {
            doc.text('No data available', 14, 40);
        } else {
            // Add the table to the PDF
            autoTable(doc, {
                columns,
                body: rows,
                startY: 30,
            });
        }

        // Save the PDF
        doc.save(`${title || 'Patient_Visits_Report'}.pdf`);
    };

    return (
        <button
            onClick={generatePDF}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200">
Generate PDF
        </button>
    );
};



// Export components
export { PDFReport, PDFPatientVisit };
