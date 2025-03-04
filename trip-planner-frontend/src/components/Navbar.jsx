import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, loading, login, logout } = useContext(AuthContext);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6'
    }}>
      <Link to="/" style={{ 
        textDecoration: 'none', 
        color: '#333',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        Trip Planner
      </Link>
      
      <div>
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user.pictureUrl && (
              <img 
                src={user.pictureUrl} 
                alt="Profile" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%' 
                }} 
              />
            )}
            <span>{user.name}</span>
            <button 
              onClick={logout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign up / Login with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 