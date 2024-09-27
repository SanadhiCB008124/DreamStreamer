import { Routes, Route } from "react-router-dom";
import "./index.css";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import DisplayGenre from "./components/DisplayGenre.jsx";
import Album from "./components/Album.jsx";
import Artists from "./components/Artists.jsx";
import DisplayHome from "./components/DisplayHome.jsx";
import DisplayAlbum from "./components/DisplayAlbum.jsx";
import Home from "./components/Home.jsx";
import Admin from "./components/Admin.jsx";
import DisplayArtist from "./components/DisplayArtist.jsx";
import { Account } from "./components/Account";
import Status from "./components/Status.jsx";
import GenreDetails from "./components/GenreDetails.jsx";
import Tracks from "./components/Tracks.jsx";
import ArtistManagement from "./components/ArtistManagement.jsx";
import AlbumManagement from "./components/AlbumManagement.jsx";
import GenreManagemet from "./components/GenreManagemet.jsx";
import { Provider } from "react-redux";
import store from "../store.js";
import Users from "./components/Users.jsx";
import SearchBar from "./components/SearchBar.jsx";
import AdminSearchBar from "./components/AdminSearchBar.jsx";

function App() {
	return (
		<Provider store={store}>
		<Account>
			<Status />
			<div className="h-screen bg-black">
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/album/:id" element={<DisplayAlbum />} />
					<Route path="/genre/:id" element={<GenreDetails />} />
					<Route path="/genres" element={<DisplayGenre />} />
					<Route path="/displayAlbums" element={<Album />} />
					<Route path="/displayArtists" element={<Artists />} />
					<Route path="/artist/:id" element={<DisplayArtist />} />
					<Route path="/login" element={<Login />} />
					<Route path="/displayHome" element={<DisplayHome />} />
					<Route path="/signUp" element={<SignUp />} />
					<Route path="/home" element={<Home />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/tracks" element={<Tracks />} />
					<Route path="/artistManagement" element={<ArtistManagement />} />
					<Route path="/albumManagement" element={<AlbumManagement />} />
					<Route path="/genreManagement" element={<GenreManagemet />} />
					<Route path="/users" element={<Users />} />
					<Route path="/search" element={<SearchBar />} />
					<Route path="/adminSearch" element={<AdminSearchBar />} />
					<Route path="/confirmSignUp" element={<h1>Confirm Sign Up</h1>} />
				</Routes>
			</div>
		</Account>
		</Provider>
	);
}

export default App;
