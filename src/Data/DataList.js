import { useState, useEffect } from 'react';
import axios from 'axios';

let cachedData_Dentist = null;
export const DentistList = (ref) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const [refresh, setRefresh] = useState(ref|| false);
    const [data, setData] = useState(cachedData_Dentist || null);
    const [loading, setLoading] = useState(!cachedData_Dentist);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cachedData_Dentist || refresh) {
            setLoading(true);
            axios.get(`${Baseurl}/dentist/dentistnames`)
                .then((response) => {
                    cachedData_Dentist = response.data;
                    // console.log('cachedData_Dentist', cachedData_Dentist);
                    setData(response.data);

                })
                .catch((err) => {
                    setError(err);
                    console.error('Error fetching DentistList:', err);
                })
                .finally(() => {
                    setLoading(false);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    return { data, loading, error };
};

let cachedData_Procedurelist = null;

export const ProcedureList = (ref) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const [refresh, setRefresh] = useState(ref);
    const [data, setData] = useState(cachedData_Procedurelist || null);
    const [loading, setLoading] = useState(!cachedData_Procedurelist);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cachedData_Procedurelist || refresh ) {
            setLoading(true);
            axios.get(`${Baseurl}/Procedure/names`)
                .then((response) => {
                    cachedData_Procedurelist = response.data;
                    // console.log('cachedData_Procedurelist',cachedData_Procedurelist);
                    setData(response.data);
                })
                .catch((err) => {
                    setError(err);
                    console.error('Error fetching ProcedureList:', err);
                })
                .finally(() => {
                    setLoading(false);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    return { data, loading, error };
};
