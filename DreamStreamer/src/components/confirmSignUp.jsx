import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../../userPool';
import { useNavigate } from 'react-router-dom';

const ConfirmSignUp = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const email = localStorage.getItem('email');

  const handleConfirmSignUp = (event) => {
    event.preventDefault();

    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    if (!email) {
      setError('No user found. Please sign up again.');
      return;
    }

    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }

      console.log('Confirmation result:', result);
      alert('Verification successful!');
      navigate('/home');
    });
  };

  return (
    <div className="confirm-signup-container">
      <h2>Confirm Sign Up</h2>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleConfirmSignUp} className="confirmation-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input-field"
          />
        </div>

        <button type="submit" className="confirm-button">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ConfirmSignUp;
