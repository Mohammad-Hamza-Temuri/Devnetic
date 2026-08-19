import { useState } from "react";

const Signup = () => {


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        const res = await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })


        const data = await res.json();

        if (!res.ok) {
            setError(data.message)
            return
        }
        console.log("Signed up!", data)
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    className="bg-white rounded-2xl border-black py-3 px-2 mr-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name."
                />
                <input
                    className="bg-white rounded-2xl border-black py-3 px-2 mr-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email."
                />
                <input
                    className="bg-white rounded-2xl border-black py-3 px-2 mr-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password."
                />

                <button className="rounded-2xl border-black py-2.5 px-7 text-black bg-white ml-1.5 cursor-pointer" type="submit">Signup</button>
                {error && <p>{error}</p>}
            </form>
        </>
    )
}

export default Signup