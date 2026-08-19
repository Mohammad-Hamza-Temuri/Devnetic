import { useState } from "react";
import LoginImage from "../assets/Devnetic-login-signup-page.webp";
// import SiteLogo from "../assets/Devnetic Logo.png"
import SiteLogoTransparent from "../assets/Devnetic-Logo-Transparent.png"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message);
            return;
        }
        localStorage.setItem("token", data.token);
        console.log("logged in!", data);
    }

    return (
        <div className="flex h-screen">
            {/* Left column - image/branding */}
            <div
                className="w-1/2 bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: `url(${LoginImage})` }}
            >
                <img src={SiteLogoTransparent} alt="Devnetic logo" className="w-80" />
                <h1 className="text-white text-5xl font-bold drop-shadow-lg">Devnetic</h1>
                <p className="text-white text-lg mt-2 drop-shadow-md">Connect. Build. Collaborate.</p>
            </div>

            {/* Right column - form */}
            <div className="w-1/2 flex flex-col items-center justify-center bg-gray-50">
                <div className="w-full max-w-sm">
                    
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

                        <input
                            type="password"
                            className="w-full bg-white rounded-xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />

                        <button
                            className="w-full rounded-xl py-3 text-white bg-primary hover:bg-primary-dark transition-colors cursor-pointer font-medium"
                            type="submit"
                        >
                            Login
                        </button>

                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;