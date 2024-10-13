import React from 'react';

const DeleteTipModal = ({ tip, onClose, onDelete }) => {
    const getProfileImage = (profilePicture) => {
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-accent p-8 rounded-lg shadow-lg w-[400px] h-[500px] flex flex-col">
                <h2 className="font-bold text-2xl mb-4 text-center text-red-500">Confirm Delete</h2>
                <div className="flex justify-center mb-4">
                    <img
                        src={getProfileImage(tip.image)}
                        alt={tip.Title}
                        className="w-40 h-40 object-cover rounded-full shadow-md"
                    />
                </div>
                <p className="text-lg text-center flex-grow">
                    Are you sure you want to delete the tip titled:
                </p>
                <p className="text-center text-lg font-semibold mb-6">
                    <strong>"{tip.Title}"</strong>
                </p>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2 hover:bg-red-600 transition duration-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={onDelete}
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTipModal;
