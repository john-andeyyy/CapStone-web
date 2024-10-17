import React, { useEffect, useState } from 'react';

export default function OurService() {
    const [procedures, setProcedures] = useState([]);
    const BASEURL = import.meta.env.VITE_BASEURL;

    const proceduresApiUrl = `${BASEURL}/Procedure/showwithimage`;

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const response = await fetch(proceduresApiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const availableonly = data.filter((pro) => pro.available == true)
                setProcedures(availableonly);
            } catch (error) {
                console.error('Error fetching procedures:', error);
            }
        };

        fetchProcedures();
    }, [proceduresApiUrl]);

    // Function to shuffle the procedures array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Get four random procedures
    const randomProcedures = shuffleArray([...procedures]).slice(0, 4);

    return (
        <div className="max-w-7xl mx-auto p-8 rounded-lg">
            <div id="title" className='pb-7 text-center'>
                <h1 className="text-5xl font-bold uppercase">
                    Our <span className='text-green-400'>Service</span>
                </h1>
            </div>

            <div id="cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {randomProcedures.length > 0 ? (
                    randomProcedures.map(procedure => (
                        <div key={procedure._id} className="card card-compact bg-base-100 shadow-lg rounded-lg">
                            <figure className="h-48 flex items-center justify-center overflow-hidden ">
                                {procedure.Image ? (
                                    <img
                                        src={`data:image/jpeg;base64,${procedure.Image}`}
                                        alt={procedure.Procedure_name}
                                        className="object-contain h-full w-full"
                                    />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <p>No image available</p>
                                    </div>
                                )}
                            </figure>

                            <div className="card-body p-4">
                                <h2 className="card-title text-xl font-semibold">{procedure.Procedure_name}</h2>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500">
                        <p>No procedures available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
