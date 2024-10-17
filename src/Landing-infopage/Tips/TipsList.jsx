import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateTipModal from './UpdateTipModal';
import CreateTipModal from './CreateTipModal';
import ViewTipModal from './ViewTipModal';
import DeleteTipModal from './DeleteTipModal';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';
const TipsList = () => {
    const [tips, setTips] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTip, setSelectedTip] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCardView, setIsCardView] = useState(false);
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

    const handleUpdateClick = (tip) => {
        setSelectedTip(tip);
        setShowUpdateModal(true);
    };

    const handleDeleteClick = (tip) => {
        setSelectedTip(tip);
        setShowDeleteModal(true);
    };

    const handleViewClick = (tip) => {
        setSelectedTip(tip);
        setShowViewModal(true);
    };

    const handleDeleteConfirm = () => {
        axios.delete(`${BASEURL}/Tips/delete/${selectedTip._id}`)
            .then(() => {
                setShowDeleteModal(false);
                showToast('success', 'Delete successful!');

                fetchTips();
            })
            .catch(error => {
                console.error('There was an error deleting the tip!', error);
            });
    };

    const getProfileImage = (profilePicture) => {
        if (profilePicture instanceof File) {
            return URL.createObjectURL(profilePicture);
        }
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };

    const addTip = (newTip) => {
        fetchTips();
    };

    const updateTipInList = (updatedTip) => {
        fetchTips();
    };

    // Filter and sort tips based on the search query
    const filteredTips = tips
        .filter(tip => tip.Title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.Title.localeCompare(b.Title));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Tips List</h1>

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search tips..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-lg py-2 px-4 w-full max-w-xs"
                />
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow-lg ml-2"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create New Tip
                </button>
            </div>

            {/* Toggle Button for View Mode */}
            <div className="mb-4">
                <button
                    className={`mr-2 ${isCardView ? "bg-blue-500" : "bg-gray-300"} text-white py-2 px-4 rounded`}
                    onClick={() => setIsCardView(true)}
                >
                    Card View
                </button>
                <button
                    className={`ml-2 ${!isCardView ? "bg-blue-500" : "bg-gray-300"} text-white py-2 px-4 rounded`}
                    onClick={() => setIsCardView(false)}
                >
                    Table View
                </button>
            </div>

            {/* No Tips Available */}
            {filteredTips.length === 0 ? (
                <div className="text-center text-gray-500 font-semibold text-xl">
                    No tips available.
                </div>
            ) : isCardView ? (
                /* Responsive Tip Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[37rem] overflow-auto p-5">
                    {filteredTips.map((tip) => (
                        <div
                            key={tip._id}
                            className="border border-gray-200 rounded-lg shadow-lg p-4 flex flex-col justify-between"
                        >
                            <div onClick={() => handleViewClick(tip)} className="cursor-pointer">
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
                                    <p className="pl-5  text-sm sm:text-base">{tip.Description}</p>
                                </div>
                            </div>

                            {/* Update and Delete Buttons */}
                            <div className="flex space-x-2 mt-auto">
                                <button
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded text-sm sm:text-base"
                                    onClick={() => handleUpdateClick(tip)}
                                >
                                    Update Tip
                                </button>

                                <button
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded text-sm sm:text-base"
                                    onClick={() => handleDeleteClick(tip)}
                                >
                                    Delete Tip
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                        // Table View
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-green-400 text-black">
                                    <th className="border border-gray-200 px-4 py-2 text-left w-[10%] text-xs">ID</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Image</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left max-w-[150px]">Title</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left max-w-[250px]">Description</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTips.map((tip) => (
                                    <tr key={tip._id} className="border-b">
                                        <td className="border border-gray-200 px-2 py-2 text-xs">
                                            {tip._id.slice(0, 8)}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <img
                                                src={getProfileImage(tip.image)}
                                                alt={tip.Title}
                                                className="w-16 h-16 object-cover rounded-full"
                                            />
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {tip.Title}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">
                                            {tip.Description}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-center">
                                            <div className="space-x-2">
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded text-sm"
                                                    onClick={() => handleViewClick(tip)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm"
                                                    onClick={() => handleUpdateClick(tip)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded text-sm"
                                                    onClick={() => handleDeleteClick(tip)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>


            )}

            {/* Create Tip Modal */}
            {showCreateModal && (
                <CreateTipModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={addTip}
                />
            )}

            {/* Update Tip Modal */}
            {showUpdateModal && (
                <UpdateTipModal
                    tip={selectedTip}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={updateTipInList}
                />
            )}

            {/* View Full Tip Modal */}
            {showViewModal && (
                <ViewTipModal
                    tip={selectedTip}
                    onClose={() => setShowViewModal(false)}
                />
            )}

            {/* Delete Tip Modal */}
            {showDeleteModal && (
                <DeleteTipModal
                    tip={selectedTip}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleDeleteConfirm}
                />
            )}
        </div>
    );
};

export default TipsList;