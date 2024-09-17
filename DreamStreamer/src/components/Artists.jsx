import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

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

	return (
		<div className="flex h-screen">
			<Sidebar />
			<div className="p-4 flex-1">
				{error && <p className="text-red-500">Error: {error}</p>}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{Array.isArray(artists) &&
						artists.map((artist) => (
							<div
								key={artist.id}
								onClick={() => navigate(`/artist/${artist.id}`)}
								className="card card-compact bg-base-100 shadow-xl cursor-pointer transition-transform transform hover:scale-105"
							>
								<figure>
									{artist.artist_profile_image ? (
										<img
											src={artist.artist_profile_image}
											alt={artist.artist_name}
											className="w-full h-48 object-cover"
										/>
									) : (
										<div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
											No image available
										</div>
									)}
								</figure>
								<div className="card-body">
									<h2 className="card-title">{artist.artist_name}</h2>
								
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default Artists;
