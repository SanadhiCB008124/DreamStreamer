import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenreManagement = () => {
	const [genres, setGenres] = useState([]);
	const [error, setError] = useState(null);
	const [selectedGenre, setSelectedGenre] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [genreName, setGenreName] = useState("");
	const [searchQuery, setSearchQuery] = useState(""); // New state for search query

	const navigate = useNavigate();

	// Fetching genres
	useEffect(() => {
		const fetchGenres = async () => {
			try {
				const response = await axios.get(
					"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/"
				);
				setGenres(response.data);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchGenres();
	}, []);

	// Create genre
	const createGenre = async () => {
		if (!genreName) return;

		setIsCreating(true);

		try {
			const response = await axios.post(
				"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres",
				{ genre_name: genreName }
			);
			setGenres([...genres, response.data]);
			setGenreName("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsCreating(false);
		}
	};

	// Update genre
	const updateGenre = async () => {
		if (!selectedGenre || !genreName) return;

		setIsUpdating(true);

		try {
			const response = await axios.put(
				`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/${selectedGenre}`,
				{ genre_name: genreName }
			);
			setGenres(
				genres.map((genre) =>
					genre.id === selectedGenre ? response.data : genre
				)
			);
			setSelectedGenre(null);
			setGenreName("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsUpdating(false);
		}
	};

	// Delete genre
	const deleteGenre = async () => {
		if (!selectedGenre) return;

		setIsDeleting(true);

		try {
			await axios.delete(
				`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/${selectedGenre}`
			);
			setGenres(genres.filter((genre) => genre.id !== selectedGenre));
			setSelectedGenre(null);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleGenreSelect = (genreId) => {
		setSelectedGenre(genreId);
		setGenreName(genres.find((genre) => genre.id === genreId).genre_name);
	};

	// Filtered genres based on search query
	const filteredGenres = genres.filter(genre =>
		genre.genre_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="h-screen flex ">
			<Sidebar />
			<div className="w-full bg-[#BF2EF0] p-4 overflow-auto mt-2 mb-2 mr-2">
				<AdminNavbar />
				<div className="w-1/3">
				<input
						type="text"
						placeholder="Search genres..."
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
						Create Genre
					</button>
					<details className="dropdown">
						<summary className="btn m-1 bg-white hover:bg-white hover:text-black text-black">
							Actions
						</summary>
						<ul className="menu dropdown-content bg-white rounded-box z-[1] w-52 p-2 shadow">
							<li
								className="bg-white text-black"
								onClick={() => document.getElementById("my_modal_3").showModal()}
							>
								<a>Update</a>
							</li>
							<li
								className="bg-white text-black"
								onClick={() => document.getElementById("my_modal_1").showModal()}
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
									onClick={deleteGenre}
									disabled={isDeleting}
								>
									{isDeleting ? "Deleting..." : "Delete"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Create Genre Modal */}
				<dialog id="my_modal_2" className="modal">
					<div className="modal-box bg-[#BF2EF0]">
						<h3 className="font-bold text-lg">CREATE</h3>
						<form className="flex flex-col space-y-3">
							<label className="">Enter Genre:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={genreName}
								onChange={(e) => setGenreName(e.target.value)}
							></input>
						</form>

						<div className="modal-action">
							<form method="dialog" className="flex flex-row space-x-2">
								<button className="btn">Close</button>
								<button
									type="button"
									className="btn btn-warning"
									onClick={createGenre}
									disabled={isCreating}
								>
									{isCreating ? "Creating..." : "Create"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Update Genre Modal */}
				<dialog id="my_modal_3" className="modal">
					<div className="modal-box">
						<h3 className="font-bold text-lg">UPDATE</h3>
						<form className="flex flex-col space-y-3">
							<label className="">Updated Genre:</label>
							<input
								className="text-white mb-6 p-2 rounded border border-purple-600"
								type="text"
								value={genreName}
								onChange={(e) => setGenreName(e.target.value)}
							></input>
						</form>

						<div className="modal-action">
							<form method="dialog" className="flex flex-row space-x-2">
								<button className="btn">Close</button>
								<button
									type="button"
									className="btn btn-warning"
									onClick={updateGenre}
									disabled={isUpdating}
								>
									{isUpdating ? "Updating..." : "Update"}
								</button>
							</form>
						</div>
					</div>
				</dialog>

				{/* Genre List */}
				<div className="overflow-x-auto text-white">
					{error && <p className="text-red-500">Error: {error}</p>}
					{!error && genres.length === 0 && <p>Loading...</p>}
					{filteredGenres.length > 0 && (
						<table className="table">
							<thead>
								<tr>
									<th></th>
									<th className="text-white">Genre</th>
								</tr>
							</thead>
							<tbody className="text-white">
								{filteredGenres.map((genre) => (
									<tr
										key={genre.id}
										className={`cursor-pointer hover:bg-black ${
											selectedGenre === genre.id ? "selected-row" : ""
										}`}
										onClick={() => handleGenreSelect(genre.id)}
									>
										<td>
											<input
												type="radio"
												name="genreSelect"
												checked={selectedGenre === genre.id}
												onChange={() => handleGenreSelect(genre.id)}
											/>
										</td>
										<td className="text-white">{genre.genre_name}</td>
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

export default GenreManagement;
