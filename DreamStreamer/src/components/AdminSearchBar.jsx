import { assets } from "../assets/assets";

const  AdminSearchBar = () => { 

    return (
    	<div className="flex-grow flex justify-center m-10">
				<div className="search" id="AdminSearchBar">
					<input
						type="text"
						className="searchTerm text-white"
						placeholder="What do you want to play?"
						aria-label="Search"
					/>
					<button type="submit" className="searchButton" aria-label="Search">
					<img src={assets.search} alt="" />
					</button>
				</div>
			</div>
    );
}

export default AdminSearchBar;