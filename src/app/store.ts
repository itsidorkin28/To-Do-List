import {combineReducers} from 'redux';
import {
	tasksReducer,
} from '../features/TodolistsList/tasks-reducer';
import {
	todolistsReducer,
} from '../features/TodolistsList/todolists-reducer';
import thunkMiddleware, {ThunkAction} from 'redux-thunk';
import {appReducer} from './app-reducer';
import {authReducer} from '../features/Login/auth-reducer';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
	todolists: todolistsReducer,
	tasks: tasksReducer,
	app: appReducer,
	auth: authReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
});

export type ThunkType = ThunkAction<void, RootStateType, unknown, any>;

// @ts-ignore
window.store = store;
