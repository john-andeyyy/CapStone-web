import React from 'react';

const TeethSVG = ({ status,id, name, onClick, notes, isHovered, onMouseEnter, onMouseLeave }) => {
    const toothColor = status === 'missing' ? '#000000' : isHovered ? '#22C55E' : '#ffffff'; 

    const handleHover = () => {
        if (onMouseEnter) {
            onMouseEnter(id); // Pass tooth ID to parent component on hover enter
        }
    };

    const handleMouseLeave = () => {
        if (onMouseLeave) {
            onMouseLeave(); // Notify parent component on hover leave
        }
    };

    return (
        <svg
            fill={toothColor}
            height="100px"
            width="100px"
            version="1.1"
            id={id}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="-36.72 -36.72 685.44 685.44"
            xmlSpace="preserve"
            stroke="#ffffff"
            onClick={onClick} // Pass onClick prop directly to SVG
            onMouseEnter={handleHover} // Handle hover enter event
            onMouseLeave={handleMouseLeave} // Handle hover leave event
            style={{ cursor: 'pointer' }} // Set cursor to pointer for interaction
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#030303" strokeWidth="23.256">
                <g>
                    <path d="M354.464,18.248c-19.573,7.699-35.646,13.214-48.465,17.156c-12.817-3.944-28.892-9.459-48.463-17.156 C98.274-44.413-2.179,59.454,122.883,250.899c-57.896,184.189-12.676,321.362,54.927,358.013 c64.796,35.13,64.206-241.153,128.19-241.153c63.988,0,63.396,276.285,128.194,241.153c67.6-36.651,112.822-173.824,54.924-358.013 C614.178,59.454,513.725-44.413,354.464,18.248z M170.812,63.068c-7.853,7.723-13.971,16.038-19.042,25.753 c-5.279,10.7-7.716,22.636-9.403,34.359c-0.43,2.991-3.629,41.209-3.623,41.209c-11.79-10.559-18.082-27.613-20.565-42.835 c-1.841-15.799-0.23-31.574,7.054-45.874c13.639-26.482,44.608-42.271,74.14-35.896C190.106,47.875,179.596,54.371,170.812,63.068z " />
                </g>
            </g>
            <g id="SVGRepo_iconCarrier">
                <g>
                    <path d="M354.464,18.248c-19.573,7.699-35.646,13.214-48.465,17.156c-12.817-3.944-28.892-9.459-48.463-17.156 C98.274-44.413-2.179,59.454,122.883,250.899c-57.896,184.189-12.676,321.362,54.927,358.013 c64.796,35.13,64.206-241.153,128.19-241.153c63.988,0,63.396,276.285,128.194,241.153c67.6-36.651,112.822-173.824,54.924-358.013 C614.178,59.454,513.725-44.413,354.464,18.248z M170.812,63.068c-7.853,7.723-13.971,16.038-19.042,25.753 c-5.279,10.7-7.716,22.636-9.403,34.359c-0.43,2.991-3.629,41.209-3.623,41.209c-11.79-10.559-18.082-27.613-20.565-42.835 c-1.841-15.799-0.23-31.574,7.054-45.874c13.639-26.482,44.608-42.271,74.14-35.896C190.106,47.875,179.596,54.371,170.812,63.068z " />
                </g>
            </g>
        </svg>
    );
};

export default TeethSVG;
