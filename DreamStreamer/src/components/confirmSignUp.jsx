import { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import userPool from '../../userPool';
import { useNavigate } from 'react-router-dom';

const ConfirmSignUp = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('signupEmail'); // Corrected key name to match SignUp component

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
      navigate('/login');
    });
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#F0F0F0]">
      <div className="bg-black p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">Confirm Sign Up</h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleConfirmSignUp} className="space-y-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded w-full hover:bg-purple-700 transition"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmSignUp;
