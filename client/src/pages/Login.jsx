import { useState } from "react";

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
        body: JSON.stringify({email, password}),
    });

    const data = await res.json();

    if(!res.ok){
        setError(data.message);
        return;
    }
    localStorage.setItem("token", data.token);
    console.log("logged in!", data);
    }

  return (
    <form onSubmit={handleSubmit}>
        <input
        className="bg-white rounded-2xl border-black py-3 px-2 mr-3" 
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         placeholder="Enter your email.."
        />

        <input
        className="bg-white rounded-2xl border-black py-3 px-2" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password.."
        />

        <button className="rounded-2xl border-black py-2.5 px-7 text-black bg-white ml-1.5 cursor-pointer" type="submit">Login</button>
        {error && <p>{error}</p>}
    </form>
  )
}

export default Login