import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-tailwind/react'
import { Toaster } from 'react-hot-toast'
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <ReduxProvider store={store}>
        <App />
        <Toaster />
      </ReduxProvider>
    </ThemeProvider>
  </BrowserRouter>
)
