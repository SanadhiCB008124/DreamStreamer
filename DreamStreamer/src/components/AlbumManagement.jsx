import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

const AlbumManagement = () => {
	const [albums, setAlbums] = useState([]);
	const [artists, setArtists] = useState([]);
	const [genres, setGenres] = useState([]);
	const [error, setError] = useState(null);
	const [selectedAlbum, setSelectedAlbum] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [albumName, setAlbumName] = useState("");
	const [artistName, setArtistName] = useState("");
	const [genreName, setGenreName] = useState("");
	const [year, setYear] = useState("");
	const [artistSuggestions, setArtistSuggestions] = useState([]);
	const [genreSuggestions, setGenreSuggestions] = useState([]);
	const [selectedArtist, setSelectedArtist] = useState("");
	const [selectedGenre, setSelectedGenre] = useState("");
	const [albumImage, setAlbumImage] = useState("");
	const [imagePreview, setImagePreview] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [albumsResponse, artistsResponse, genresResponse] =
					await Promise.all([
						fetch(
							"https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/"
						),
						fetch(
							"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/"
						),
						fetch(
							"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/"
						),
					]);

				if (!albumsResponse.ok || !artistsResponse.ok || !genresResponse.ok) {
					throw new Error("Network response was not ok");
				}

				const albumsData = await albumsResponse.json();
				const artistsData = await artistsResponse.json();
				const genresData = await genresResponse.json();

				setAlbums(albumsData);
				setArtists(artistsData);
				setGenres(genresData);
			} catch (error) {
				setError("Failed to fetch data: " + error.message);
			}
		};

		fetchData();
	}, []);

	// Handling image selection and preview
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAlbumImage(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Convert image to base64
	const convertImageToBase64 = (imageFile) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = () => reject(new Error("Image conversion failed"));
			reader.readAsDataURL(imageFile);
		});
	};

	const getArtistNameById = (artistId) => {
		const artist = artists.find((artist) => artist.id === artistId);
		return artist ? artist.artist_name : "Unknown Artist";
	};

	const getGenreNameById = (genreId) => {
		const genre = genres.find((genre) => genre.id === genreId);
		return genre ? genre.genre_name : "Unknown Genre";
	};

	const fetchArtistSuggestions = async (query) => {
		if (query.length === 0) {
			setArtistSuggestions([]);
			return;
		}
		try {
			const response = await fetch(
				`https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists?query=${query}`
			);
			const data = await response.json();
			setArtistSuggestions(data);
		} catch (error) {
			console.error("Error fetching artist suggestions:", error);
		}
	};

	const fetchGenreSuggestions = async (query) => {
		if (query.length === 0) {
			setGenreSuggestions([]);
			return;
		}
		try {
			const response = await fetch(
				`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres?query=${query}`
			);
			const data = await response.json();
			setGenreSuggestions(data);
		} catch (error) {
			console.error("Error fetching genre suggestions:", error);
		}
	};

	const handleArtistInputChange = (e) => {
		const query = e.target.value || "";
		setArtistName(query);
		fetchArtistSuggestions(query);
	};

	const handleGenreInputChange = (e) => {
		const query = e.target.value || "";
		setGenreName(query);
		fetchGenreSuggestions(query);
	};

	const handleAlbumSelect = (albumId) => {
		const selected = albums.find((album) => album.id === albumId);
		if (selected) {
			setSelectedAlbum(albumId);
			setAlbumName(selected.album_name || "");
			setArtistName(getArtistNameById(selected.artist_id) || "");
			setGenreName(getGenreNameById(selected.genre_id) || "");
			setSelectedArtist(getArtistNameById(selected.artist_id) || "");
			setSelectedGenre(getGenreNameById(selected.genre_id) || "");
		}
	};

	const createAlbum = async () => {
		if (!selectedArtist || !selectedGenre) {
			setError("Please select an artist and genre from the suggestions.");
			return;
		}

		setIsCreating(true);
		try {
			const artist = artists.find(
				(artist) => artist.artist_name === selectedArtist
			);
			const genre = genres.find((genre) => genre.genre_name === selectedGenre);

			if (!artist || !genre) {
				setError("Artist or Genre not found. Please select from suggestions.");
				return;
			}
			let imageBase64 = "";
			if (albumImage) {
				imageBase64 = await convertImageToBase64(albumImage);
			}

			const response = await fetch(
				"https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						album_name: albumName,
						artist_id: artist.id,
						genre_id: genre.id,
						album_art: imageBase64,
						year: year,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create album");
			}

			const newAlbum = await response.json();
			setAlbums([...albums, newAlbum]);
			setAlbumName("");
			setArtistName("");
			setGenreName("");
			setSelectedArtist("");
			setSelectedGenre("");
			setYear("");
			setAlbumImage(null);
			setImagePreview("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsCreating(false);
		}
	};

	const updateAlbum = async () => {
		if (!selectedAlbum) return;

		setIsUpdating(true);
		try {
			const artist = artists.find(
				(artist) => artist.artist_name === artistName
			);
			const genre = genres.find((genre) => genre.genre_name === genreName);

			if (!artist || !genre) {
				setError("Artist or Genre not found. Please select from suggestions.");
				return;
			}
			let imageBase64 = "";
			if (albumImage) {
				imageBase64 = await convertImageToBase64(albumImage);
			}

			const response = await fetch(
				`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/${selectedAlbum}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						album_name: albumName,
						artist_id: artist.id,
						genre_id: genre.id,
						album_art: imageBase64,
						year: year,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update album");
			}

			const updatedAlbum = await response.json();
			setAlbums(
				albums.map((album) =>
					album.id === selectedAlbum ? updatedAlbum : album
				)
			);
			setAlbumName("");
			setArtistName("");
			setGenreName("");
			setSelectedArtist("");
			setSelectedGenre("");
			setYear("");
			setAlbumImage(null);
			setImagePreview("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsUpdating(false);
		}
	};

	const deleteAlbum = async () => {
		if (!selectedAlbum) return;

		setIsDeleting(true);
		try {
			const response = await fetch(
				`https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/${selectedAlbum}`,
				{ method: "DELETE" }
			);

			if (!response.ok) {
				throw new Error("Failed to delete album");
			}

			setAlbums(albums.filter((album) => album.id !== selectedAlbum));
			setSelectedAlbum(null);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="h-screen flex">
			<Sidebar />
			<div className="w-full bg-[#4b1842] p-4 overflow-auto mt-2 mb-2 mr-2">
				<AdminNavbar />
				<h1 className="text-3xl text-white font-bold mb-4 mt-10">
					Admin Panel
				</h1>
				<div className="flex flex-row items-end justify-end mr-40">
					<button
						className="btn btn-warning m-1"
						onClick={() => document.getElementById("create_modal").showModal()}
					>
						Create Album
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
					<div className="modal-box">
						<h3 className="font-bold text-lg">DELETE</h3>
						<p className="py-4">Are you sure you want to delete this entry?</p>
						<div className="modal-action">
							<form method="dialog" className="flex flex-row space-x-2">
								<button className="btn">Close</button>
								<button
									type="button"
									className="btn btn-error"
									onClick={deleteAlbum}
									disabled={isDeleting}
								>
									{isDeleting ? "Deleting..." : "Delete"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Create Album Modal */}
				<dialog id="create_modal" className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">CREATE</h3>
						<form className="flex flex-col space-y-3">
							<label> Album Name:</label>

							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								onChange={(e) => setAlbumName(e.target.value)}
							/>

							<label>Year</label>
							<input
								type="text"
								value={year}
								onChange={(e) => setYear(e.target.value)}
							/>
							<label> Artist Name:</label>
							<input
								className="input text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={artistName}
								onChange={handleArtistInputChange}
							/>
							{artistSuggestions.length > 0 && (
								<ul className="suggestions-list">
									{artistSuggestions.map((artist) => (
										<li
											key={artist.id}
											onClick={() => {
												setArtistName(artist.artist_name);
												setSelectedArtist(artist.artist_name);
												setArtistSuggestions([]);
											}}
										>
											{artist.artist_name}
										</li>
									))}
								</ul>
							)}

							<label> Genre:</label>
							<input
								className="input text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={genreName}
								onChange={handleGenreInputChange}
							/>
							{genreSuggestions.length > 0 && (
								<ul className="suggestions-list">
									{genreSuggestions.map((genre) => (
										<li
											key={genre.id}
											onClick={() => {
												setGenreName(genre.genre_name);
												setSelectedGenre(genre.genre_name);
												setGenreSuggestions([]);
											}}
										>
											{genre.genre_name}
										</li>
									))}
								</ul>
							)}

							<label>Album Art:</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="mb-6"
							/>
							{imagePreview && (
								<img
									src={imagePreview}
									alt="Preview"
									className="mb-6 w-32 h-32 object-cover rounded"
								/>
							)}
						</form>

						<div className="modal-action">
							<form method="dialog" className="flex flex-row space-x-2">
								<button className="btn">Close</button>
								<button
									type="button"
									className="btn btn-success"
									onClick={createAlbum}
									disabled={isCreating}
								>
									{isCreating ? "Creating..." : "Create"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Update Album Modal */}
				<dialog id="update_modal" className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">UPDATE</h3>
						<form className="flex flex-col space-y-3">
							<label>Update Album Name:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={albumName}
								onChange={(e) => setAlbumName(e.target.value)}
							/>
							<label>Year</label>
							<input
								type="text"
								value={year}
								onChange={(e) => setYear(e.target.value)}
							/>

							<label>Update Artist Name:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={artistName}
								onChange={handleArtistInputChange}
							/>
							{artistSuggestions.length > 0 && (
								<ul className="suggestions-list">
									{artistSuggestions.map((artist) => (
										<li
											key={artist.id}
											onClick={() => {
												setArtistName(artist.artist_name);
												setSelectedArtist(artist.artist_name);
												setArtistSuggestions([]);
											}}
										>
											{artist.artist_name}
										</li>
									))}
								</ul>
							)}

							<label>Update Genre:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={genreName}
								onChange={handleGenreInputChange}
							/>
							{genreSuggestions.length > 0 && (
								<ul className="suggestions-list">
									{genreSuggestions.map((genre) => (
										<li
											key={genre.id}
											onClick={() => {
												setGenreName(genre.genre_name);
												setSelectedGenre(genre.genre_name);
												setGenreSuggestions([]);
											}}
										>
											{genre.genre_name}
										</li>
									))}
								</ul>
							)}

							<label>Update Album Art:</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="mb-6"
							/>
							{imagePreview && (
								<img
									src={imagePreview}
									alt="Preview"
									className="mb-6 w-32 h-32 object-cover rounded"
								/>
							)}
						</form>

						<div className="modal-action">
							<form method="dialog" className="flex flex-row space-x-2">
								<button className="btn">Close</button>
								<button
									type="button"
									className="btn btn-warning"
									onClick={updateAlbum}
									disabled={isUpdating}
								>
									{isUpdating ? "Updating..." : "Update"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Album Table */}
				<div className="overflow-x-auto">
					{error && <p className="text-red-500">Error: {error}</p>}
					{!error && artists.length === 0 && <p>Loading...</p>}
					{artists.length > 0 && (
						<table className="table">
							<thead>
								<tr>
									<th></th>
									<th>Album Name</th>
									<th>Year</th>
									<th>Artist Name</th>
									<th>Genre</th>
									<th>No of Tracks</th>
									<th>Album Art</th>
								</tr>
							</thead>
							<tbody>
								{albums.map((album) => (
									<tr
										key={album.id}
										className={`cursor-pointer hover:bg-black ${
											selectedAlbum === album.id ? "selected-row" : ""
										}`}
										onClick={() => handleAlbumSelect(album.id)}
									>
										<td>
											<input
												type="radio"
												name="albumSelect"
												checked={selectedAlbum === album.id}
												onChange={() => handleAlbumSelect(album.id)}
											/>
										</td>
										<td>{album.album_name}</td>
										<td>{album.year}</td>
										<td>{getArtistNameById(album.artist_id)}</td>
										<td>{getGenreNameById(album.genre_id)}</td>
										<td>{album.no_of_tracks}</td>
										<td>
											{album.album_art &&
											album.album_art.startsWith("https") ? (
												<img
													src={album.album_art}
													alt={album.album_name}
													className="w-32 h-32 object-cover rounded ml-4"
												/>
											) : (
												<span>No image available</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				<div className="join flex items-center flex-row justify-center mt-10">
					<button className="join-item btn bg-[#dda0dd] text-black hover:bg-[#dda0dd]">
						1
					</button>
					<button className="join-item btn btn-active bg-[#dda0dd] text-black hover:bg-[#dda0dd]">
						2
					</button>
					<button className="join-item btn bg-[#dda0dd] text-black hover:bg-[#dda0dd]">
						3
					</button>
					<button className="join-item btn bg-[#dda0dd] text-black hover:bg-[#dda0dd]">
						4
					</button>
				</div>
			</div>
		</div>
	);
};

export default AlbumManagement;
