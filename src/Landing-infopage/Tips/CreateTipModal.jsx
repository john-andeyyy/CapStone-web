import React, { useState } from 'react';
import axios from 'axios';
import { showToast } from '../../AdminDashBoard/Components/ToastNotification';

const CreateTipModal = ({ onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const BASEURL = import.meta.env.VITE_BASEURL;

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('Title', title);
        formData.append('Description', description);

        axios.post(`${BASEURL}/Tips/createtips`, formData)
            .then(response => {
                showToast('success', 'Tip Create successful!');

                onCreate(response.data);
                onClose();
            })
            .catch(error => {
                console.error('There was an error creating the tip!', error);
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#C6E4DA] p-6 rounded shadow-lg w-1/3">
                <h2 className="font-bold text-lg mb-4 text-[#266D53] text-center">Create New Tip</h2>
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

                <div className='mb-2'>
                    <span className=''>Upload Picture</span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4"
                />

                <div className="flex justify-between">
                    <button
                        className="bg-[#4285F4] hover:bg-[#0C65F8] text-black p-2 rounded"
                        onClick={handleSubmit}
                    >
                        Create
                    </button>

                    <button
                        className="bg-[#D9D9D9] hover:bg-[#ADAAAA] text-black p-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CreateTipModal;
