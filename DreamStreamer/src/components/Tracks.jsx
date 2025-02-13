import axios from "axios";
import { assets } from "../assets/assets";
import AdminNavbar from "./AdminNavbar";

import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

const Tracks = () => {
	const [tracks, setTracks] = useState([]);
	const [artists, setArtists] = useState([]);
	const [albums, setAlbums] = useState([]);
	const [selectedTrack, setSelectedTrack] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [trackName, setTrackName] = useState("");
	const [albumName, setAlbumName] = useState("");
	const [albumSuggestions, setAlbumSuggestions] = useState([]);
	const [selectedAlbum, setSelectedAlbum] = useState("");
	const [duration, setDuration] = useState("");
	const [track, setTrack] = useState(null);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [audio, setAudio] = useState(null);
	const [error, setError] = useState("");
	const [streams, setStreams] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				const [tracksResponse, artistsResponse, albumsResponse] =
					await Promise.all([
						axios.get(
							"https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks"
						),
						axios.get(
							"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists"
						),
						axios.get(
							"https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums"
						),
					]);

				setTracks(tracksResponse.data);
				setArtists(artistsResponse.data);
				setAlbums(albumsResponse.data);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchTracks();
	}, []);

	const getArtistName = (albumId) => {
		const album = albums.find((album) => album.id === albumId);
		if (album) {
			const artist = artists.find((artist) => artist.id === album.artist_id);
			return artist ? artist.artist_name : "Unknown Artist";
		}
		return "Unknown Artist";
	};

	const getAlbumName = (albumId) => {
		const album = albums.find((album) => album.id === albumId);
		return album ? album.album_name : "Unknown Album";
	};

	const handleAlbumInputChange = (e) => {
		const query = e.target.value || "";
		setAlbumName(query);
		fetchAlbumSuggestions(query);
	};

	async function convertAudioToBase64(track) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				console.log("Audio base64:", reader.result); // Debug log
				resolve(reader.result.split(",")[1]);
			};
			reader.onerror = reject;
			reader.readAsDataURL(track);
		});
	}

	const fetchAlbumSuggestions = async (query) => {
		if (query.length === 0) {
			setAlbumSuggestions([]);
			return;
		}
		try {
			const response = await axios.get(
				`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums?query=${query}`
			);
			setAlbumSuggestions(response.data);
		} catch (error) {
			console.error("Error fetching album suggestions:", error);
		}
	};

	const handleTrackSelect = (trackId) => {
		const selected = tracks.find((track) => track.id === trackId);
		if (selected) {
			setSelectedTrack(trackId);
			setTrackName(selected.track_name || "");
			setAlbumName(getAlbumName(selected.album_id));
			setDuration(selected.duration || "");
			console.log("Selected Track:", selected);
		}
	};

	const handleAudioFile = (e) => {
		const audio = e.target.files[0];
		if (audio) {
			console.log("Audio File:", audio);
			setTrack(audio);

			const audioElement = new Audio(URL.createObjectURL(audio));
			audioElement.onloadedmetadata = () => {
				const durationInSeconds = audioElement.duration;
				setDuration(durationInSeconds.toFixed(2));
			};
		}
	};

	const createTrack = async () => {
		if (!selectedAlbum) {
			setError("Please select an album from the suggestions.");
			return;
		}

		setIsCreating(true);
		try {
			const album = albums.find((album) => album.album_name === selectedAlbum);
			if (!album) {
				setError("Album not found. Please select from suggestions.");
				return;
			}

			let audioBase64 = "";
			if (track) {
				audioBase64 = await convertAudioToBase64(track);
			}

			const response = await axios.post(
				"https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/",
				{
					track_name: trackName,
					album_id: album.id,
					duration: duration,
					track: audioBase64,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create track");
			}

			const newTrack = await response.json();
			setTracks([...tracks, newTrack]);
			setTrackName("");
			setAlbumName("");
			setSelectedAlbum("");
			setDuration("");
			setTrack(null);
		} catch (error) {
			setError(`Error creating track: ${error.message}`);
		} finally {
			setIsCreating(false);
		}
	};

	const updateTrack = async () => {
		if (!selectedTrack) return;

		setIsUpdating(true);
		try {
			const album = albums.find((album) => album.album_name === albumName);
			if (!album) {
				setError("Album not found. Please select from suggestions.");
				return;
			}

			let audioBase64 = "";
			if (track) {
				audioBase64 = await convertAudioToBase64(track);
			}

			const response = await axios.put(
				`https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/${selectedTrack}`,
				{
					track_name: trackName,
					album_id: album.id,
					duration: duration,
					track: audioBase64,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update track");
			}

			const updatedTrack = await response.json();
			console.log("Updated Track:", updatedTrack);

			setTracks(
				tracks.map((track) =>
					track.id === selectedTrack ? updatedTrack : track
				)
			);

			setTrackName("");
			setAlbumName("");
			setSelectedAlbum("");
			setDuration("");
			setTrack(null);
		} catch (error) {
			setError(`Error updating track: ${error.message}`);
		} finally {
			setIsUpdating(false);
		}
	};

	const deleteTrack = async () => {
		if (!selectedTrack) return;

		setIsDeleting(true);
		try {
			await axios.delete(
				`https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/${selectedTrack}`
			);

			setTracks(tracks.filter((track) => track.id !== selectedTrack));
			setSelectedTrack(null);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDeleting(false);
		}
	};

	const closeModal = (modalId) => {
		document.getElementById(modalId).close();
	};

	//display the duration in minutes
	const formatDuration = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
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
		}
	};

	const filteredTracks = tracks.filter((track) =>
		track.track_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="h-screen flex">
			<Sidebar />
			<div className="w-full bg-[#BF2EF0] text-white p-4 overflow-auto mt-2 mb-2 mr-2">
				<AdminNavbar />
				<div className="w-1/3">
					<input
						type="text"
						placeholder="Search tracks..."
						className="searchTerm p-2 w-1/5 mb-4 ml-3 mr-3 mt-6 "
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className="flex flex-row items-end justify-end mr-40">
					<button
						className="btn btn-warning m-1"
						onClick={() => document.getElementById("create_modal").showModal()}
					>
						Create Track
					</button>
					<details className="dropdown">
						<summary className="btn m-1 bg-white hover:bg-white hover:text-black text-black">
							Actions
						</summary>
						<ul className="menu dropdown-content bg-white rounded-box z-[1] w-52 p-2 shadow">
							<li
								className="bg-white text-black"
								onClick={() =>
									document.getElementById("update_modal").showModal()
								}
							>
								<a>Update</a>
							</li>
							<li
								className="bg-white text-black"
								onClick={() =>
									document.getElementById("delete_modal").showModal()
								}
							>
								<a>Delete</a>
							</li>
						</ul>
					</details>
				</div>

				{/* Delete Confirmation Modal */}
				<dialog id="delete_modal" className="modal">
					<div className="modal-box bg-[#BF2EF0] text-white">
						<h3 className="font-bold text-lg">DELETE</h3>
						<p className="py-4">Are you sure you want to delete this entry?</p>
						<div className="modal-action">
							<button
								className="btn"
								onClick={() => closeModal("delete_modal")}
							>
								Close
							</button>
							<button
								type="button"
								className="btn bg-red-600 border-none hover:bg-red-600"
								onClick={deleteTrack}
								disabled={isDeleting}
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</dialog>

				{/* Create Track Modal */}
				<dialog id="create_modal" className="modal">
					<div className="modal-box bg-[#BF2EF0] text-white">
						<h3 className="font-bold text-lg">CREATE</h3>
						<form className="flex flex-col space-y-3">
							<label>Track Name:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={trackName}
								onChange={(e) => setTrackName(e.target.value)}
							/>

							<label>Album:</label>
							<input
								className="input text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={albumName}
								onChange={handleAlbumInputChange}
							/>
							{albumSuggestions.length > 0 && (
								<ul className="suggestions-list">
									{albumSuggestions.map((album) => (
										<li
											key={album.id}
											onClick={() => {
												setAlbumName(album.album_name);
												setSelectedAlbum(album.album_name);
												setAlbumSuggestions([]);
											}}
										>
											{album.album_name}
										</li>
									))}
								</ul>
							)}

							<label>Track File:</label>
							<input
								type="file"
								onChange={handleAudioFile}
								accept="audio/*"
								className="mb-6"
							/>
						</form>

						<div className="modal-action">
							<button
								className="btn"
								onClick={() => closeModal("create_modal")}
							>
								Close
							</button>
							<button
								type="button"
								className="btn btn-warning"
								onClick={createTrack}
								disabled={isCreating}
							>
								{isCreating ? "Creating..." : "Create"}
							</button>
						</div>
					</div>
				</dialog>

				{/* Update Track Modal */}
				<dialog id="update_modal" className="modal">
					<div className="modal-box bg-[#BF2EF0] text-white">
						<h3 className="font-bold text-lg">UPDATE</h3>
						<form className="flex flex-col space-y-3">
							<label>Track Name:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={trackName}
								onChange={(e) => setTrackName(e.target.value)}
							/>

							<label>Album:</label>
							<input
								className="input text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={albumName}
								onChange={handleAlbumInputChange}
							/>
							{albumSuggestions.length > 0 && (
								<ul className="suggestions-list">
									{albumSuggestions.map((album) => (
										<li
											key={album.id}
											onClick={() => {
												setAlbumName(album.album_name);
												setSelectedAlbum(album.album_name);
												setAlbumSuggestions([]);
											}}
										>
											{album.album_name}
										</li>
									))}
								</ul>
							)}

							<label>Track File:</label>
							<input
								type="file"
								onChange={handleAudioFile}
								accept="audio/*"
								className="mb-6"
							/>
						</form>

						<div className="modal-action">
							<button
								className="btn"
								onClick={() => closeModal("update_modal")}
							>
								Close
							</button>
							<button
								type="button"
								className="btn btn-warning"
								onClick={updateTrack}
								disabled={isUpdating}
							>
								{isUpdating ? "Updating..." : "Update"}
							</button>
						</div>
					</div>
				</dialog>

				<div className="overflow-x-auto mt-4 p-8">
					<table className="table text-white w-full">
						<thead>
							<tr className="text-white">
								<th></th>
								<th>Track Name</th>
								<th>Artist</th>
								<th>Album</th>
								<th>Duration</th>
								<th>Streams</th>
								<th>Track</th>
							</tr>
						</thead>
						<tbody>
							{filteredTracks.map((track, index) => {
								return (
									<tr
										key={track.id || `track-${index}`}
										className={`cursor-pointer hover:bg-black ${
											selectedTrack === track.id ? "selected-row" : ""
										}`}
										onClick={() => handleTrackSelect(track.id)}
									>
										<td>
											<input
												type="radio"
												name="trackSelect"
												checked={selectedTrack === track.id}
												onChange={() => handleTrackSelect(track.id)}
											/>
										</td>
										<td>{track.track_name}</td>
										<td>{getArtistName(track.album_id)}</td>
										<td>{getAlbumName(track.album_id)}</td>
										<td>{formatDuration(track.duration)}</td>
										<td>{track.streams}</td>
										<td>
											<audio controls preload="metadata">
												<source src={track.track} type="audio/mpeg" />
												Your browser does not support the audio element.
											</audio>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Tracks;
