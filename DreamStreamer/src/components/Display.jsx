import { Routes, Route, useLocation } from "react-router-dom";
import DisplayHome from "./DisplayHome";
import DisplayAlbum from "./DisplayAlbum";
import { useEffect, useRef } from "react";
import { albumsData } from "../assets/assets";
import DisplayGenre from "./DisplayGenre";
import Album from "./Album";
import Artists from "./Artists";
import Login from "./Login";
import SignUp from "./SignUp";

const Display = () => {
	const displayRef = useRef();
	const location = useLocation();
	const isAlbum = location.pathname.includes("album");
	const albumId = isAlbum ? location.pathname.slice(-1) : "";
	const bgColor = albumsData[Number(albumId)].bgColor;

	useEffect(() => {
		if (isAlbum) {
			displayRef.current.style.background = `linear-gradient(${bgColor}, #121212 )`;
		} else {
			displayRef.current.style.background = ` #121212`;
		}
	});

	return (
		<div
			ref={displayRef}
			className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
		>
			<Routes>
				<Route path="/" element={<DisplayHome />} />
				<Route path="/album/:id" element={<DisplayAlbum />} />
				<Route path="/genres" element={<DisplayGenre />} />
				<Route path="/displayAlbums"  element={<Album/>} />
				<Route path="/artists" element={<Artists/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/signUp" element={<SignUp/>}/>
			</Routes>
		</div>
	);
};

export default Display;
