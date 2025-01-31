import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import SearchBar from "./SearchBar";
import axios from "axios";

const ArtistManagement = () => {
	const [artists, setArtists] = useState([]);
	const [error, setError] = useState(null);
	const [selectedArtist, setSelectedArtist] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [artistName, setArtistName] = useState("");
	const [artistImage, setArtistImage] = useState(null);
	const [imagePreview, setImagePreview] = useState("");
	const [searchQuery ,setSearchQuery]=useState("")

	// Fetch artists
	useEffect(() => {
		const fetchArtists = async () => {
			try {
				const response = await axios.get(
					"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists"
				);

				if (response.data.body) {
					const parsedData = JSON.parse(response.data.body);
					setArtists(parsedData);
				} else {
					setArtists(response.data);
				}
			} catch (error) {
				setError(error.message);
			}
		};

		fetchArtists();
	}, []);

	// Handling image selection and preview
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setArtistImage(file);

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

	//create artist
	const createArtist = async () => {
		if (!artistName) return;

		setIsCreating(true);

		try {
			let imageBase64 = "";
			if (artistImage) {
				imageBase64 = await convertImageToBase64(artistImage);
			}

			const response = await axios.post(
				"https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists",
				{
					artist_name: artistName,
					artist_profile_image: imageBase64,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create artist");
			}

			const newArtist = response.data;
			setArtists([...artists, newArtist]);
			setArtistName(""); // Reset input field
			setArtistImage(null); // Reset image input
			setImagePreview(""); // Clear image preview
		} catch (error) {
			setError(error.message);
		} finally {
			setIsCreating(false);
		}
	};

	// Update artist
	const updateArtist = async () => {
		if (!selectedArtist || !artistName) return;

		setIsUpdating(true);

		try {
			let imageBase64 = "";
			if (artistImage) {
				imageBase64 = await convertImageToBase64(artistImage);
			}

			const response = await axios.put(
				`https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/${selectedArtist}`,
				{
					artist_name: artistName,
					artist_profile_image: imageBase64,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update artist");
			}

			const updatedArtist = response.data;
			setArtists(
				artists.map((artist) =>
					artist.id === selectedArtist ? updatedArtist : artist
				)
			);
			setSelectedArtist(null);
			setArtistName("");
			setArtistImage(null);
			setImagePreview("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsUpdating(false);
		}
	};

	// Delete artist
	const deleteArtist = async () => {
		if (!selectedArtist) return;

		setIsDeleting(true);

		try {
			await axios.delete(`https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/${selectedArtist}`);
	
			setArtists(artists.filter((artist) => artist.id !== selectedArtist));
			setSelectedArtist(null); 
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleArtistSelect = (artistId) => {
		const selected = artists.find((artist) => artist.id === artistId);
		setSelectedArtist(artistId);
		setArtistName(selected.artist_name);
		setImagePreview(selected.artist_profile_image || ""); // Display the current image
	};


	const filteredArtists=artists.filter(artist=>
		artist.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="h-screen flex">
			<Sidebar />
			<div className="w-full bg-[#BF2EF0] text-white p-4 overflow-auto mt-2 mb-2 mr-2">
				<AdminNavbar />
				<div className="w-1/3">
				<input
						type="text"
						placeholder="Search artists..."
						className="searchTerm p-2 w-1/5 mb-4 ml-3 mr-3 mt-6 "
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				

				<div className="flex flex-row items-end justify-end mr-40">
					<button
						className="btn btn-warning m-1"
						onClick={() => document.getElementById("my_modal_2").showModal()}
					>
						Create Artist
					</button>
					<details className="dropdown">
						<summary className="btn m-1 bg-white hover:bg-white hover:text-black  text-black">
							Actions
						</summary>
						<ul className="menu dropdown-content bg-white rounded-box z-[1] w-52 p-2 shadow">
							<li
								className="bg-white text-black"
								onClick={() =>
									document.getElementById("my_modal_3").showModal()
								}
							>
								<a>Update</a>
							</li>
							<li
								className="bg-white text-black"
								onClick={() =>
									document.getElementById("my_modal_1").showModal()
								}
							>
								<a>Delete</a>
							</li>
						</ul>
					</details>
				</div>

				{/* Delete Confirmation Modal */}
				<dialog id="my_modal_1" className="modal">
					<div className="modal-box bg-[#BF2EF0] text-white">
						<h3 className="font-bold text-lg">DELETE</h3>
						<p className="py-4">Are you sure you want to delete this entry?</p>
						<div className="modal-action">
							<form method="dialog" className="flex flex-row space-x-2">
								<button className="btn">Close</button>
								<button
									type="button"
                                    className="btn bg-red-600 border-none hover:bg-red-600"
									onClick={deleteArtist}
									disabled={isDeleting} // Disable button while deleting
								>
									{isDeleting ? "Deleting..." : "Delete"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Create Artist Modal */}
				<dialog id="my_modal_2" className="modal">
					<div className="modal-box bg-[#BF2EF0] text-white">
						<h3 className="font-bold text-lg">CREATE</h3>
						<form className="flex flex-col space-y-3">
							<label>Enter Artist Name:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={artistName}
								onChange={(e) => setArtistName(e.target.value)}
							/>
							<label>Upload Artist Image:</label>
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
									onClick={createArtist}
									disabled={isCreating}
								>
									{isCreating ? "Creating..." : "Create"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Update Artist Modal */}
				<dialog id="my_modal_3" className="modal">
					<div className="modal-box bg-[#BF2EF0] text-white">
						<h3 className="font-bold text-lg">UPDATE</h3>
						<form className="flex flex-col space-y-3">
							<label>Update Artist Name:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={artistName}
								onChange={(e) => setArtistName(e.target.value)}
							/>

							<label>Upload New Artist Image:</label>
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
									onClick={updateArtist}
									disabled={isUpdating}
								>
									{isUpdating ? "Updating..." : "Update"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Artist List */}
				<div className="overflow-x-auto">
					{error && <p className="text-red-500">Error: {error}</p>}
					{!error && artists.length === 0 && <p>Loading...</p>}
					{filteredArtists.length > 0 && (
						<table className="table">
							<thead>
								<tr className="text-white">
									<th></th>
									<th>#</th>
									<th>Artist Name</th>
									<th>Preview</th>
									<th>Acitve Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredArtists.map((artist, index) => (
									<tr
										key={artist.id}
										className={`cursor-pointer hover:bg-black ${
											selectedArtist === artist.id ? "selected-row" : ""
										}`}
										onClick={() => handleArtistSelect(artist.id)}
									>
										<td>
											<input
												type="radio"
												name="artistSelect"
												checked={selectedArtist === artist.id}
												onChange={() => handleArtistSelect(artist.id)}
											/>
										</td>
										<td>{index + 1}</td>
										<td>{artist.artist_name}</td>
										<td>
											{artist.artist_profile_image &&
											artist.artist_profile_image.startsWith("https") ? (
												<img
													src={artist.artist_profile_image}
													alt={artist.artist_name}
													className="w-32 h-32 object-cover rounded ml-4"
												/>
											) : (
												<span>No image available</span>
											)}
										</td>

										<td>{artist.isactive ? "Active" : "Inactive"}</td>
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

export default ArtistManagement;
