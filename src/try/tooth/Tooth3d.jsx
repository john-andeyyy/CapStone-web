// Tooth2d.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tooth from './Tooth';
import NotesSection from './NotesSection';
import ToothModal from './ToothModal';
import MedicalHistoryUpdate from '../../AdminDashBoard/Components/MedicalHistory/MedicalHistoryUpdate';

const Tooth3d = ({ userIds }) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const userId = userIds;
    const [notes, setNotes] = useState({});
    const [hoveredTooth, setHoveredTooth] = useState(null);
    const [selectedTooth, setSelectedTooth] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [expandedTeeth, setExpandedTeeth] = useState({});
    const [showcreate, setshowcreate] = useState(false);
    const [topCount, setTopCount] = useState(0);
    const [bottomCount, setBottomCount] = useState(0);
    const fetchMedicalHistory = async () => {
        try {
            const response = await axios.get(`${Baseurl}/MedicalHistory/viewByUserId/${userId}`);
            const data = response.data;

            if (data.length > 0) {
                const record = data[0];
                setTopCount(record.topTeeth.length);
                setBottomCount(record.bottomTeeth.length);

                const initialToothData = {};
                record.topTeeth.forEach(tooth => {
                    initialToothData[`top-${tooth.toothNumber - 1}`] = {
                        notes: tooth.notes || [],
                        status: tooth.status || 'unknown',
                    };
                });
                record.bottomTeeth.forEach(tooth => {
                    initialToothData[`bottom-${tooth.toothNumber - 1}`] = {
                        notes: tooth.notes || [],
                        status: tooth.status || 'unknown',
                    };
                });
                setNotes(initialToothData);
                setshowcreate(false);
            } else {
                setshowcreate(true);
            }
        } catch (error) {
            console.error('Error fetching medical history:', error);
        }
    };

    useEffect(() => {
        fetchMedicalHistory();
    }, [userId]);

    const handleSvgClick = (id, name) => {
        setSelectedTooth({ id, name });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewNote('');
    };

    const handleSaveNote = () => {
        // Handle note saving logic here...
        // Ensure to update the state and make necessary API calls.
        handleCloseModal();
    };

    const toggleToothExpansion = (toothId) => {
        setExpandedTeeth((prevState) => ({
            ...prevState,
            [toothId]: !prevState[toothId],
        }));
    };

    return (
        <div className="flex flex-col items-center py-10">
            {showcreate && <MedicalHistoryUpdate userid={userId} fetchMedicalHistory={fetchMedicalHistory} />}

            <div className="mb-4">
                <div className="flex flex-wrap items-center justify-center space-x-4">
                    {Array.from({ length: topCount }, (_, index) => (
                        <Tooth
                            key={`top-${index}`}
                            id={`top-${index}`}
                            index={index}
                            isHovered={hoveredTooth === `top-${index}`}
                            onClick={() => handleSvgClick(`top-${index}`, `Tooth ${index + 1}`)}
                            status={notes[`top-${index}`]?.status}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap items-center justify-center space-x-4 mt-4">
                    {Array.from({ length: bottomCount }, (_, index) => (
                        <Tooth
                            key={`bottom-${index}`}
                            id={`bottom-${index}`}
                            index={index}
                            isHovered={hoveredTooth === `bottom-${index}`}
                            onClick={() => handleSvgClick(`bottom-${index}`, `Tooth ${index + 1}`)}
                            status={notes[`bottom-${index}`]?.status}
                        />
                    ))}
                </div>
            </div>

            {/* Notes Section */}
            <div className="w-full max-w-6xl mt-8 px-4">
                {Array.from({ length: topCount + bottomCount }).map((_, index) => {
                    const toothId = index < topCount ? `top-${index}` : `bottom-${index - topCount}`;
                    const { notes: toothNotes } = notes[toothId] || { notes: [] };
                    return (
                        <NotesSection
                            key={toothId}
                            toothId={toothId}
                            notes={toothNotes}
                            isExpanded={expandedTeeth[toothId]}
                            onToggle={() => toggleToothExpansion(toothId)}
                        />
                    );
                })}
            </div>

            {/* Tooth Modal */}
            <ToothModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveNote}
                newNote={newNote}
                setNewNote={setNewNote}
                selectedTooth={selectedTooth}
            />
        </div>
    );
};

export default Tooth3d;
