import AdminNavbar from "./AdminNavbar"

import Analytics from "./Analytics"

import Sidebar from "./Sidebar"

const Admin = () => {
  return (
    <div className=" h-screen flex">
       <Sidebar />
       <div className="w-full bg-[#BF2EF0] text-white  p-4 overflow-auto mt-2 mb-2 mr-2">
        <AdminNavbar/>
   
               <Analytics/>
            </div>
    </div>
  )
}

export default Admin
