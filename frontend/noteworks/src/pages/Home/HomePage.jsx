import React from 'react';
import { Link } from 'react-router-dom';
import Navbar2 from '../../components/Navbar/Navbar2';
import noteworkslogo from '../../assets/noteworkslogo.png';

const HomePage = () => {
  return (
    <div style={styles.pageContainer}>
      <Navbar2 />
      <div style={styles.container}>
        <img src={noteworkslogo} alt="NoteWorks Logo" style={styles.logo} />
        <h1 style={styles.title}><b>Welcome to NoteWorks!</b></h1>
        <div style={styles.descriptionBox}>
          <p>Your free and Interactive Web Application to organize your class notes.</p>
          <p>Create a folder for your subject and organize your notes Subject-wise.</p>
        </div>
        <div style={styles.signupContainer}>
          <p>
            To register, please click on <Link to="/signup" style={styles.link}>Signup</Link>
          </p>
        </div>
        <div style={styles.loginContainer}>
          <p>
            Already have an account? Go to <Link to="/login" style={styles.link}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center align horizontally
    textAlign: 'center',
    padding: '20px',
  },
  logo: {
    width: '600px', // increased size
    height: 'auto',
    margin: '20px 0', // add some margin
  },
  title: {
    fontSize: '2.0em', // Make the title larger
    margin: '40px 0 20px', // Add more margin on top for spacing
  },
  descriptionBox: {
    backgroundColor: '#D3D3D3', // Light gray color
    padding: '20px',
    borderRadius: '10px', // Optional: add rounded corners
    margin: '20px 0',
    width: '50%', // Optional: set a width for the box
    textAlign: 'center',
  },
  signupContainer: {
    marginBottom: '20px', // Add space between signup and login sections
  },
  loginContainer: {
    marginBottom: '20px', // Optional: add space below login as well
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
    margin: '5px 0', // add margin to separate the links
  }
};

export default HomePage;
