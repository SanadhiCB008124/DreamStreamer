import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import { assets } from "../assets/assets";
import Navbar from "./Navbar";

const DisplayAlbum = () => {
	const { id } = useParams();
	const [albumData, setAlbumData] = useState(null);
	const [error, setError] = useState(null);
	const { playWithId } = useContext(PlayerContext);
	const [artists, setArtists] = useState([]);
	const [genres, setGenres] = useState([]);
	const [tracks, setTracks] = useState([]);

	useEffect(() => {
		const fetchAlbumDetails = async () => {
			try {
				// Fetch album, artists, genres, and tracks
				const [albumResponse, artistsResponse, genresResponse, tracksResponse] =
					await Promise.all([
						fetch(
							`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/${id}/`
						),
						fetch(
							"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/"
						),
						fetch(
							"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/"
						),
						fetch(
							"https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/"
						),
					]);

				if (
					!albumResponse.ok ||
					!artistsResponse.ok ||
					!genresResponse.ok ||
					!tracksResponse.ok
				) {
					throw new Error("Network response was not ok");
				}

				const albumData = await albumResponse.json();
				const artistsData = await artistsResponse.json();
				const genresData = await genresResponse.json();
				const tracksData = await tracksResponse.json();

				// Set state with the fetched data
				setAlbumData(albumData);
				setArtists(artistsData);
				setGenres(genresData);

				// Filter tracks to include only those from the current album
				const albumTracks = tracksData.filter(
					(track) => track.album_id === parseInt(id)
				);
				setTracks(albumTracks);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchAlbumDetails();
	}, [id]);

	const getArtistNameById = (artistId) => {
		const artist = artists.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};

	const getGenreNameById = (genreId) => {
		const genre = genres.find((genre) => genre.id === genreId);
		return genre ? genre.genre_name : "Unknown Genre";
	};

	const recordStream = async (trackId) => {
		try {
			const response = await fetch(
				"https://8sic884uuf.execute-api.us-east-1.amazonaws.com/dev/songStreams",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ track_id: trackId }),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to record stream");
			}
		} catch (err) {
			console.error("Error recording stream:", err);
		}
	};

	const handleTrackPlay = (trackId) => {
		playWithId(trackId);
		recordStream(trackId);
		console.log("Track clicked:", trackId);
	};

	if (error) {
		return <p>Error: {error}</p>;
	}

	if (!albumData) {
		return <p>Loading...</p>;
	}

	return (
		<div className="h-screen bg-black flex">
			<Sidebar />
			<div className="flex flex-col w-full m-2 px-6 pt-4 bg-[#390F0B] text-white overflow-auto rounded lg:ml-0">
				<Navbar />
				<div className="flex flex-col flex-grow bg-[#390F0B] p-4 overflow-auto mt-2 mb-2">
					<div className="flex gap-6 align-middle items-center flex-wrap ">
						{albumData.album_art ? (
							<img
								src={albumData.album_art}
								alt={albumData.album_name}
								className="w-48 h-48 object-cover shadow-xl"
							/>
						) : (
							<div className="w-48 h-48 flex items-center justify-center bg-gray-200 text-gray-600">
								No image available
							</div>
						)}
						<div className="flex flex-col  space-y-3">
							<h2 className="text-4xl font-bold">{albumData.album_name}</h2>
							<div className="flex flex-row  text-white space-y-2">
								<p className="text-[13px]">
									{getArtistNameById(albumData.artist_id)} | {albumData.year} |
									| {albumData.no_of_tracks} tracks|{" "}
									{getGenreNameById(albumData.genre_id)}
								</p>
							</div>
							<div className="pt-10">
								<button className=" px-4 py-2 bg-green-600 rounded-full  ">
									<img src={assets.play} alt="Play" className="h-6 w-6" />
								</button>
							</div>
						</div>
					</div>

					<div className="mt-10 mb-4">
						<div className="overflow-x-auto">
							<div className="grid grid-cols-3 sm:grid-cols-4 text-[#a7a7a7]">
								<p>Tracks</p>
							</div>
							<hr />
							<div className="space-y-4">
								<table className="table">
									{/* head */}
									<thead>
										<tr>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{tracks.map((track) => (
											<tr
												key={track.id}
												onClick={() => handleTrackPlay(track.id)}
											>
												<td>{track.track_name}</td>
												<td className="flex flex-row justify-end">
													<audio controls>
														<source src={track.track} type="audio/mpeg" />
														Your browser does not support the audio element.
													</audio>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DisplayAlbum;
