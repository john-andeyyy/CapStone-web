import React, { useState } from 'react';
import axios from 'axios';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';

const UpdateTipModal = ({ tip, onClose, onUpdate }) => {
    const [title, setTitle] = useState(tip.Title);
    const [description, setDescription] = useState(tip.Description);
    const [image, setImage] = useState(null);
    const BASEURL = import.meta.env.VITE_BASEURL;

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        if (image) formData.append('image', image);
        formData.append('Title', title);
        formData.append('Description', description);

        axios.put(`${BASEURL}/Tips/updatetip/${tip._id}`, formData)
            .then(response => {
                onUpdate(response.data);
                showToast('success', 'Tip Updated successful!');

                onClose(); 
            })
            .catch(error => {
                console.error('There was an error updating the tip!', error);
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-accent p-6 rounded shadow-lg w-1/3">
                <h2 className="font-bold text-lg mb-4">Update Tip</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full mb-4"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border p-2 w-full mb-4"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4"
                />

                <div className="flex justify-between">
                    <button
                        className="bg-red-500 text-white p-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={handleSubmit}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateTipModal;
