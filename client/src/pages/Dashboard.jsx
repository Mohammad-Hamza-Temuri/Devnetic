import { useNavigate } from "react-router-dom";


const Dashboard = () => {

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      <button
        onClick={handleLogout}
        className="rounded-xl py-2 px-6 text-white bg-primary hover:bg-primary-dark transition-colors cursor-pointer"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard