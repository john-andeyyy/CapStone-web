import React from 'react';

const ViewTipModal = ({ tip, onClose }) => {
    const getProfileImage = (profilePicture) => {
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-accent p-6 rounded shadow-lg w-1/3">
                <h2 className="font-bold text-xl mb-4">Tip Details</h2>
                <div className="flex justify-center mb-4">
                    <img
                        src={getProfileImage(tip.image)}
                        alt={tip.Title}
                        className="w-32 h-32 object-cover rounded-full shadow-md"
                    />
                </div>
                <p className="text-green-500 font-semibold">Title:</p>
                <h2 className="font-bold text-lg mb-2">{tip.Title}</h2>
                <p className="text-green-500 font-semibold">Description:</p>
                <p>{tip.Description}</p>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTipModal;
