import { useEffect, useState } from "react";
import axios from "axios";

const Analytics = () => {
	const [clickData, setClickData] = useState([]);
	const [error, setError] = useState(null);
	const [timeRange, setTimeRange] = useState("daily");
	const [artists, setArtists] = useState([]);
	const [topAlbums, setTopAlbums] = useState([]);
	const [topArtists, setTopArtists] = useState([]);
	const [topGenres, setTopGenres] = useState([]);
	const [topSongs, setTopSongs] = useState([]);

	useEffect(() => {
		const fetchClickData = async () => {
			try {
				const [clickResponse, artistResponse, albumResponse, genreResponse] =
					await Promise.all([
						axios.get(
							`https://kyldp9nld9.execute-api.us-east-1.amazonaws.com/dev/clicks/?time_range=${timeRange}`
						),
						axios.get(
							`https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/`
						),
						axios.get(
							`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/`
						),
						axios.get(
							`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/`
						),
					]);

				setClickData(clickResponse.data);
				setArtists(artistResponse.data);
				setTopAlbums(albumResponse.data);
				setTopGenres(genreResponse.data);
			} catch (err) {
				setError("An error occurred while fetching data", err);
				console.log(err);
			}
		};

		const fetchTopSongs = async () => {
			try {
				const response = await axios.get(
					`https://8sic884uuf.execute-api.us-east-1.amazonaws.com/dev/songStreams?query_type=top_5_songs&period=${timeRange}`
				);
				setTopSongs(response.data);
			} catch (err) {
				handleError(err);
			}
		};

		const fetchPopularData = async () => {
			try {
				const top5Albums = await getTop5Albums();
				const top5Artists = await getTop5Artists();
				const top3Genres = await getTop3Genres();

				setTopAlbums(top5Albums);
				setTopArtists(top5Artists);
				setTopGenres(top3Genres);
			} catch (err) {
				handleError(err);
			}
		};

		fetchClickData();
		fetchTopSongs();
		fetchPopularData();
	}, [timeRange]);

	const handleError = (err) => {
		if (err.response) {
			setError(
				`Server responded with status ${err.response.status}: ${err.response.data}`
			);
		} else if (err.request) {
			setError("No response received from the server");
		} else {
			setError(`Error in setting up request: ${err.message}`);
		}
	};

	const getTop5Albums = async () => {
		const response = await axios.get(
			"https://kyldp9nld9.execute-api.us-east-1.amazonaws.com/dev/clicks/?query_type=top_5_albums"
		);
		return response.data;
	};

	const getTop5Artists = async () => {
		const response = await axios.get(
			"https://kyldp9nld9.execute-api.us-east-1.amazonaws.com/dev/clicks/?query_type=top_5_artists"
		);

		return response.data;
	};

	const getTop3Genres = async () => {
		const response = await axios.get(
			"https://kyldp9nld9.execute-api.us-east-1.amazonaws.com/dev/clicks/?query_type=top_3_genres"
		);
		return response.data;
	};

	const getArtistNameById = (artistId) => {
		const artist = artists.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};
	const handleTimeRangeChange = (event) => {
		setTimeRange(event.target.value);
	};
	return (
		<div className="p-4 ">
			<div className="flex flex-row items-end justify-end mb-5 mr-20">
				<details className="dropdown">
					<summary className="btn m-1 bg-white hover:bg-white hover:text-black text-black">
						Time Range
					</summary>
					<ul className="menu dropdown-content bg-white rounded-box z-[1] w-52 p-2 shadow">
						<li
							className="bg-white text-black cursor-pointer"
							onClick={() => setTimeRange("monthly")}
						>
							<a>Monthly</a>
						</li>
						<li
							className="bg-white text-black cursor-pointer"
							onClick={() => setTimeRange("yearly")}
						>
							<a>Yearly</a>
						</li>
					</ul>
				</details>
			</div>

			<div>
				<h2 className="text-white text-xl mb-3 mt-3 font-bold">
					Top 5 Albums -{" "}
					{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
				</h2>
				<ul>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
						{topAlbums.map((album, index) => (
							<li key={index}>
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
									<p className="text-[13px] font-bold">{album.name}</p>
									<p className="text-[12px]">
									{album.artist_name ? album.artist_name : "Unknown Artist"}
									</p>
								</div>
							</li>
						))}
					</div>
				</ul>

				<h2 className="text-white text-xl mb-3 mt-5 font-bold ">
					Top 5 Artists -{" "}
					{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
				</h2>
				<ul>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{topArtists.map((artist, index) => (
							<li key={index}>
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
							</li>
						))}
					</div>
				</ul>

				<h2 className="text-white text-xl mb-3 mt-3 font-bold">
					Top Genres - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
				</h2>
				
					<div className="flex flex-row flex-wrap justify-around mt-5 mb-14">
						{topGenres.map((genre) => (
							<div
								className="bg-[#FEECB3] text-black p-4 rounded-lg cursor-pointer "
								key={genre.id}
							>
								{genre.name}
							</div>
						))}
					</div>
				
			</div>

			{/* Top 5 Songs of the Year */}
			<h2 className="text-white text-xl mb-3 mt-5 font-bold">
				Top 5 Songs - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
			</h2>
			
			<div className="space-y-4">
				<table className="table">
					<thead>
						<tr>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{topSongs.map((song, index) => (
							<tr key={index}>
								<td className="text-[16px]">{song.track_name}</td>
								<td className="flex flex-row justify-end">
									<audio controls >
										<source src={song.track} type="audio/mpeg" />
										Your browser does not support the audio element.
									</audio>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Analytics;
