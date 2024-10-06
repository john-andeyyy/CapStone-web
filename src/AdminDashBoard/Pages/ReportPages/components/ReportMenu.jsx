import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ReportMenu() {
    const navigate = useNavigate()
    return (
        <div className='flex justify-between '>
            <button onClick={() => navigate('/Total_procedures')}>Procedure Reports.</button>
        </div>
    )
}
