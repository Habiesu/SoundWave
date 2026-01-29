import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext.jsx'
import { AudioProvider } from './context/AudioContext.jsx'
import "./soundwave-avatar-element.js";

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <AudioProvider>
                <App />
            </AudioProvider>
        </AuthProvider>
    </BrowserRouter>
)
