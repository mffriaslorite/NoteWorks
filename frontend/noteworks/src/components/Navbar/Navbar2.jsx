import React, { useState } from 'react';
import noteworkslogo from '../../assets/noteworkslogo.png';


const Navbar2 = () => {


  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <img src={noteworkslogo} alt="logo" className="h-10 w-15" />
    </div>
  );
};

export default Navbar2;
