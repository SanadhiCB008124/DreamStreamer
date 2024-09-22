import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";

import Navbar from "./Navbar";
import { assets } from "../assets/assets";
import axios from "axios";

const DisplayArtist = () => {
	const { id } = useParams();
	const [artistData, setArtistData] = useState(null);
	const [tracksData, setTracksData] = useState(null);
	
	const [error, setError] = useState(null);
	const [currentTrack, setCurrentTrack] = useState(null);
	const [audio, setAudio] = useState(null);

	useEffect(() => {
		const fetchArtistData = async () => {
			try {
				const [artistResponse, tracksResponse] = await Promise.all([
					fetch(
						`https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/${id}`
					),
					fetch(
						"https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/"
					),
				]);

				if (!artistResponse.ok || !tracksResponse.ok) {
					throw new Error("Network response was not ok");
				}

				const artistData = await artistResponse.json();
				const tracksData = await tracksResponse.json();
				console.log("Parsed artist data:", artistData);
				console.log("Parsed tracks data:", tracksData);

				if (artistData.message) {
					throw new Error(artistData.message);
				}

				setArtistData(artistData);
				setTracksData(tracksData);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchArtistData();
	}, [id]);

	const tracks = artistData ? artistData.tracks : [];

	if (error) {
		return <p>Error: {error}</p>;
	}

	if (!artistData) {
		return <p>Loading...</p>;
	}
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


	const handleTrackPlay = (trackId) => {

		if(currentTrack?.id === trackId && audio){
			if(audio.paused){
				audio.play();
			}else{
				audio.pause();
			}
		}else{
			if(audio){
				audio.pause();
			}
			const newAudio = new Audio(trackId.track);
			setAudio(newAudio);
			setCurrentTrack(trackId);
			newAudio.play();
			recordStream(trackId.id );
		console.log("Track clicked:", trackId);
		}

		
		
	};
	return (
		<div className="h-screen bg-black flex">
			<Sidebar />
			<div className="flex flex-col w-full m-2 px-6 pt-4 bg-[#390F0B] text-white overflow-auto rounded lg:ml-0">
				<Navbar />
				<div className="flex gap-6 align-middle items-center">
					<div className="flex gap-6 align-middle items-center flex-wrap mt-5">
						{error && <p className="text-red-500">{error}</p>}
						{artistData ? (
							<div>
								{artistData.artist_profile_image ? (
									<img
										src={artistData.artist_profile_image}
										alt={artistData.artist_name}
										className="w-48 h-48 object-cover shadow-xl"
									/>
								) : (
									<div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-600">
										No image available
									</div>
								)}
							</div>
						) : (
							<p>Loading artist details...</p>
						)}
						<div className="flex flex-col  space-y-3">
							<h2 className="text-4xl font-bold">{artistData.artist_name}</h2>
							<div className="pt-10">
								<button className=" px-4 py-2 bg-green-600 rounded-full  ">
									<img src={assets.play} alt="Play" className="h-6 w-6" />
								</button>
							</div>
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
											<label className="swap">
														<input
															type="checkbox"
															checked={
																currentTrack?.id ===track.id
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
	);
};

export default DisplayArtist;
