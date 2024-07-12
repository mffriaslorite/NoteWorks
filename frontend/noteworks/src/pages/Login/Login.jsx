import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import Navbar2 from '../../components/Navbar/Navbar2';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState(null);

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)){
            setError("Please enter a valid email address");
            return;
        }
    
        if (!password){
            setError("Please enter the password");
            return;
        }
        setError("");

        //Login API call
        try{
            const response = await axiosInstance.post("/login",{
                email: email,
                password: password,
            });

            //Handle successful login response
            if(response.data && response.data.accessToken){
                localStorage.setItem("token", response.data.accessToken)
                navigate('/home')
            }
        }   catch (error) {
            // Handle Login Error
            if (error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occured. Please try again.");
            }
        }
    };
    return (
    <>
        <Navbar2 />

        <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
            <div className="absolute top-24 w-full max-w-md p-8 space-y-8 bg-white border border-gray-300 rounded-lg shadow-lg">
                <form onSubmit={handleLogin}>
                    <h4 className="text-2xl mb-7 font-semibold text-gray-800">Login</h4>

                    <input
                        type="text"
                        placeholder="Email"
                        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-xs pb-4">{error}</p>}

                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Login
                    </button>
                    <p className="text-sm text-center mt-4 text-gray-600">
                        Not registered yet?{" "}
                        <Link to="/signUp" className="font-medium text-blue-500 hover:underline">
                            Create an Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    </>
    );
};

export default Login;