import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export const isAdminAuthenticated = () => sessionStorage.getItem("salt-admin-authenticated") === "true";

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem("salt-admin-authenticated", "true");
            navigate("/admin/orders", { replace: true });
            return;
        }

        setError("Incorrect username or password.");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-5 py-10">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-[#073f7020] bg-[#fffdf8] p-7 shadow-[0_8px_20px_rgb(7_63_112_/_8%)] sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f0ee] text-[#074d86]"><LockKeyhole size={22} /></div>
                <h1 className="mt-5 text-3xl font-bold text-[#074d86]">Admin Login</h1>
                <p className="mt-2 text-sm text-[#4780a0]">Sign in to view and manage orders.</p>

                <label className="mt-7 block text-sm font-semibold text-[#30678d]">Username
                    <input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10" />
                </label>
                <label className="mt-5 block text-sm font-semibold text-[#30678d]">Password
                    <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10" />
                </label>
                {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <button type="submit" className="mt-6 w-full rounded-xl bg-[#073f70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a568f] active:scale-[0.98]">Log In</button>
            </form>
        </div>
    );
};
