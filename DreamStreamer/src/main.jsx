(window).global = window;

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import PlayerContextProvider from './context/PlayerContext.jsx'
import { Provider } from 'react-redux';
import store from '../store.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <PlayerContextProvider>
    <App />
    </PlayerContextProvider>
      
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
