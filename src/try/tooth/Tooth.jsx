// Tooth.js
import React from 'react';
import TeethSVG from '../../GrapicsFiles/Teeth';

const Tooth = ({ id, index, isHovered, onClick, status }) => {
    return (
        <div className="flex flex-col items-center">
            <TeethSVG
                id={id}
                name={`Tooth ${index + 1}`}
                onClick={onClick}
                isHovered={isHovered}
                className={`transition-transform ${isHovered ? 'transform scale-110' : ''} hover:cursor-pointer`}
                status={status}
            />
            <span className="mt-2 text-sm text-gray-700">{id.startsWith('top-') ? `Top: ${index + 1}` : `Bottom: ${index + 1}`}</span>
        </div>
    );
};

export default Tooth;
