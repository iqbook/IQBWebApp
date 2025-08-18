import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { ADMIN_GET_DEFAULT_SALON_SUCCESS, GET_ALL_QUEUELIST_SUCCESS, SALON_ONLINE_STATUS_SUCCESS } from '../Redux/Admin/Constants/constants';
import { GET_QUEUELIST_BARBERID_SUCCESS } from '../Redux/Barber/Constants/constants';

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}


export function SocketProvider({ children }) {

    const adminGetDefaultSalon = useSelector(state => state.adminGetDefaultSalon)

    const {
        response: adminGetDefaultSalonResponse
    } = adminGetDefaultSalon

    const salonId = useSelector(state => state.AdminLoggedInMiddleware.adminSalonId)

    const barberSalonId = useSelector(state => state.BarberLoggedInMiddleware?.barberSalonId)
    const barberId = useSelector(state => state.BarberLoggedInMiddleware?.barberId)

    const dispatch = useDispatch()

    useEffect(() => {

        const newSocket = socketIOClient("https://iqb-final.onrender.com")

        newSocket.on("connect", () => {
            console.log("✅ Connected to WebSocket");
            if (salonId) {
                newSocket.emit("joinSalon", salonId); // 🔹 FIXED: Changed to "joinSalon"
            }

            if (barberSalonId && barberId) {
                newSocket.emit("joinBarber", { salonId: barberSalonId, barberId });
            }

        });

        if (salonId) {
            // 🔹 Listen for real-time admin queuelist updates
            newSocket.on("queueUpdated", (updatedQueue) => {
                dispatch({
                    type: GET_ALL_QUEUELIST_SUCCESS,
                    payload: {
                        success: true,
                        status: 200,
                        message: "Queue list retrived sucessfully",
                        response: updatedQueue
                    }
                })
            });


            // Listen for status update from server
            newSocket.on("salonStatusUpdate", (data) => {
                dispatch({
                    type: ADMIN_GET_DEFAULT_SALON_SUCCESS,
                    payload: {
                        success: true,
                        status: 200,
                        message: "Salon found successfully",
                        response: {
                            ...data?.response,
                            isOnline: data?.response?.isOnline
                        }
                    }
                })
            });
        }

        if (barberSalonId && barberId) {
            // 🔹 Listen for real-time barber queuelist updates
            newSocket.on("barberQueueUpdated", (updatedQueue) => {
                dispatch({
                    type: GET_QUEUELIST_BARBERID_SUCCESS,
                    payload: {
                        success: true,
                        status: 200,
                        message: "Queue list found for the specified barber",
                        queueList: updatedQueue?.queueList
                    }
                })
            });
        }


        return () => newSocket.disconnect();

    }, [salonId, barberId, barberSalonId, dispatch]);

    return (
        <SocketContext.Provider value={{}} >
            {children}
        </SocketContext.Provider>
    );
}