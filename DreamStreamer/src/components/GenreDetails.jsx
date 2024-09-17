import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

const GenreDetails = () => {
    const { id } = useParams(); // Get the genre ID from the URL
    const [genre, setGenre] = useState(null); // State to hold the genre details
    const [error, setError] = useState(null); // State to handle errors
  
    useEffect(() => {
      const fetchGenreDetails = async () => {
        try {
          const response = await fetch(
            ` https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/${id}`, 
            {
              method: 'GET'
            }
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json(); 
          console.log('Parsed genre data:', data);
  
          if (data.message) {
            throw new Error(data.message); 
          }
  
          setGenre(data); 
        } catch (error) {
          setError(error.message); 
        }
      };
  
      fetchGenreDetails();
    }, [id]);
  
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="p-4">
          <h1 className="text-white">Genre Details</h1>
          {error && <p className="text-red-500">{error}</p>} {/* Display error if any */}
          {genre ? (
            <div>
              <h2 className="text-white">Genre Name: {genre.genre_name}</h2>
        
            </div>
          ) : (
            <p>Loading genre details...</p> 
          )}
        </div>
      </div>
    );
  };
  

export default GenreDetails;
