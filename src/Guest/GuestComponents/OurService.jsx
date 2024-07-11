import React from 'react'

export default function OurService() {
    return (
        <div className="max-w-7xl mx-auto p-8 rounded-lg">
            <div id="title" className='pb-7'>
                <h1 className="text-5xl font-bold uppercase">Our <span className='text-green-400'>Service</span></h1>
            </div>

            <div id="cards" className=''>
                <div className="card card-compact bg-base-100 w-100 shadow-xl rounded-sm lg:flex-row lg:space-x-4 lg:space-y-0 space-y-2">
                    <div>

                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                                alt="Shoes"
                                />
                                
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">Family</h2>
                            <h2 className="card-title">Dentistry</h2>
                        </div>
                    </div>

                    <div>
                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                                alt="Shoes" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">Restrorative</h2>
                            <h2 className="card-title">Care</h2>
                        </div>
                    </div>

                    <div>
                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                                alt="Shoes" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">Cosmatic</h2>
                            <h2 className="card-title">Care</h2>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
