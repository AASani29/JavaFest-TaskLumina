import React, { useState, useEffect } from 'react';
import { getMyProfile } from '../user-service'; // Import getMyProfile function from userService
import '../CSS Files/ProfilePage.css'; // Import your CSS file for styling

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null); // State to store user profile

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile on component mount
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getMyProfile(); // Fetch user profile using userService function
      if (response.statusCode === 200) {
        // Destructure only required fields from response.ourUsers
        const { email, name, city } = response.ourUsers;
        // Set user profile in state with only required fields
        setUserProfile({ email, name, city });
      } else {
        // Handle error scenario
        console.error('Failed to fetch user profile:', response.message);
        // Example: You can display an error message or handle as needed
      }
    } catch (error) {
      console.error('Error occurred while fetching user profile:', error.message);
      // Example: You can display an error message or handle as needed
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      {userProfile ? (
        <div className="profile-details">
          <div>
            <label>Email:</label>
            <span>{userProfile.email}</span>
          </div>
          <div>
            <label>Name:</label>
            <span>{userProfile.name}</span>
          </div>
          <div>
            <label>City:</label>
            <span>{userProfile.city}</span>
          </div>
          {/* Exclude displaying password as per requirement */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
