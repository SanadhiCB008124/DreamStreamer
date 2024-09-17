import AdminNavbar from "./AdminNavbar"
import Sidebar from "./Sidebar"

const Admin = () => {
  return (
    <div className=" h-screen flex">
       <Sidebar />
       <div className="w-full bg-[#4b1842] p-4 overflow-auto mt-2 mb-2 mr-2">
        <AdminNavbar/>
                <h1 className="text-3xl text-white font-bold mb-4 mt-10">Admin Panel</h1>
                <div className="flex flex-wrap text-white">
                   <p>helo</p>
                </div>
            </div>
    </div>
  )
}

export default Admin
