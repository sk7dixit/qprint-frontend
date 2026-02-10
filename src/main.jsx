import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './shared/AuthContext'
import { SocketProvider } from './shared/SocketContext'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </AuthProvider>
    </StrictMode>,
)
