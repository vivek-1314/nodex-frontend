import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import  FirebaseContext  from './context/firebasecontext'
import {UserProvider} from './context/usercontext'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
    <FirebaseContext>
      <UserProvider>
        <App />
      </UserProvider>
    </FirebaseContext>
    </BrowserRouter>
  // {/* </StrictMode>, */}
)
