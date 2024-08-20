import { Routes, Route } from "react-router-dom";
import "./index.css";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import DisplayGenre from "./components/DisplayGenre.jsx";
import Album from "./components/Album.jsx";
import Artists from "./components/Artists.jsx";
import DisplayHome from "./components/DisplayHome.jsx";
import DisplayAlbum from "./components/DisplayAlbum.jsx";
import Home from "./components/Home.jsx"
function App() {
	
	return (
		<div className="h-screen bg-black">
		
		<Routes>
		<Route path="/" element={<Login />} />
				<Route path="/album/:id" element={<DisplayAlbum />} />
				<Route path="/genres" element={<DisplayGenre />} />
				<Route path="/displayAlbums"  element={<Album/>} />
				<Route path="/artists" element={<Artists/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/displayHome" element={<DisplayHome/>}/>
				<Route path="/signUp" element={<SignUp/>}/>
				<Route path="/home" element={<Home/>}/>
      </Routes>
		
		</div>
	);
}

export default App;
