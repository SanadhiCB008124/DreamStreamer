import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
	const [query, setQuery] = useState("");
	const [artistSuggestions, setArtistSuggestions] = useState([]);
	const [albumSuggestions, setAlbumSuggestions] = useState([]);
	const [trackSuggestions, setTrackSuggestions] = useState([]);

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
			return;
		}

		try {
			const artistResponse = await fetch(
				`https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists?query=${query}`
			);
			const artists = await artistResponse.json();
			setArtistSuggestions(artists);

			const albumResponse = await fetch(
				`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums?query=${query}`
			);
			const albums = await albumResponse.json();
			setAlbumSuggestions(albums);

			const trackResponse = await fetch(
				`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/tracks?query=${query}`
			);
			const tracks = await trackResponse.json();
			setTrackSuggestions(tracks);
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

	const getArtistNameById = (artistId) => {
		const artist = artistSuggestions.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};

	return (
		<div className="h-screen bg-black overflow-scroll">
		  <div className="h-[100%] bg-black ml-5 mr-3">
			<div className="mt-10 flex flex-col justify-center mb-10">
				<div className="search">
					<input
						type="text"
						placeholder="Search for artists, albums, or tracks"
						className="searchTerm p-10"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
			</div>

			{/* Display artist suggestions */}
			{artistSuggestions.length > 0 && (
				<>
					<h3 className="text-white text-3xl mb-3 mt-3 font-bold">Artists</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
						{artistSuggestions.map((artist) => (
							<div
								key={artist.id}
								onClick={() => handleArtistClick(artist.id)}
								className="w-3/4 cursor-pointer transition-transform transform hover:scale-105"
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
					<h3 className="text-white text-3xl mb-3 mt-3 font-bold">Albums</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{albumSuggestions.map((album) => (
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
					<h3>Tracks</h3>
					<ul>
						{trackSuggestions.map((track) => (
							<li key={track.id}>{track.track_name}</li>
						))}
					</ul>
				</div>
			)}
		</div>
        </div>
	);
};

export default SearchBar;
