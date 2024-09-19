import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { trackClick } from "./trackClicks";
import Navbar from "./Navbar";

const Artists = () => {
	const [artists, setArtists] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchArtists = async () => {
			try {
				const response = await fetch(
					"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists",
					{ method: "GET" }
				);

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const rawData = await response.text();
				console.log("Raw API response:", rawData);

				const data = JSON.parse(rawData);
				console.log("Parsed API data:", data);

				if (data.body) {
					const parsedData = JSON.parse(data.body);
					setArtists(parsedData);
				} else {
					setArtists(data);
				}
			} catch (error) {
				setError(error.message);
			}
		};

		fetchArtists();
	}, []);

	const navigate = useNavigate();

	const handleArtistClick=(artistId)=>{
		trackClick('artist',artistId);
		console.log('Artist clicked:',artistId);
		navigate(`/artist/${artistId}`)
	}

	return (
		<div className="h-screen bg-black">
		  <div className="h-[100%] flex">
			<Sidebar />
			<div className="w-full m-2 px-6 pt-4 rounded bg-[#390F0B] text-white overflow-auto lg:ml-0">
			  <Navbar />
				<h1 className="text-white text-3xl mb-3 mt-3 font-bold">All artists</h1>
				{error && <p className="text-red-500">Error: {error}</p>}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5">
					{Array.isArray(artists) &&
						artists.map((artist) => (
							<div
								key={artist.id}
								onClick={() => handleArtistClick(artist.id)}
								className=" w-3/4 cursor-pointer transition-transform transform hover:scale-105"
							>
								<figure className="h-40 w-40  rounded-full overflow-hidden">
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
									<p className="text-[13px] ">Artist</p>
								
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
		</div>
	);
};

export default Artists;
