const { axios } = require("axios");
const BASEURL = import.meta.env.VITE_BASEURL;

export const DashboardFetch = async () => {

    try {
        
        const [Announcement] = await Promise.all([
            axios.get(`${BASEURL}/api1`, { withCredentials: true }),

        ])
        
        const Announcementdata = Announcement.data

        return{
            Announcement: Announcementdata
        }

    } catch (error) {
        console.error(error)
    }
}