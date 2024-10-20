import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServicesList } from '../../Landing-infopage/Infopagedata';

export default function OurService() {
    const [procedures, setProcedures] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [proceduresPerPage] = useState(12);
    const BASEURL = import.meta.env.VITE_BASEURL;
    const proceduresApiUrl = `${BASEURL}/Procedure/showwithimage`;

    const { data: ServicesData } = ServicesList();

    useEffect(() => {
        if (ServicesData) {
            setProcedures(ServicesData);
        }
        
    }, [ServicesData]);


    // useEffect(() => {
    //     const fetchProcedures = async () => {
    //         try {
    //             const response = await axios.get(proceduresApiUrl);
    //             setProcedures(response.data);
    //         } catch (error) {
    //             console.error('Error fetching procedures:', error);
    //         }
    //     };

    //     fetchProcedures();
    // }, [proceduresApiUrl]);

    const indexOfLastProcedure = currentPage * proceduresPerPage;
    const indexOfFirstProcedure = indexOfLastProcedure - proceduresPerPage;
    const currentProcedures = procedures.slice(indexOfFirstProcedure, indexOfLastProcedure);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(procedures.length / proceduresPerPage);

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div id="title" className='pb-7 text-center'>
                <h1 className="text-5xl font-bold uppercase">
                    Our <span className='text-green-400'>Services</span>
                </h1>
            </div>

            <div id="cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {currentProcedures.map(procedure => (
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
                ))}
            </div>

            {/* Pagination controls */}
            <div className="mt-8 flex justify-center">
                <div className="btn-group">
                    {[...Array(totalPages).keys()].map(pageNumber => (
                        <button
                            key={pageNumber + 1}
                            className={`btn ${currentPage === pageNumber + 1 ? 'btn-active' : ''}`}
                            onClick={() => handlePageChange(pageNumber + 1)}
                        >
                            {pageNumber + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
