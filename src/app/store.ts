import { applyMiddleware, combineReducers, createStore } from 'redux';
import {
	TasksActionsType,
	tasksReducer,
} from '../features/TodolistsList/tasks-reducer';
import {
	TodolistsActionsType,
	todolistsReducer,
} from '../features/TodolistsList/todolists-reducer';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { AppActionsType, appReducer } from './app-reducer';
import { AuthActionsType, authReducer } from '../features/Login/auth-reducer';

const rootReducer = combineReducers({
	todolists: todolistsReducer,
	tasks: tasksReducer,
	app: appReducer,
	auth: authReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type RootAppActionsType =
	| TodolistsActionsType
	| TasksActionsType
	| AppActionsType
	| AuthActionsType;

export type ThunkType = ThunkAction<
	void,
	AppRootStateType,
	unknown,
	RootAppActionsType
>;

// @ts-ignore
window.store = store;
