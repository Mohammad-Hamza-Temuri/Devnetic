import './App.css'
import Login from './pages/Login';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout'
import Profile from './pages/Profile';
import { Toaster } from "react-hot-toast";
import Projects from './pages/Projects'
import SingleProject from './pages/SingleProject';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';


function App() {

  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<SingleProject />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
