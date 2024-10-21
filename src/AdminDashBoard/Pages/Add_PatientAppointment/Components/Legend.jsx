import React from 'react';

const Legend = () => (
    <div className=" p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Markings</h3>
        <div className="flex flex-col space-y-2">
            <div className="flex items-center">
                <span className="w-4 h-4 bg-yellow-400 rounded-full inline-block mr-2"></span>
                <p className="text-gray-700">Pending</p>
            </div>
            <div className="flex items-center">
                <span className="w-4 h-4 bg-blue-400 rounded-full inline-block mr-2"></span>
                <p className="text-gray-700">Approved</p>
            </div>
            {/* <div className="flex items-center">
                <span className="w-4 h-4 bg-green-400 rounded-full inline-block mr-2"></span>
                <p className="text-gray-700">Completed</p>
            </div> */}
            {/* <div className="flex items-center">
                <span className="w-4 h-4 bg-red-400 rounded-full inline-block mr-2"></span>
                <p className="text-gray-700">Missed</p>
            </div> */}
            {/* <div className="flex items-center">
                <span className="w-4 h-4 bg-gray-400 rounded-full inline-block mr-2"></span>
                <p className="text-gray-700">Cancelled/Rejected</p>
            </div> */}
        </div>
    </div>
);

export default Legend;
