import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AssetPreloader from './utils/AssetPreLoader.jsx'

createRoot(document.getElementById('root')).render(<StrictMode><AssetPreloader verbose={true}><App/></AssetPreloader></StrictMode>)
