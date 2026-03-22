import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Styles — tokens must load first so all vars are available
import './styles/tokens.css'
import './styles/objects.css'
import './styles/animations.css'
import './styles/dark.css'
import './styles/graveyard.css'

// Firebase App Check must init before any Firestore/Auth calls
import './firebase/appcheck'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
