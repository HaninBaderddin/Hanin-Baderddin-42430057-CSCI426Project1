
import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ADMIN_USERS from "../Data/adminAccess";

/*
This function checks whether an administrator is currently logged in
It retrieves the authentication value from Session Storage and compares it with the string 'true'. 
If they match, it returns true, meaning the admin is logged in. 
Otherwise, it returns false
*/
export const isAdminAuthenticated = () =>
    sessionStorage.getItem(
        "salt-admin-authenticated"
    ) === "true";

export const Login = () => {
    const navigate = useNavigate();

    //the username and password entered by the user
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //the state for error initially no errors
    const [error, setError] = useState("");


    /*
    event represents the form submission event.
    preventDefault() so React can handle the submission without reloading the page.
    */
    const handleSubmit = (event) => {
        event.preventDefault();

        //Here, we use the .find() method to search inside the ADMIN_USERS array.
        const admin = ADMIN_USERS.find(
            (user) =>
                user.username === username &&
                user.password === password
        );
        //if the username and pass entered are same of ones in my ADMIN_USERS , admin will be true,
        // we save the state in session storage that the admin is authenticated
        if (admin) {
            sessionStorage.setItem(
                "salt-admin-authenticated",
                "true"
            ); //This saves the value "true" in sessionStorage under the key "salt-admin-authenticated". It indicates that the admin has successfully logged in.

            sessionStorage.setItem(
                "salt-admin-name",
                admin.fullName
            );//This saves the full name of the admin who logged in.

            navigate("/admin/orders", {
                replace: true
            });

            return; //we navigate to the admin page and we exit the function
        }

        //if admin is false it means we have an error, we set it 
        setError("Incorrect username or password.");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-5 py-10">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-[#073f7020] bg-[#fffdf8] p-7 shadow-[0_8px_20px_rgb(7_63_112_/_8%)] sm:p-9"
            >

                <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f0ee] text-[#074d86]">
                        <LockKeyhole size={22} />
                    </div>
                </div>

                <h1 className="mt-5 text-center text-3xl font-bold text-[#074d86]">
                    Admin Login
                </h1>

                <p className="mt-2 text-center text-sm text-[#4780a0]">
                    Sign in to view and manage orders.
                </p>

                {/* username label */}
                <label className="mt-7 block text-sm font-semibold text-[#30678d]">
                    Username

                    <input
                        required
                        autoComplete="username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                    />
                </label>
                {/*password label */}
                <label className="mt-5 block text-sm font-semibold text-[#30678d]">
                    Password

                    <input
                        required
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        className="mt-2 w-full rounded-lg border border-[#073f7020] bg-[#fffdf8] px-4 py-3 font-normal outline-none transition focus:border-[#073f70] focus:ring-2 focus:ring-[#073f70]/10"
                    />
                </label>
                {/* if error state have a values it means we have an error and we display it */}
                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="mt-6 w-full rounded-xl bg-[#073f70] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a568f] active:scale-[0.98]"
                >
                    Log In
                </button>

            </form>

        </div>
    );
};
