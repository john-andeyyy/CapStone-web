import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfoSection from '../GuestComponents/InfoSection';
import OurService from '../GuestComponents/OurService';
import { useNavigate } from 'react-router-dom';

const BASEURL = import.meta.env.VITE_BASEURL;
const localApiUrl = `${BASEURL}/Landingpage/landing-pages`;
const proceduresApiUrl = `${BASEURL}/Procedure/showwithimage`;

export default function LandingPage() {
    const navigate = useNavigate();
    const [heroData, setHeroData] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heroResponse, proceduresResponse] = await Promise.all([
                    axios.get(localApiUrl),
                    axios.get(proceduresApiUrl),
                ]);
                setHeroData(heroResponse.data);
                setProcedures(proceduresResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const procedureColumns = chunkArray(procedures, Math.ceil(procedures.length / 2)); // Divide into 2 columns

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const heroLandingPage = heroData.find(page => page.isHero);
    const otherLandingPages = heroData.filter(page => !page.isHero);

    return (
        <div className="bg-base-200 pt-8">
            {/* 1st Hero Section */}
            <section className="hero min-h-screen w-full">
                <div className="hero-content flex-col lg:flex-row-reverse items-center justify-between w-full">
                    <div className="flex-1 max-w-md">
                        {heroLandingPage?.Image ? (
                            <img
                                src={`data:image/jpeg;base64,${heroLandingPage.Image}`}
                                className="max-w-2xl rounded-lg shadow-2xl w-full h-auto"
                                alt={heroLandingPage.Title}
                            />
                        ) : (
                            <div className="max-w-md rounded-lg shadow-2xl bg-gray-200 mx-auto lg:mx-0" />
                        )}
                    </div>
                    <div className="text-center lg:text-left flex-1">
                        <h1 className="text-5xl font-bold uppercase text-green-400">
                            {heroLandingPage?.Title || "Alejandria's Dental"}
                        </h1>
                        <p className="py-6">{heroLandingPage?.description || ''}</p>
                        {/* <button className="btn btn-primary uppercase font-semibold text-white bg-green-400 border-none">
                            Learn more -{'>'}
                        </button> */}
                    </div>
                </div>
            </section>

            {/* 2nd Hero Section */}
            <section className="hero min-h-screen w-full">
                <div className="hero-content flex-col lg:flex-row-reverse items-center justify-between w-full">
                    <div className="text-right flex-1">
                        <h1 className="text-5xl font-bold">Welcome to Alejandria's</h1>
                        <h1 className="text-5xl font-bold pt-2">
                            Dental <span className="text-green-400">Clinic</span>
                        </h1>
                        <p className="py-6">We offer a wide range of services.</p>
                        <button
                            className="text-green-400"
                            onClick={() => navigate('AllServices')}
                        >
                            See more
                        </button>

                        <div className="flex lg:space-x-12 space-x-8 justify-center lg:justify-center mt-8">
                            {procedureColumns.map((column, index) => (
                                <div key={index} className="flex flex-col space-y-6 pb-16 text-xl">
                                    {column.length > 0 ? (
                                        column.slice(0, 3).map((procedure) => (
                                            <h1 key={procedure._id} className="flex items-center">
                                                <span className="material-symbols-outlined mr-2 text-green-400 font-semibold text-3xl">
                                                    check_box
                                                </span>
                                                {procedure.Procedure_name}
                                            </h1>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No procedures available.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 max-w-md">
                        {otherLandingPages[0]?.Image ? (
                            <img
                                src={`data:image/jpeg;base64,${otherLandingPages[0].Image}`}
                                className="max-w-2xl rounded-lg shadow-2xl w-full h-auto"
                                alt={otherLandingPages[0].Title}
                            />
                        ) : (
                            <div className="max-w-md rounded-lg shadow-2xl bg-gray-200 mx-auto lg:mx-0" />
                        )}
                    </div>
                </div>
            </section>

            <InfoSection />
            <OurService />
        </div>
    );
}
