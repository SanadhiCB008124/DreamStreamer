import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

const GenreManagemet = () => {
	const [genres, setGenres] = useState([]);
	const [error, setError] = useState(null);
	const [selectedGenre, setSelectedGenre] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [genreName, setGenreName] = useState("");

	//fetching genres
	useEffect(() => {
		const fetchGenres = async () => {
			try {
				const response = await fetch(
					"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/",
					{
						method: "GET",
					}
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
					setGenres(parsedData);
				} else {
					setGenres(data);
				}
			} catch (error) {
				setError(error.message);
			}
		};

		fetchGenres();
	}, []);

	//create genre
	const createGenre = async () => {
		if (!genreName) return;

		setIsCreating(true);

		try {
			const response = await fetch(
				"https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ genre_name: genreName }),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create genre");
			}

			const newGenre = await response.json();
			setGenres([...genres, newGenre]);
			setGenreName("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsCreating(false);
		}
	};

	//update genre

	const updateGenre = async () => {
		if (!selectedGenre || !genreName) return;

		setIsUpdating(true);

		try {
			const response = await fetch(
				`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/${selectedGenre}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ genre_name: genreName }),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update Genre");
			}

			const updatedGenre = await response.json();
			setGenres(
				genres.map((genre) =>
					genre.id === selectedGenre ? updatedGenre : genre
				)
			);
			selectedGenre(null);
			setGenreName("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsUpdating(false);
		}
	};

	//delete genre
	const deleteGenre = async () => {
		if (!selectedGenre) return;

		setIsDeleting(true);

		try {
			const response = await fetch(
				`https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/${selectedGenre}`,
				{ method: "DELETE" }
			);

			if (!response.ok) {
				throw new Error("Failed to delete genre");
			}

			setGenres(genres.filter((genre) => genre.id !== selectedGenre));
			selectedGenre;
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

	return (
		<div className="h-screen flex ">
			<Sidebar />
			<div className="w-full bg-[#390F0B] p-4 overflow-auto mt-2 mb-2 mr-2">
				<AdminNavbar />

				<h1 className="text-3xl text-white font-bold mb-4 mt-10">
					Admin Panel
				</h1>
				<div className="flex flex-row items-end justify-end mr-40">
					<button
						className="btn btn-warning m-1"
						onClick={() => document.getElementById("my_modal_2").showModal()}
					>
						Create Genre
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
					<div className="modal-box">
						<h3 className="font-bold text-lg">DELETE</h3>
						<p className="py-4">Are you sure you want to delete this entry?</p>
						<div className="modal-action">
							<form method="dialog" className="flex flex-row space-x-2">
								<button className="btn">Close</button>
								<button
									type="button"
									className="btn btn-error"
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
					<div className="modal-box">
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
				<div className="overflow-x-auto">
					{error && <p className="text-red-500">Error: {error}</p>}
					{!error && genres.length === 0 && <p>Loading...</p>}
					{genres.length > 0 && (
						<table className="table">
							<thead>
								<tr>
									<th></th>
									<th>#</th>
									<th>Genre</th>
								</tr>
							</thead>
							<tbody>
								{genres.map((genre, index) => (
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
												name="genreeSelect"
												checked={selectedGenre === genre.id}
												onChange={() => handleGenreSelect(genre.id)}
											/>
										</td>
										<td>{index + 1}</td>
										<td>{genre.genre_name}</td>
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

export default GenreManagemet;
