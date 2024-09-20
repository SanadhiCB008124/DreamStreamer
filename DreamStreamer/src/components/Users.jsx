import AdminNavbar from "./AdminNavbar";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch users from the API Gateway
    const getUsers = async () => {
        try {
            const response = await axios.get(
                "https://keaszs81qc.execute-api.us-east-1.amazonaws.com/dev/users"
            );
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    // Delete a user using Axios
    const deleteUser = async () => {
        if (!selectedUser) return;
        setIsDeleting(true);

        try {
            const response = await axios.delete(
                `https://keaszs81qc.execute-api.us-east-1.amazonaws.com/dev/users`,
                { data: { username: selectedUser } }
            );
            console.log(response); // Optionally, handle the response

            // Refresh users after deletion
            getUsers();
            setSelectedUser(null);
            setIsDeleting(false);
            document.getElementById("my_modal_1").close();
        } catch (error) {
            console.error("Error deleting user:", error);
            setIsDeleting(false);
        }
    };

    const handleUserSelect = (username) => {
        setSelectedUser(username);
    };

    return (
        <div className="h-screen flex">
            <Sidebar />
            <div className="w-full bg-[#390F0B] p-4 overflow-auto mt-2 mb-2 mr-2">
                <AdminNavbar />
               
                <div className="flex flex-row items-end justify-end mr-40 mb-7">
                    <ul className="menu dropdown-content bg-white rounded-box z-[1] w-52 p-2 shadow">
                        <li
                            className="bg-white text-black"
                            onClick={() =>
                                document.getElementById("my_modal_1").showModal()
                            }
                        >
                            <a>Delete</a>
                        </li>
                    </ul>
                </div>

                {/* Delete Confirmation Modal */}
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">DELETE</h3>
                        <p className="py-4">Are you sure you want to delete this user?</p>
                        <div className="modal-action">
                            <form method="dialog" className="flex flex-row space-x-2">
                                <button className="btn">Close</button>
                                <button
                                    type="button"
                                    className="btn btn-error"
                                    onClick={deleteUser} 
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>

                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const emailAttr = user.Attributes.find(
                                (attr) => attr.Name === "email"
                            );
                            return (
                                <tr className="hover:bg-purple-800" key={user.Username}>
                                    <td>
                                        <input
                                            type="radio"
                                            name="user"
                                            checked={selectedUser === user.Username}
                                            onChange={() => handleUserSelect(user.Username)}
                                        />
                                    </td>
                                    <td>{user.Username}</td>
                                    <td>{user.UserStatus}</td>
                                    <td>{emailAttr ? emailAttr.Value : "No Email"}</td>
                                </tr>
                            );
                       

                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
