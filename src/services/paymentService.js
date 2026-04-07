import axios from 'axios';

const API_URL = "http://localhost:5000/api/supplier-payments"; 

export const addSupplierPayment = async (data) => {
    return await axios.post(API_URL, data);
};

export const getSupplierPayments = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};