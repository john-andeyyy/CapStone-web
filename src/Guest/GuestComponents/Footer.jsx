import React from 'react'

export default function Footer() {
    return (
        <div className="max-w-7xl mx-auto p-8 rounded-lg">

            <div className="p-6 rounded-lg  flex flex-col sm:flex-row justify-between">
                <div className="flex flex-col items-center sm:items-start">
                    <div className="text-xl font-bold">LOGO</div>
                    <div className="text-lg font-bold">ALEJANDRIA'S DENTAL CLINIC</div>
                    
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col items-center">
                    <div className="mt-4 text-center sm:text-left">
                        <div className="font-bold">Stay in touch</div>
                        <div>58 Peso St. Saint Michael,</div>
                        <div>Brgy. Pandayan, Meycauayan</div>
                        <div>City, Bulacan</div>
                        <div className="mt-2">aalejandria907@gmail.com</div>
                        <div>0956 056 8825</div>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-center">
                    <div className="font-bold">Navigation</div>
                    <a href="#about" className="hover:underline">About</a>
                    <a href="#services" className="hover:underline">Services</a>
                    <a href="#contact" className="hover:underline">Contact</a>
                </div>

                <div className="mt-4 sm:mt-0 flex flex-col items-center">
                    <div className="font-bold">Social Media</div>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Alejandria Dental Clinic</a>
                </div>
            </div>

        </div>
    )
}
