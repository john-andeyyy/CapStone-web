import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function TipPage() {
    const [tips, setTips] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const tipsPerPage = 12; // Number of tips per page
    const BASEURL = import.meta.env.VITE_BASEURL;

    const fetchTips = () => {
        axios.get(`${BASEURL}/Tips/gettips`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setTips(response.data);
                } else {
                    console.error("Unexpected response format", response.data);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the tips!', error);
            });
    };

    useEffect(() => {
        fetchTips();
    }, []);

    const getProfileImage = (profilePicture) => {
        if (profilePicture instanceof File) {
            return URL.createObjectURL(profilePicture);
        }
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };

    // Calculate the indices of the tips to display
    const indexOfLastTip = currentPage * tipsPerPage;
    const indexOfFirstTip = indexOfLastTip - tipsPerPage;
    const currentTips = tips.slice(indexOfFirstTip, indexOfLastTip);

    // Calculate total pages
    const totalPages = Math.ceil(tips.length / tipsPerPage);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-green-500">Tips List:</h1>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentTips.map((tip) => (
                    <div
                        key={tip._id}
                        className="border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col justify-between"
                    >
                        <div className="cursor-pointer">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={getProfileImage(tip.image)}
                                    alt={tip.Title}
                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full shadow-md"
                                />
                            </div>

                            <p className="text-green-500 font-semibold">Title:</p>
                            <h2 className="pl-5 font-bold text-lg sm:text-xl mb-2">{tip.Title}</h2>

                            <p className="text-green-500 font-semibold">Description:</p>
                            <div className="max-h-20 sm:max-h-24 overflow-auto mb-4">
                                <p className="pl-5 text-sm sm:text-base">{tip.Description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <input
                        key={index}
                        className="join-item btn btn-square"
                        type="radio"
                        name="options"
                        aria-label={index + 1}
                        defaultChecked={index === currentPage - 1}
                        onChange={() => setCurrentPage(index + 1)}
                    />
                ))}
            </div>
        </div>
    );
}
