import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { trackClick } from "./trackClicks";

const GenreDetails = () => {
  const { id } = useParams(); 
  const [genre, setGenre] = useState(null); 
  const [albums, setAlbums] = useState([]); 
  const [error, setError] = useState(null); 
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchGenreDetails = async () => {
      try {
        const [genreResponse, albumResponse,artistsResponse] = await Promise.all([
          fetch(`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/${id}`),
          fetch(`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/`),
          fetch(
            "https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/"
          )
        ]);

        if (!albumResponse.ok || !genreResponse.ok || !artistsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const genreData = await genreResponse.json(); 
        const albumData = await albumResponse.json(); 
        const artistsData = await artistsResponse.json();

        console.log("Albums API data:", albumData);
				console.log("Artists API data:", artistsData);
				console.log("Genres API data:", genreData);


        setGenre(genreData);
        setAlbums(albumData);
        setArtists(artistsData);

        
        const filteredAlbums = albumData.filter(
          (album) => album.genre_id === parseInt(id)
        );
        setAlbums(filteredAlbums);
      } catch (error) {
        setError(error.message); 
      }
    };

    fetchGenreDetails();
  }, [id]);
  const navigate = useNavigate();

  const handleAlbumClick = (albumId) => {
		trackClick("album", albumId);
		console.log("Album clicked:", albumId);
		navigate(`/album/${albumId}`);
	};

  const getArtistNameById = (artistId) => {
		const artist = artists.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};

   return (
    <div className="h-screen bg-black">
      <div className="h-full flex">
        <Sidebar />
        <div className="w-full m-2 px-6 pt-4 rounded bg-[#390F0B] text-white overflow-auto lg:ml-0">
          <Navbar />
          {error && <p className="text-red-500">{error}</p>}
          {genre ? (
            <div>
              <h1 className="text-white text-3xl mb-3 mt-3 font-bold">{genre.genre_name}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.length > 0 ? (
                  albums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => handleAlbumClick(album.id)}
                      className="w-3/4 cursor-pointer transition-transform transform hover:scale-105"
                    >
                      <figure>
                        {album.album_art ? (
                          <img
                            src={album.album_art}
                            alt={album.album_name}
                            className="h-56 bg-red-950"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
                            No image available
                          </div>
                        )}
                      </figure>
                      <div className="mt-2 px-2 py-2">
                        <p className="text-[13px] font-bold">{album.album_name}</p>
                        <p className="text-[12px]">
                          {getArtistNameById(album.artist_id)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No albums found for this genre.</p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading genre details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenreDetails;
