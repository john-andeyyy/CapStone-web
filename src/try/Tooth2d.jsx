import React, { useState } from 'react';
import TeethSVG from '../GrapicsFiles/Teeth'; // Adjust the path as needed

const Tooth2d = ({ topCount = 7 , bottomCount = 10 }) => {
    const [notes, setNotes] = useState({}); // State to hold notes for each tooth
    const [hoveredTooth, setHoveredTooth] = useState(null); // State to track hovered tooth ID

    // Function to generate an array of numbers from 0 to n-1
    const range = (n) => Array.from({ length: n }, (_, i) => i);

    // Handler for SVG click event to add notes
    const handleSvgClick = (id, name) => {
        const newNote = prompt(`ID: ${id}, Name: ${name} - Enter notes:`);
        if (newNote !== null) {
            setNotes({ ...notes, [id]: [...(notes[id] || []), newNote] });
        }
    };

    // Handler for mouse enter on note to highlight corresponding tooth
    const handleNoteHover = (id) => {
        setHoveredTooth(id);
    };

    // Function to get all notes for a specific tooth
    const getNotesForTooth = (toothId) => {
        return notes[toothId] || [];
    };

    return (
        <div className="flex flex-col justify-center ">
            <div>
                <div className='flex items-center justify-center'>
                    {/* Render SVG elements in the top row and rotate them 180 degrees */}
                    {range(topCount).map((index) => (
                        <TeethSVG
                            key={`top-${index}`}
                            id={`top-${index}`}
                            name={`Tooth ${index + 1}`}
                            onClick={() => handleSvgClick(`top-${index}`, `Tooth ${index + 1}`)}
                            isHovered={hoveredTooth === `top-${index}`}
                            onMouseEnter={handleNoteHover} // Pass hover handler to TeethSVG
                            onMouseLeave={() => setHoveredTooth(null)} // Clear hovered tooth on leave
                        />
                    ))}
                </div>
                <div className='flex items-center justify-center'>
                    {/* Render SVG elements in the bottom row */}
                    {range(bottomCount).map((index) => (
                        <TeethSVG
                            key={`bottom-${index}`}
                            id={`bottom-${index}`}
                            name={`Tooth ${index + topCount + 1}`}
                            onClick={() => handleSvgClick(`bottom-${index}`, `Tooth ${index + topCount + 1}`)}
                            isHovered={hoveredTooth === `bottom-${index}`}
                            onMouseEnter={handleNoteHover} // Pass hover handler to TeethSVG
                            onMouseLeave={() => setHoveredTooth(null)} // Clear hovered tooth on leave
                        />
                    ))}
                </div>
            </div>

            {/* Render notes table with max-width of 2xl (tailwindcss max-w-2xl class) */}
            <div className="mt-4 p-4 border border-gray-300 rounded max-w-2xl">
                <h2 className="text-lg font-semibold mb-2">All Notes</h2>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {range(topCount + bottomCount).map((index) => {
                            const toothId = index < topCount ? `top-${index}` : `bottom-${index - topCount}`;
                            return (
                                <tr
                                    key={`note-${index}`}
                                    className={hoveredTooth === toothId ? 'bg-gray-200' : ''}
                                    onMouseEnter={() => handleNoteHover(toothId)} // Handle mouse enter on table row
                                    onMouseLeave={() => setHoveredTooth(null)} // Clear hovered tooth on leave
                                >
                                    <td className="border px-4 py-2">{toothId}</td>
                                    <td className="border px-4 py-2">{`Tooth ${index + 1}`}</td>
                                    <td className="border px-4 py-2">
                                        {getNotesForTooth(toothId).length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {getNotesForTooth(toothId).map((note, idx) => (
                                                    <li key={`note-${index}-${idx}`}>{note}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No notes</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tooth2d;
