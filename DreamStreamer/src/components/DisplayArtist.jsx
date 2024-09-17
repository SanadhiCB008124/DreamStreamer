import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import clock from "../assets/clock.svg";

const DisplayArtist = () => {
  const { id } = useParams(); // Get the artist ID from the route
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // Fetch artist data based on the ID
        const response= await fetch(
          `https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/${id}/`,
          { method: "GET" }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        console.log('Parsed artist data:', data);

        if (data.message) {
          throw new Error(data.message); 
        }

        setArtistData(data); 
      } catch (error) {
        setError(error.message); 
      }
    };

    fetchArtistData();
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!artistData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#4b1842] p-4 overflow-auto mt-2 mb-2 mr-2">
        <div className="flex gap-6  align-middle items-center">
          <div className="flex flex-col text-white">
           
            {error && <p className="text-red-500">{error}</p>} {/* Display error if any */}
          {artistData ? (
            <div>
              {artistData.artist_profile_image ? (
										<img
											src={artistData.artist_profile_image}
											alt={artistData.artist_name}
											className="w-full h-48 object-cover"
										/>
									) : (
										<div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
											No image available
										</div>
									)}
            </div>
          ) : (
            <p>Loading artist details...</p> // Display while data is being fetched
          )}
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">{artistData.artist_name}</h2>
            <button className="mt-5 bg-black rounded h-[40px] w-1/2">
              Play All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 text-[#a7a7a7]">
          <p><b className="mr-4">#</b> Title</p>
          <p>Album</p>
          <p className="hidden sm:block">Date Added</p>
          <img className="m-auto w-4" src={clock} alt="Clock Icon" />
        </div>

        <hr />
      </div>
    </div>
  );
};

export default DisplayArtist;
