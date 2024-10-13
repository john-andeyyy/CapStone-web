import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DashboardTips() {
    const navigate = useNavigate()
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BASEURL = import.meta.env.VITE_BASEURL;

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await axios.get(`${BASEURL}/Tips/gettips`);
                setTips(response.data);
            } catch (error) {
                console.error("Error fetching tips:", error);
                setError("Failed to load tips. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const getRandomTips = (tipsArray) => {
        // Shuffle the tips array
        const shuffledTips = tipsArray.sort(() => 0.5 - Math.random());
        // Get the first two tips
        return shuffledTips.slice(0, 2);
    };

    if (loading) {
        return <div className="text-center p-4">Loading tips...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    const randomTips = getRandomTips(tips);

    const getProfileImage = (profilePicture) => {
        if (profilePicture instanceof File) {
            return URL.createObjectURL(profilePicture);
        }
        return profilePicture
            ? `data:image/jpeg;base64,${profilePicture}`
            : "https://via.placeholder.com/150";
    };
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="pl-4 text-2xl font-semibold text-green-500">Tips</h2>
                <p className="flex items-center cursor-pointer "
                    onClick={() => {
                        navigate('/TipsList')
                    }}>
                    Edit
                    <span className="material-symbols-outlined ml-1"
                    >edit</span>
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {randomTips.map(tip => (
                    <div key={tip._id} className="border border-primary rounded-lg p-4 shadow-md hover:shadow-lg transition max-h-full overflow-hidden">

                        <div className='flex justify-center'>
                            <img
                                src={getProfileImage(tip.image)}
                                alt={tip.Title}
                                className="w-24 h-w-24  object-cover rounded-full shadow-md"
                            />
                        </div>
                        <h3 className="text-lg font-semibold">{tip.Title}</h3>
                        <p className="text-gray-600 max-h-24 overflow-hidden overflow-ellipsis">
                            {tip.Description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
