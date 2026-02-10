import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // Only connect if user is authenticated
        if (user) {
            const newSocket = io('http://localhost:5000', {
                transports: ['websocket'],
                autoConnect: true
            });

            newSocket.on('connect', () => {
                console.log('🔌 Connected to socket server');
                // Join user-specific room
                newSocket.emit('join', user.id);

                // If seller, join shop-specific room
                if (user.role === 'seller' && user.shop_id) {
                    newSocket.emit('joinShop', user.shop_id);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
                console.log('🔌 Disconnected from socket server');
            };
        } else {
            setSocket(null);
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
