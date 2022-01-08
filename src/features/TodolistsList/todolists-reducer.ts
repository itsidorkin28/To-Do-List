import {todolistApi, TodolistType} from '../../api/todolist-api';
import {RequestStatusType, setAppStatus} from '../../app/app-reducer';
import {ThunkType} from '../../app/store';
import {handlerServerNetworkError, handleServerAppError} from '../../utils/error-utils';
import {fetchTasksTC} from './tasks-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType;
	entityStatus: RequestStatusType;
};

const initialState: Array<TodolistDomainType> = [];


const slice = createSlice({
	name: 'todolists',
	initialState,
	reducers: {
		setTodolists(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
			return action.payload.todolists.map((tl) => ({
				...tl,
				filter: 'all',
				entityStatus: 'idle',
			}));
		},
		removeTodolist(state, action: PayloadAction<{ todolistId: string }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId);
			if (index > -1) {
				state.splice(index, 1);
			}
		},
		addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
			state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
		},
		changeTodolistTitle(state, action: PayloadAction<{ todolistId: string, title: string }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId);
			if (index > -1) {
				state[index].title = action.payload.title;
			}
		},
		changeTodolistFilter(state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId);
			if (index > -1) {
				state[index].filter = action.payload.filter;
			}
		},
		changeTodolistEntityStatus(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
			const index = state.findIndex(tl => tl.id === action.payload.todolistId);
			if (index > -1) {
				state[index].entityStatus = action.payload.entityStatus;
			}
		},
		clearTodosData(state, action: PayloadAction<{}>) {
			return [];
		}
	}
});

export const todolistsReducer = slice.reducer;
export const {
	clearTodosData, changeTodolistEntityStatus, changeTodolistFilter,
	changeTodolistTitle, addTodolist, removeTodolist, setTodolists
} = slice.actions;

// Thunks

export const fetchTodolistsTC = (): ThunkType => async (dispatch) => {
	dispatch(setAppStatus({status: 'loading'}));
	try {
		const res = await todolistApi.getTodolists();
		dispatch(setTodolists({todolists: res.data}));
		try {
			res.data.forEach((tl) => {
				dispatch(fetchTasksTC(tl.id));
				dispatch(setAppStatus({status: 'succeeded'}));
			});
		} catch (e) {
			handlerServerNetworkError(e as Error, dispatch);
		}
	} catch (e) {
		handlerServerNetworkError(e as Error, dispatch);
	}
};

export const removeTodolistTC =
	(todolistId: string): ThunkType =>
		async (dispatch) => {
			dispatch(setAppStatus({status: 'loading'}));
			dispatch(changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}));
			try {
				const res = await todolistApi.removeTodolist(todolistId);
				if (res.data.resultCode === 0) {
					dispatch(removeTodolist({todolistId}));
					dispatch(setAppStatus({status: 'succeeded'}));
				} else {
					handleServerAppError(res.data, dispatch);
					dispatch(changeTodolistEntityStatus({todolistId, entityStatus: 'failed'}));
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch);
				dispatch(changeTodolistEntityStatus({todolistId, entityStatus: 'failed'}));
			}
		};

export const addTodolistTC =
	(title: string): ThunkType =>
		async (dispatch) => {
			dispatch(setAppStatus({status: 'loading'}));
			try {
				const res = await todolistApi.addTodolist(title);
				if (res.data.resultCode === 0) {
					dispatch(addTodolist({todolist: res.data.data.item}));
					dispatch(setAppStatus({status: 'succeeded'}));
				} else {
					handleServerAppError(res.data, dispatch);
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch);
			}
		};

export const changeTodolistTitleTC =
	(todolistId: string, title: string): ThunkType =>
		async (dispatch) => {
			dispatch(setAppStatus({status: 'loading'}));
			try {
				const res = await todolistApi.changeTodolistTitle(todolistId, title);
				if (res.data.resultCode === 0) {
					dispatch(changeTodolistTitle({todolistId, title}));
					dispatch(setAppStatus({status: 'succeeded'}));
				} else {
					handleServerAppError(res.data, dispatch);
				}
			} catch (e) {
				handlerServerNetworkError(e as Error, dispatch);
			}
		};




