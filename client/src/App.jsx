import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
