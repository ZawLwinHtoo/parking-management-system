import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';  // Sidebar for consistent layout

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    // Fetch user profile info
    axios.get(`/api/profile?userId=${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`/api/profile/update?userId=${userId}`, updatedUser);
      setUser(response.data);
      alert("Profile updated successfully");
      navigate('/dashboard'); // Navigate to dashboard after update
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show image preview
      setImagePreview(URL.createObjectURL(file));

      // Handle file upload
      const formData = new FormData();
      formData.append('file', file);

      axios.post('/api/upload', formData)
        .then(response => {
          // Assume backend returns a URL to the uploaded image
          setUpdatedUser({ ...updatedUser, profileImage: response.data.url });
        })
        .catch(err => {
          console.error('Image upload failed', err);
          alert('Failed to upload image');
        });
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: '280px', // Sidebar width
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #25263b 70%, #283148 100%)',
          paddingTop: '20px',
          paddingLeft: '20px',
        }}
      >
        <div className="container py-5">
          <h2 className="mb-4 text-light">Profile</h2>

          <Form onSubmit={handleUpdateProfile} style={{ backgroundColor: '#2d2f45', padding: '30px', borderRadius: '10px' }}>
            {/* Profile Image Section */}
            <div className="d-flex flex-column align-items-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '120px', height: '120px', background: '#3b3f54', marginBottom: '10px',
                  backgroundImage: `url(${imagePreview || user.profileImage})`, backgroundSize: 'cover', backgroundPosition: 'center'
                }}
              >
                {!imagePreview && !user.profileImage && '📷'}
              </div>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="btn btn-outline-light w-100"
              />
            </div>

            {/* Username */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Username</Form.Label>
              <Form.Control
                type="text"
                value={user.username || ''}
                disabled
                className="bg-dark text-light"
              />
            </Form.Group>

            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={updatedUser.fullName || user.fullName || ''}
                onChange={handleInputChange}
                required
                className="bg-dark text-light"
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Email</Form.Label>
              <Form.Control
                type="text"
                value={user.email || ''}
                disabled
                className="bg-dark text-light"
              />
            </Form.Group>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={updatedUser.phone || user.phone || ''}
                onChange={handleInputChange}
                required
                className="bg-dark text-light"
              />
            </Form.Group>

            {/* Role */}
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Role</Form.Label>
              <Form.Control
                type="text"
                value={user.role || ''}
                disabled
                className="bg-dark text-light"
              />
            </Form.Group>

            <Button type="submit" disabled={isLoading} className="w-100 btn-primary">
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
