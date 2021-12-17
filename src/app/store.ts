import {applyMiddleware, combineReducers, createStore } from "redux";
import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import thunkMiddleware from 'redux-thunk';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
})

export type AppRootStateType = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))



// @ts-ignore
window.store = store
