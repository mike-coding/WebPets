import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainMenu from './MainMenu'

function App() {
  return (
    <div className="h-screen w-screen flex flex-row items-center justify-center">
      <MainMenu/>
    </div>
  )
}

export default App
