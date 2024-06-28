import React from 'react';
import { useNavigate } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Home page!</h1>
            {/* Add your content here */}
        </div>
    );
};

const [userInfo, setUserInfo] = useState(null);

const navigate = useNavigate();

//Get User Info
const getUserInfo = async () => {
    try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
            setUserInfo(response.data.user);
        }
    } catch (error){
        if (error.response.status === 401) {
            localStorage.clear();
            navigate("/login");
        }
    }
};

useEffect(() => {
    getUserInfo();
    return () => {};
}, []);

//     return (
//         <>
//         <Navbar userInfo={userInfo} />
//     )

export default Home;