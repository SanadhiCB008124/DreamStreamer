import {
  FETCH_ALBUMS_SUCCESS,
  FETCH_ARTISTS_SUCCESS,
  FETCH_GENRES_SUCCESS,
  FETCH_TRACKS_SUCCESS,
  FETCH_CLICKS_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_USERS_SUCCESS
} from "../actions/dataActions";

const initialState = {
  albums: [],
  artists: [],
  genres: [],
  tracks: [],
  clicks:[],
  users:[],
  error: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALBUMS_SUCCESS:
      return { ...state, albums: action.payload };
    case FETCH_ARTISTS_SUCCESS:
      return { ...state, artists: action.payload };
    case FETCH_GENRES_SUCCESS:
      return { ...state, genres: action.payload };
    case FETCH_TRACKS_SUCCESS:
      return { ...state, tracks: action.payload };
    case FETCH_DATA_FAILURE:
      return { ...state, error: action.payload };
    case FETCH_CLICKS_SUCCESS:
      return { ...state, clicks: action.payload };
    case FETCH_USERS_SUCCESS:
      return{...state, users:action.payload};
    
    default:
      return state;
  }
};

export default dataReducer;
