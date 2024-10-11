import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ReportMenu() {
    const navigate = useNavigate()
    return (
        <div className='flex justify-evenly '>
            <button onClick={() => navigate('/Total_procedures')}>Procedure Reports</button>
            <button onClick={() => navigate('/Report_Monthly_patient')}>Monthly/Yearly Appointment Summary</button>

        </div>
    )
}
