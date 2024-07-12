import React from 'react'
import InfoSection from '../GuestComponents/InfoSection'
import OurService from '../GuestComponents/OurService'

export default function LandingPage() {
    return (
        <div className='bg-base-200'>
            {/* 1st */}
            <div className="hero  min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        className="max-w-2xl rounded-lg shadow-2xl" />
                    <div>
                        <h1 className="text-5xl font-bold uppercase">alejandria's Dental</h1>
                        <h3 className=' pt-2 text-5xl font-bold text-green-400'>clinic</h3>
                        <p className="py-6">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis eius quis tempore?
                            Modi ducimus numquam deleniti veritatis voluptatibus.
                            Doloribus perferendis quidem nesciunt earum magni, sed temporibus laboriosam suscipit ducimus illo!
                        </p>
                        <button className="btn btn-primary uppercase font-semibold text-white bg-green-400 border-none">Learn more-{'>'} </button>
                    </div>
                </div>
            </div>

            {/* 2st */}
            <div className="hero  min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
                        className="max-w-2xl rounded-lg shadow-2xl" />
                    <div>
                        <h1 className="text-5xl font-bold">Here in Alejandria's</h1>
                        <h1 className="text-5xl font-bold pt-2">Dental <span className='text-green-400'>Clinic</span></h1>
                        <p className="py-6">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas assumenda possimus tempora sunt quasi,
                            porro distinctio ea, adipisci nemo at facere itaque eligendi delectus placeat perferendis aut. Perferendis, totam nisi.
                        </p>

                        <div className="flex  lg:space-x-96 space-x-32">
                            <div className="flex flex-col space-y-6 pb-16 text-xl items-center">
                                <h1 className="flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-green-400 font-semibold text-3xl">
                                        check_box
                                    </span>
                                    Service
                                </h1>
                                <h1 className="flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-green-400 font-semibold text-3xl">
                                        check_box
                                    </span>
                                    Service
                                </h1>
                                <h1 className="flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-green-400 font-semibold text-3xl">
                                        check_box
                                    </span>
                                    Service
                                </h1>
                            </div>

                            <div className="flex flex-col space-y-6 pb-16 text-xl items-center">
                                <h1 className="flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-green-400 font-semibold text-3xl">
                                        check_box
                                    </span>
                                    Service
                                </h1>
                                <h1 className="flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-green-400 font-semibold text-3xl">
                                        check_box
                                    </span>
                                    Service
                                </h1>
                                <h1 className="flex items-center">
                                    <span className="material-symbols-outlined mr-2 text-green-400 font-semibold text-3xl">
                                        check_box
                                    </span>
                                    Service
                                </h1>
                            </div>
                        </div>
                        {/* <button className="btn btn-primary bg-green-400 border-none text-white">Request Appointment</button> */}
                    </div>
                </div>
            </div>

            <InfoSection />
            <OurService/>

        </div>
    )
}
