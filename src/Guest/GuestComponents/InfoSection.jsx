import React from 'react';

function InfoSection() {
    return (
        <div>
            <h1 className="text-5xl font-bold pt-2 text-center">Visit our Dental <span className='text-green-400'>Clinic</span></h1>

            <div className=" py-8">
    
                <div className="max-w-5xl mx-auto border border-green-400 p-8 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-green-500 mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7-9 7-9-7zm0 11l9 7 9-7m-9 7V10" />
                            </svg>
                            <h2 className="font-bold text-lg">Address</h2>
                            <p>58 Peso St. Saint Michael, Brgy. Pandayan, Meycauayan City, Bulacan</p>
                        </div>
                        <div className="flex flex-col items-center text-center border-l border-r border-green-400 px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-green-500 mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h5v2H3v-2zM4 3a1 1 0 000 2h16a1 1 0 100-2H4zM4 5h16v12H4V5zm1 2h14v8H5V7z" />
                            </svg>
                            <h2 className="font-bold text-lg">Phone</h2>
                            <p>0956 056 8825</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-green-500 mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.11 0-2 .9-2 2h-2c0-2.22 1.79-4 4-4V4l4 4-4 4V8zm0 4c1.11 0 2-.9 2-2h2c0 2.22-1.79 4-4 4v2l-4-4 4-4v2z" />
                            </svg>
                            <h2 className="font-bold text-lg">Hours</h2>
                            <p>Weekdays: 10am–7pm</p>
                            <p>Weekend: 11am–6pm</p>
                        </div>
                    </div>
                </div>
                <div className='text-center py-7'>
                    <button className="btn btn-primary bg-green-400 border-none text-white">Request Appointment</button>
    
                </div>
            </div>
            
        </div>
        );
}

export default InfoSection;
