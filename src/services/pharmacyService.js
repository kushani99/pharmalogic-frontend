import axios from 'axios';
const API_URL = 'http://localhost:5000/api/pharmacies';

export const getPharmacies = async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
};

export const addPharmacy = async (pharmacyData) => {
    const response = await axios.post(`${API_URL}/add`, pharmacyData);
    return response.data;
};