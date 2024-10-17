import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MedicalHistoryUpdate from './MedicalHistoryUpdate';

const MedicalHistoryCreate = () => {
    const BASEURL = import.meta.env.VITE_BASEURL;

    const { patientId } = useParams();
    const [topTeeth, setTopTeeth] = useState([]);
    const [bottomTeeth, setBottomTeeth] = useState([]);

    const handleSave = async () => {
        const medicalHistory = {
            patientId,
            topTeeth,
            bottomTeeth,
        };

        try {
            const response = await axios.post(`${BASEURL}/MedicalHistory/Create`, medicalHistory);
            console.log('Medical history created:', response.data);
        } catch (error) {
            if (error.response) {
                console.warn('Error creating medical history:', error.response.data.message || error.response.data);
            }
        }
    };

    const createTeethEntry = (index) => ({
        toothNumber: index + 1,
        status: 'Healthy',
        notes: [],
    });

    const addTopTooth = () => {
        setTopTeeth((prevTeeth) => [...prevTeeth, createTeethEntry(prevTeeth.length)]);
    };

    const removeTopTooth = () => {
        setTopTeeth((prevTeeth) => prevTeeth.slice(0, -1));
    };

    const addBottomTooth = () => {
        setBottomTeeth((prevTeeth) => [...prevTeeth, createTeethEntry(prevTeeth.length)]);
    };

    const removeBottomTooth = () => {
        setBottomTeeth((prevTeeth) => prevTeeth.slice(0, -1));
    };

    const updateTopTeeth = (index, field, value) => {
        const newTopTeeth = [...topTeeth];
        newTopTeeth[index][field] = value;
        setTopTeeth(newTopTeeth);
    };

    const updateBottomTeeth = (index, field, value) => {
        const newBottomTeeth = [...bottomTeeth];
        newBottomTeeth[index][field] = value;
        setBottomTeeth(newBottomTeeth);
    };

    return (
        <div className="container">
            <h2>Create Medical History for Patient: {patientId}</h2>

            <div>
                <h3>Top Teeth</h3>
                <button onClick={addTopTooth} className="btn btn-secondary">
                    Add One
                </button>
                <button onClick={removeTopTooth} className="btn btn-danger" disabled={topTeeth.length === 0}>
                    Remove One
                </button>

                {/* Top Teeth Table */}
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tooth Number</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topTeeth.map((tooth, index) => (
                            <tr key={index}>
                                <td>{tooth.toothNumber}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={tooth.status}
                                        onChange={(e) => updateTopTeeth(index, 'status', e.target.value)}
                                        className="input"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        onChange={(e) => updateTopTeeth(index, 'notes', e.target.value.split(','))}
                                        className="input"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h3>Bottom Teeth</h3>
                <button onClick={addBottomTooth} className="btn btn-secondary">
                    Add One
                </button>
                <button onClick={removeBottomTooth} className="btn btn-danger" disabled={bottomTeeth.length === 0}>
                    Remove One
                </button>

                {/* Bottom Teeth Table */}
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tooth Number</th>
                            <th>Status</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bottomTeeth.map((tooth, index) => (
                            <tr key={index}>
                                <td>{tooth.toothNumber}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={tooth.status}
                                        onChange={(e) => updateBottomTeeth(index, 'status', e.target.value)}
                                        className="input"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        onChange={(e) => updateBottomTeeth(index, 'notes', e.target.value.split(','))}
                                        className="input"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button onClick={handleSave} className="btn btn-success">
                Save
            </button>
        </div>
    );
};

export default MedicalHistoryCreate;
