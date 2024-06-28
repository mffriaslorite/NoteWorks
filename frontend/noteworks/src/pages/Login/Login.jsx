import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import axiosInstance from '../../utils/axios.instance';
import {Link, useNavigate} from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Your component logic here

    return(
        <>
            <Navbar />

            
        </>
    );
};

export default Login;


//Login API Call
try{
    const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
    });

//Handle succesful login response
if (response.data && response.data.accessToken) {
    localStorage.setItem("token", response.data.accessToken);
    navigate("/dashboard");

}
//Handle Login error
} catch (error){
    if (error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
    } else {
        setError("An unexpected error occurred. Please try again.");
    }
};