import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import noteworkslogo from '../../assets/nl2.png';

const Navbar = ({ userInfo, onSearchNote }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate(); 

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery); // Changed OnSearchNote to onSearchNote
        }
    };

    const onClearSearch = () => {
        setSearchQuery("");
        onSearchNote(""); // Optionally clear search results when search is cleared
    };

    const handleLogoClick = () => {
        navigate('/home');
    };

    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
            <img 
                src={noteworkslogo}
                alt="logo" 
                className="h-7 w-15 cursor-pointer"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
            />
            <SearchBar 
                value={searchQuery}
                onChange={({ target }) => {
                    setSearchQuery(target.value);
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch} 
            />
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
    );
};

export default Navbar;
