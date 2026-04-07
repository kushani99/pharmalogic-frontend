import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

export const getOrders = async () => {
    try {
    
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const placeOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.put(`${API_URL}/update-status`, { orderId, status });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
};

export const deleteOrder = async (orderId) => {
    const response = await axios.delete(`${API_URL}/${orderId}`);
    return response.data;
};