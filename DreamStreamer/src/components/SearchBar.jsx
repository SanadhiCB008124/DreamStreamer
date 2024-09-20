import { useState, useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AccountContext } from "./Account";
import axios from 'axios';  // Use axios to make API calls

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const { getSession } = useContext(AccountContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchResults, setSearchResults] = useState([]);  // State to store search results

    useEffect(() => {
        getSession().then((session) => {
            const email = session.idToken.payload.email;
            const groups = session.idToken.payload["cognito:groups"];
            setUserEmail(email);
            setStatus(true);

            // If the user is in the Admin group, set isAdmin to true
            if (groups && groups.includes("Admin")) {
                setIsAdmin(true);
            }
        });
    }, [getSession]);

    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(
                'https://rhxe1mpbhk.execute-api.us-east-1.amazonaws.com/dev/search',
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ),
            const artistResponse = await axios.get(
                `https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/`
            );
            const albumResponse = await axios.get(
                `https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/`
            );
            const genreResponse = await axios.get(
                `https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/`
            );

            console.log("Search Results:", response.data);
            setSearchResults(response.data);  // Store search results

        } catch (error) {
            console.error("Search error", error);

    }

    const handleSearch = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'https://rhxe1mpbhk.execute-api.us-east-1.amazonaws.com/dev/search', 
                {
                    searchTerm: searchTerm,
                    role: isAdmin ? 'admin' : 'user'  
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Search Results:", response.data);
            setSearchResults(response.data);  // Store search results

        } catch (error) {
            console.error("Search error", error);
        }
    };

    return (
        <div className="flex justify-center m-10">
            <form className="search" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="searchTerm text-white"
                    placeholder="What do you want to play?"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <button type="submit" className="searchButton" aria-label="Search">
                    <img src={assets.search} alt="" />
                </button>
            </form>

            {searchResults.length > 0 && (
                <ul className="dropdown">  
                    {searchResults.map((result, index) => (
                        <li key={index} className="dropdown-item">
                            {result.type}: {result.name}  
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
