import { todolistApi, TodolistType } from '../../api/todolist-api';
import { AppStatusType, setAppStatus } from '../../app/app-reducer';
import { ThunkType } from '../../app/store';
import {
	handlerServerNetworkError,
	handleServerAppError,
} from '../../utils/error-utils';
import { fetchTasksTC } from './tasks-reducer';

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
	state = initialState,
	action: TodolistsActionsType
): Array<TodolistDomainType> => {
	switch (action.type) {
		case 'TODOS/SET-TODOLISTS':
			return action.todolists.map((tl) => ({
				...tl,
				filter: 'all',
				entityStatus: 'idle',
			}));
		case 'TODOS/ADD-TODOLIST':
			const newTodolist: TodolistDomainType = {
				...action.todolist,
				filter: 'all',
				entityStatus: 'idle',
			};
			return [newTodolist, ...state];
		case 'TODOS/REMOVE-TODOLIST':
			return state.filter((f) => f.id !== action.id);
		case 'TODOS/CHANGE-TODOLIST-TITLE':
			return state.map((m) =>
				m.id === action.todolistId ? { ...m, title: action.title } : m
			);
		case 'TODOS/CHANGE-TODOLIST-FILTER':
			return state.map((m) =>
				m.id === action.id ? { ...m, filter: action.filter } : m
			);
		case 'TODOS/CHANGE-TODOLIST-ENTITY-STATUS':
			return state.map((m) =>
				m.id === action.id
					? { ...m, entityStatus: action.entityStatus }
					: m
			);
		case 'TODOS/CLEAR-TODOS-DATA':
			return [];
		default:
			return state;
	}
};

// Actions

export const setTodolists = (todolists: Array<TodolistType>) => {
	return { type: 'TODOS/SET-TODOLISTS', todolists } as const;
};
export const removeTodolist = (todolistID: string) => {
	return { type: 'TODOS/REMOVE-TODOLIST', id: todolistID } as const;
};
export const addTodolist = (todolist: TodolistType) => {
	return { type: 'TODOS/ADD-TODOLIST', todolist } as const;
};
export const changeTodolistTitle = (todolistId: string, title: string) => {
	return { type: 'TODOS/CHANGE-TODOLIST-TITLE', todolistId, title } as const;
};
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => {
	return { type: 'TODOS/CHANGE-TODOLIST-FILTER', id, filter } as const;
};
export const changeTodolistEntityStatus = (
	id: string,
	entityStatus: AppStatusType
) => {
	return {
		type: 'TODOS/CHANGE-TODOLIST-ENTITY-STATUS',
		id,
		entityStatus,
	} as const;
};
export const clearTodosData = () =>
	({ type: 'TODOS/CLEAR-TODOS-DATA' } as const);

// Thunks

export const fetchTodolistsTC = (): ThunkType => async (dispatch) => {
	dispatch(setAppStatus('loading'));
	try {
		const res = await todolistApi.getTodolists();
		dispatch(setTodolists(res.data));
		try {
			res.data.forEach((tl) => {
				dispatch(fetchTasksTC(tl.id));
				dispatch(setAppStatus('succeeded'));
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
		dispatch(setAppStatus('loading'));
		dispatch(changeTodolistEntityStatus(todolistId, 'loading'));
		try {
			const res = await todolistApi.removeTodolist(todolistId);
			if (res.data.resultCode === 0) {
				dispatch(removeTodolist(todolistId));
				dispatch(setAppStatus('succeeded'));
			} else {
				handleServerAppError(res.data, dispatch);
				dispatch(changeTodolistEntityStatus(todolistId, 'failed'));
			}
		} catch (e) {
			handlerServerNetworkError(e as Error, dispatch);
			dispatch(changeTodolistEntityStatus(todolistId, 'failed'));
		}
	};

export const addTodolistTC =
	(title: string): ThunkType =>
	async (dispatch) => {
		dispatch(setAppStatus('loading'));
		try {
			const res = await todolistApi.addTodolist(title);
			if (res.data.resultCode === 0) {
				dispatch(addTodolist(res.data.data.item));
				dispatch(setAppStatus('succeeded'));
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
		dispatch(setAppStatus('loading'));
		try {
			const res = await todolistApi.changeTodolistTitle(
				todolistId,
				title
			);
			if (res.data.resultCode === 0) {
				dispatch(changeTodolistTitle(todolistId, title));
				dispatch(setAppStatus('succeeded'));
			} else {
				handleServerAppError(res.data, dispatch);
			}
		} catch (e) {
			handlerServerNetworkError(e as Error, dispatch);
		}
	};

// Types

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType;
	entityStatus: AppStatusType;
};

export type TodolistsActionsType =
	| RemoveTodolistType
	| AddTodolistType
	| ReturnType<typeof changeTodolistTitle>
	| ReturnType<typeof changeTodolistFilter>
	| SetTodolistType
	| ReturnType<typeof changeTodolistEntityStatus>
	| ClearTodosData;

export type AddTodolistType = ReturnType<typeof addTodolist>;
export type RemoveTodolistType = ReturnType<typeof removeTodolist>;
export type SetTodolistType = ReturnType<typeof setTodolists>;
export type ClearTodosData = ReturnType<typeof clearTodosData>;
