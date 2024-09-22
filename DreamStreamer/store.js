import { createStore, applyMiddleware, combineReducers } from "redux";
import promise from 'redux-promise'; // Default import
import dataReducer from "./reducers/dataReducer";
import authReducer, { LOGIN_SUCCESS } from "./reducers/authReducer";
import { thunk } from "redux-thunk";

const rootReducer = combineReducers({
    data: dataReducer,
    auth: authReducer,
});

const middleware = [promise];
const store = createStore(rootReducer, applyMiddleware(thunk, ...middleware));

export { LOGIN_SUCCESS };
export default store;
