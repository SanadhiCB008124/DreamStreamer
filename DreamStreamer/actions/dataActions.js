import axios from "axios";


export const FETCH_ALBUMS_SUCCESS = "FETCH_ALBUMS_SUCCESS";
export const FETCH_ARTISTS_SUCCESS = "FETCH_ARTISTS_SUCCESS";
export const FETCH_GENRES_SUCCESS = "FETCH_GENRES_SUCCESS";
export const FETCH_TRACKS_SUCCESS = "FETCH_TRACKS_SUCCESS";
export const FETCH_DATA_FAILURE = "FETCH_DATA_FAILURE";
export const FETCH_CLICKS_SUCCESS = "FETCH_CLICKS_SUCCESS";
export const FETCH_USERS_SUCCESS="FETCH_USERS_SUCCESS";

// fetch Albums Action
export const fetchAlbums = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://5rwdpvx0dh.execute-api.us-east-1.amazonaws.com/dev/albums/"
    );
    dispatch({ type: FETCH_ALBUMS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
  }
};

// fetch Artists Action
export const fetchArtists = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://acdfbon68b.execute-api.us-east-1.amazonaws.com/dev/artists/"
    );
    dispatch({ type: FETCH_ARTISTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
  }
};

// fetch Genres Action
export const fetchGenres = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://651m58cs08.execute-api.us-east-1.amazonaws.com/dev/genres/"
    );
    dispatch({ type: FETCH_GENRES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
  }
};

//  racks Action
export const fetchTracks = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://q6b4jpy70l.execute-api.us-east-1.amazonaws.com/dev/tracks/"
    );
    dispatch({ type: FETCH_TRACKS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
  }
};

// fetch Clicks Action
export const fetchClicks = () => async (dispatch) => {
  try {
    const response = await axios.get(
      "https://kyldp9nld9.execute-api.us-east-1.amazonaws.com/dev/clicks"
    );
    dispatch({ type: FETCH_CLICKS_SUCCESS , payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
  }
};


//fetch users
export const fetchUsers= () => async (dispatch) => {
  try {
    const response = await axios.get(
         "https://keaszs81qc.execute-api.us-east-1.amazonaws.com/dev/users"
    );
    dispatch({ type: FETCH_USERS_SUCCESS , payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_DATA_FAILURE, payload: error.message });
  }
};