import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const DisplayGenre = () => {
  const [genres, setGenres] = useState([]); // Fix useState syntax
  const [error, setError] = useState(null);

  const navigate=useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          'https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/',
          {
            method: 'GET'
          }
        );
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
    
        const rawData = await response.text();
        console.log('Raw API response:', rawData);
     
        const data = JSON.parse(rawData);
        
        
        console.log('Parsed API data:', data);
    
        
        if (data.body) {
          const parsedData = JSON.parse(data.body);
          setGenres(parsedData);
        } else {
  
          setGenres(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    
    fetchGenres();
  }, []);
  
  
  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className='text-white'>
      {error && <p>Error: {error}</p>}
      <ul>
        {Array.isArray(genres) && genres.map((genre) => (
         
          <li  onClick={() => navigate(`/genre/${genre.id}`)} key={genre.id}>{genre.genre_name}</li>
        ))}
      </ul>
    </div>
      </div>
  
  );
};

export default DisplayGenre;
