import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import { assets } from "../assets/assets";
import Navbar from "./Navbar";
import axios from "axios";

const DisplayAlbum = () => {
	const { id } = useParams();
	const [albumData, setAlbumData] = useState(null);
	const [error, setError] = useState(null);

	const [artists, setArtists] = useState([]);
	const [genres, setGenres] = useState([]);
	const [tracks, setTracks] = useState([]);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [audio, setAudio] = useState(null);

	useEffect(() => {
		const fetchAlbumDetails = async () => {
			try {
				const [albumResponse, artistsResponse, genresResponse, tracksResponse] =
					await Promise.all([
						axios.get(
							`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/${id}/`
						),
						axios.get(
							"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/"
						),
						axios.get(
							"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/"
						),
						axios.get(
							"https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/"
						),
					]);

				const albumData = albumResponse.data;
				const artistsData = artistsResponse.data;
				const genresData = genresResponse.data;
				const tracksData = tracksResponse.data;

			
				setAlbumData(albumData);
				setArtists(artistsData);
				setGenres(genresData);

				
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
			const response = await axios.post(
				"https://8sic884uuf.execute-api.us-east-1.amazonaws.com/dev/songStreams/",
				{ track_id: trackId },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.status !== 200) {
				throw new Error("Failed to record stream");
			}
		} catch (err) {
			console.error("Error recording stream:", err);
		}
	};

	const handleTrackPlay = (track) => {
		if (currentTrack?.id === track.id && audio) {
			if (audio.paused) {
				audio.play();
			} else {
				audio.pause();
			}
		} else {
			if (audio) {
				audio.pause();
			}
			const newAudio = new Audio(track.track);
			setAudio(newAudio);
			setCurrentTrack(track);
			newAudio.play();
			recordStream(track.id);
		}
	};
	const formatDuration = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
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
												className="hover:bg-[#9c9ca9] cursor-pointer hover:rounded-full"
											>
												<td>{track.track_name}</td>
												<td>{formatDuration(track.duration)} s</td>
												<td className="flex flex-row justify-end">
													<label className="swap">
														<input
															type="checkbox"
															checked={
																currentTrack?.id === track.id && !audio?.paused
															}
															onChange={() => handleTrackPlay(track)}
														/>
														{/* Play button */}
														<img
															src={assets.pause}
															className="swap-on fill-current h-6"
															alt="Play"
														/>
														{/* Pause button */}
														<img
															src={assets.play}
															className="swap-off fill-current h-6"
															alt="Pause"
														/>
													</label>
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
