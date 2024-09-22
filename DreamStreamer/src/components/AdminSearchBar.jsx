import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSearchBar = () => {
    const [query, setQuery] = useState("");
    const [artistSuggestions, setArtistSuggestions] = useState([]);
    const [albumSuggestions, setAlbumSuggestions] = useState([]);
    const [trackSuggestions, setTrackSuggestions] = useState([]);
    const [userSuggestions, setUserSuggestions] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("query");
        if (searchQuery) {
            setQuery(searchQuery);
            fetchSuggestions(searchQuery);
        }
    }, [location]);

    const fetchSuggestions = async (query) => {
        if (query.length === 0) {
            setArtistSuggestions([]);
            setAlbumSuggestions([]);
            setTrackSuggestions([]);
            setUserSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://x2s8n81u10.execute-api.us-east-1.amazonaws.com/dev/search?query=${query}`
            );
            console.log("Search API data:", response.data);

            setArtistSuggestions(response.data.artists);
            setAlbumSuggestions(response.data.albums);
            setTrackSuggestions(response.data.tracks);
            setUserSuggestions(response.data.users || []); // Adjust to use the response data directly
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleAlbumClick = (albumId) => {
        navigate(`/album/${albumId}`);
    };

    const handleArtistClick = (artistId) => {
        navigate(`/artist/${artistId}`);
    };

    const handleUserClick = (username) => {
        navigate(`/admin/users/${username}`);
    };

    const getArtistNameById = (artistId) => {
        const artist = artistSuggestions.find((artist) => artist.id === artistId);
        return artist ? artist.artist_name : "Unknown Artist";
    };

    const getAlbumName = (albumId) => {
        const album = albumSuggestions.find((album) => album.id === albumId);
        return album ? album.album_name : "Unknown Album";
    };

    // Display duration in minutes
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    return (
        <div className="ml-4 mr-4 h-screen overflow-scroll">
            <div className="mr-3 ml-3 flex flex-col justify-center mb-10">
                <input
                    type="text"
                    placeholder="Search for users, artists, albums, or tracks"
                    className="searchTerm p-10 w-3/5 mt-6"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Display user suggestions */}
            {userSuggestions.length > 0 && (
                <>
                    <h3 className="text-white text-[15px] mb-3 mt-3 font-bold">Users</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userSuggestions.map((user) => (
                            <div
                                key={user.username}
                                onClick={() => handleUserClick(user.username)}
                                className="cursor-pointer transition-transform transform hover:scale-105"
                            >
                                <div className="mt-2 px-2 py-2">
                                    <p className="text-[13px] font-bold">{user.username}</p>
                                    <p className="text-[12px]">{user.email || "No Email"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Display artist suggestions */}
            {artistSuggestions.length > 0 && (
                <>
                    <h3 className="text-white text-[15px] mb-3 mt-3 font-bold">Artists</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
                        {artistSuggestions.map((artist) => (
                            <div
                                key={artist.id}
                                onClick={() => handleArtistClick(artist.id)}
                                className="cursor-pointer transition-transform transform hover:scale-105"
                            >
                                <figure className="h-40 w-40 rounded-full overflow-hidden">
                                    {artist.artist_profile_image ? (
                                        <img
                                            src={artist.artist_profile_image}
                                            alt={artist.artist_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
                                            No image available
                                        </div>
                                    )}
                                </figure>
                                <div className="mt-2 px-2 py-2">
                                    <p className="text-[13px] font-bold">{artist.artist_name}</p>
                                    <p className="text-[13px]">Artist</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Display album suggestions */}
            {albumSuggestions.length > 0 && (
                <>
                    <h3 className="text-white text-[15px] mb-3 mt-3 font-bold">Albums</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {albumSuggestions.map((album) => (
                            <div
                                key={album.id}
                                onClick={() => handleAlbumClick(album.id)}
                                className="cursor-pointer transition-transform transform hover:scale-105"
                            >
                                <figure>
                                    {album.album_art ? (
                                        <img
                                            src={album.album_art}
                                            alt={album.album_name}
                                            className="h-56"
                                        />
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
                                            No image available
                                        </div>
                                    )}
                                </figure>
                                <div className="mt-2 px-2 py-2">
                                    <p className="text-[13px] font-bold">{album.album_name}</p>
                                    <p className="text-[12px]">{getArtistNameById(album.artist_id)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Display track suggestions */}
            {trackSuggestions.length > 0 && (
                <div>
                    <h3 className="text-white text-[15px] mb-3 mt-3 font-bold">Tracks</h3>
                    <table className="table-auto text-white w-full border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="text-left p-2">Track Name</th>
                                <th className="text-left p-2">Artist</th>
                                <th className="text-left p-2">Album</th>
                                <th className="text-left p-2">Duration</th>
                                <th className="text-left p-2">Track</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trackSuggestions.map((track) => (
                                <tr key={track.id}>
                                    <td className="text-[15px] text-white">{track.track_name}</td>
                                    <td className="text-[15px] text-white">
                                        {getArtistNameById(track.album_id)}
                                    </td>
                                    <td className="text-[15px] text-white">
                                        {getAlbumName(track.album_id)}
                                    </td>
                                    <td className="text-[15px] text-white">
                                        {formatDuration(track.duration)}
                                    </td>
                                    <td>
                                        <audio controls className="w-full">
                                            <source src={track.track} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminSearchBar;
