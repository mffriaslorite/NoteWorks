import React from 'react';

const SignUp = () => {
    // Your component code here
    return (
        <div>
            <h1>Sign Up</h1>
            {/* Add your sign up form or content here */}
        </div>
    );
};

//SignUp API Call
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

export default SignUp;