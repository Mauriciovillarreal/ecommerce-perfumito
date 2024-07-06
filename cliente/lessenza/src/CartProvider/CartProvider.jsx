import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import axiosInstance from '../AxiosInstance/AxiosInstance';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user) {
                console.error('User is not logged in.');
                return;
            }

            if (!user.cart) {
                console.error('No cart ID found for the user.');
                return;
            }

            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/carts/${user.cart}`);
                setCartItems(response.data.products);
            } catch (error) {
                setError(error.message);
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);

    const addToCart = async (productId) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        if (!user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/api/carts/${user.cart}/product/${productId}`);
            setCartItems(response.data.products);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProductQuantity = async (productId, quantity) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        if (!user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.put(`/api/carts/${user.cart}/products/${productId}`, { quantity });
            const updatedCartItems = [...cartItems];
            const index = updatedCartItems.findIndex(item => item.product._id === productId);
            if (index !== -1) {
                updatedCartItems[index].quantity = quantity;
            }
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProductFromCart = async (productId) => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        if (!user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.delete(`/api/carts/${user.cart}/products/${productId}`);
            const updatedCartItems = [...cartItems];
            const index = updatedCartItems.findIndex(item => item.product._id === productId);
            if (index !== -1) {
                updatedCartItems.splice(index, 1);
            }
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCart = async () => {
        if (!user) {
            console.error('User is not logged in.');
            return;
        }

        if (!user.cart) {
            console.error('No cart ID found for the user.');
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.delete(`/api/carts/${user.cart}`);
            setCartItems([]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, error, loading, addToCart, deleteCart, deleteProductFromCart, updateProductQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
