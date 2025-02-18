// Home.jsx
import React, { useState, useEffect } from 'react';
// import jwt_decode from 'jwt-decode';  // Correct import

const Home = () => {
  const [userData, setUserData] = useState(null);  // State to hold user data
  const [loading, setLoading] = useState(true);    // State to handle loading state
  const [error, setError] = useState(null);        // State to handle error

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage

    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    // Decode the JWT token
    const decodedToken = jwt_decode(token);
    const userEmail = decodedToken.email; // Assuming email is part of the decoded token

    // Fetch user data from backend using email
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/user/${userEmail}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in the request header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);  // Set the fetched data to state
        setLoading(false);   // Stop loading
      } catch (err) {
        setError(err.message);  // Handle any errors
        setLoading(false);
      }
    };

    fetchUserData();  // Call the fetch function
  }, []);

  // Render loading state, error, or user data
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData?.name}</h1> {/* Example user data */}
      <p>Email: {userData?.email}</p>
      <p>Other Info: {userData?.otherInfo}</p>
    </div>
  );
};

export default Home;
