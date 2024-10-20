import { useState, useEffect } from 'react';
import axios from 'axios';

let cachedData_ServicesList = null;
export const ServicesList = (ref) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const [refresh, setRefresh] = useState(ref || false);
    const [data, setData] = useState(cachedData_ServicesList || null);
    const [loading, setLoading] = useState(!cachedData_ServicesList);
    const [error, setError] = useState(null);
    const ApiUrl = `Procedure/showwithimage`;

    useEffect(() => {
        if (!cachedData_ServicesList || refresh) {
            setLoading(true);
            axios.get(`${Baseurl}/${ApiUrl}`)
                .then((response) => {
                    cachedData_ServicesList = response.data;
                    console.log('cachedData_ServicesList', cachedData_ServicesList);
                    setData(response.data);
                })
                .catch((err) => {
                    setError(err);
                    console.error('Error fetching ServicesList:', err);
                })
                .finally(() => {
                    setLoading(false);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    return { data, loading, error };
};


let cachedData_ContactusPage = null;
export const Contactusdata = (ref) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const [refresh, setRefresh] = useState(ref || false);
    const [data, setData] = useState(cachedData_ContactusPage || null);
    const [loading, setLoading] = useState(!cachedData_ContactusPage);
    const [error, setError] = useState(null);
    const ApiUrl = `Contactus/contactus`;

    useEffect(() => {
        if (!cachedData_ContactusPage || refresh) {
            setLoading(true);
            axios.get(`${Baseurl}/${ApiUrl}`)
                .then((response) => {
                    cachedData_ContactusPage = response.data[0];
                    console.log('cachedData_ContactusPage', cachedData_ContactusPage);
                    setData(response.data[0]);
                })
                .catch((err) => {
                    setError(err);
                    console.error('Error fetching cachedData_ContactusPage:', err);
                })
                .finally(() => {
                    setLoading(false);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    return { data, loading, error };
};

let cachedData_langdingpage = null;
export const langdingpagedata = (ref) => {
    const Baseurl = import.meta.env.VITE_BASEURL;
    const [refresh, setRefresh] = useState(ref || false);
    const [data, setData] = useState(cachedData_langdingpage || null);
    const [loading, setLoading] = useState(!cachedData_langdingpage);
    const [error, setError] = useState(null);
    const ApiUrl = `Contactus/contactus`;

    useEffect(() => {
        if (!cachedData_langdingpage || refresh) {
            setLoading(true);
            axios.get(`${Baseurl}/${ApiUrl}`)
                .then((response) => {
                    cachedData_langdingpage = response.data[0];
                    console.log('cachedData_langdingpage', cachedData_langdingpage);
                    setData(response.data[0]);
                })
                .catch((err) => {
                    setError(err);
                    console.error('Error fetching cachedData_langdingpage:', err);
                })
                .finally(() => {
                    setLoading(false);
                    setRefresh(false);
                });
        }
    }, [refresh]);

    return { data, loading, error };
};
