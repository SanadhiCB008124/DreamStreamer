/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const AlbumItem = ({ image, name, id }) => {
    const navigate = useNavigate();

    return (
      <div>
         <div
            onClick={() => navigate(`/album/${id}`)}
            className="flex flex-col justify-around cursor-pointer items-center mx-2"
        >
            <img className="w-44 h-44 rounded object-cover " src={image} alt={name} />
            <p className="font-bold mt-2 mb-1">{name}</p>
           
        </div>

        
      </div>
       
    );
};

export default AlbumItem;
