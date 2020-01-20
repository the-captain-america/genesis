import thunk from "redux-thunk";
import { applyMiddleware, createStore, compose } from "redux";
import { RootReducer } from "../reducers";

export const middleware = store => next => action => {
  next(action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const configureStore = (initialState = {}) =>
  createStore(
    RootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
