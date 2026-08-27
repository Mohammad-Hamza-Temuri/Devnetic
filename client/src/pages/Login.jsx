import { useState } from "react";
import LoginImage from "../assets/Devnetic-login-signup-page.webp";
import SiteLogo from "../assets/Devnetic Logo.png"
import SiteLogoTransparent from "../assets/Devnetic-Logo-Transparent.png"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message);
                setLoading(false);
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("userName", data.user.name);
            navigate("/dashboard");

        } catch (err) {
            console.error("Login request failed:", err);
            setError("Could not connect to the server. Please try again.");
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen">
            {/* Left column - image/branding */}
            <div
                className="hidden lg:flex lg:w-1/2 bg-cover bg-center flex-col items-center justify-center"
                style={{ backgroundImage: `url(${LoginImage})` }}
            >
                <div className="backdrop-blur-md bg-black/40 border border-white/10 p-6 rounded-2xl shadow-2xl inline-block">
                    <img src={SiteLogoTransparent} alt="Devnetic logo" className="w-80" />
                </div>
                {/* <h1 className="text-white text-5xl font-bold drop-shadow-lg">Devnetic</h1> */}
                {/* <p className="text-white text-lg mt-2 drop-shadow-md">Connect. Build. Collaborate.</p> */}
            </div>

            {/* Right column - form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-50">
                <div className="w-full max-w-sm px-4">
                    <img src={SiteLogo} alt="Devnetic logo" className="w-42 mb-6 lg:hidden" />
                    <h2 className="text-4xl font-bold mb-1">Sign In</h2>
                    <p className="text-gray-500 mb-6">Login to your Devnetic account</p>

                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <input
                            type="email"
                            className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>

                        </div>

                        <button
                            disabled={loading}
                            className="w-full rounded-xl py-3 text-white bg-primary hover:bg-primary-dark transition-colors cursor-pointer font-medium"
                            type="submit"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </form>
                    <p className="text-gray-500 text-sm mt-4">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;